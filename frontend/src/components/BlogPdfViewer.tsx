"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up the worker source
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function BlogPdfViewer({ pdfBlob }: { pdfBlob: Blob }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1.2);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
    setError(error.message);
  }

  function changeScale(newScale: number) {
    setScale(newScale);
  }

  // Convert Blob to data URL for react-pdf
  const pdfUrl = pdfBlob ? URL.createObjectURL(pdfBlob) : null;

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    <div className="flex flex-col items-center p-0 my-0">
      {/* Error Message */}
      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg w-full text-center">
          Error: {error}
        </div>
      )}

      {/* Zoom Controls (optional, remove if not needed) */}
      <div className="w-full flex items-center justify-end gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
        <button
          onClick={() => changeScale(Math.max(0.5, scale - 0.2))}
          disabled={scale <= 0.5}
          className="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          -
        </button>
        <span className="text-sm">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => changeScale(Math.min(3, scale + 0.2))}
          disabled={scale >= 3}
          className="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => changeScale(1.2)}
          className="px-2 py-1 text-xs bg-gray-200 rounded ml-1"
          aria-label="Reset zoom"
        >
          Reset
        </button>
      </div>

      {/* PDF Document */}
      <div className="pdf-container w-full flex flex-col items-center">
        {pdfUrl ? (
          <Document
            file={pdfBlob}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-96 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
              </div>
            }
            error={
              <div className="text-red-500 p-4 bg-red-50 rounded-lg w-full text-center">
                Failed to load PDF. Please try again later.
              </div>
            }
            className="w-full"
          >
            {numPages &&
              Array.from(new Array(numPages), (el, index) => (
                <div
                  key={`page_wrapper_${index + 1}`}
                  className="my-6 p-4 bg-white rounded shadow-sm border border-slate-200 flex justify-center"
                >
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="mx-auto"
                    loading={
                      <div className="flex items-center justify-center h-96 w-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                      </div>
                    }
                  />
                </div>
              ))}
          </Document>
        ) : (
          <div className="flex items-center justify-center h-96 w-full">
            <div className="text-gray-500">No PDF document loaded</div>
          </div>
        )}
      </div>
    </div>
  );
}
