"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function BlogPdfViewer({ pdfBlob }: { pdfBlob: Blob }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1.2);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Error Message */}
      {error && (
        <div className="text-red-600 p-4 bg-red-50 rounded border border-red-200 w-full text-center mb-4">
          <div className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Error: {error}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="w-full sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 mb-6 p-2 md:p-3 bg-white rounded border border-gray-200">
        {/* Page info */}
        <div className="text-xs md:text-sm text-gray-600 font-medium">
          {numPages ? `${numPages} pages` : "Loading..."}
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <button
            onClick={() => changeScale(Math.max(0.5, scale - 0.2))}
            disabled={scale <= 0.5}
            className="p-1 md:p-1.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Zoom out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          <span className="text-xs md:text-sm font-medium w-12 md:w-16 text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={() => changeScale(Math.min(3, scale + 0.2))}
            disabled={scale >= 3}
            className="p-1 md:p-1.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Zoom in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          <button
            onClick={() => changeScale(1.2)}
            className="p-1 md:p-1.5 rounded bg-gray-100 hover:bg-gray-200 transition ml-1"
            aria-label="Reset zoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z"></path>
              <path d="M9 12h6"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="pdf-container w-full max-w-full overflow-x-auto">
        {pdfUrl ? (
          <Document
            file={pdfBlob}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center h-96 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700 mb-4"></div>
                <p className="text-gray-600 text-sm">Loading document...</p>
              </div>
            }
            error={
              <div className="text-red-600 p-6 bg-red-50 rounded border border-red-200 w-full text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 className="text-lg font-medium mb-2">
                  Failed to load document
                </h3>
                <p>Please try again later or download the file directly.</p>
              </div>
            }
            className="w-full"
          >
            {numPages &&
              Array.from(new Array(numPages), (el, index) => (
                <div
                  id={`pdf-page-${index + 1}`}
                  key={`page_wrapper_${index + 1}`}
                  className="my-4 md:my-6 bg-white rounded border border-gray-200 flex justify-center relative overflow-x-auto"
                >
                  <div className="absolute -left-4 md:-left-8 top-2 bg-gray-200 text-gray-700 text-xs font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                    {index + 1}
                  </div>
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={isMobile ? undefined : scale}
                    width={
                      isMobile
                        ? Math.min(window.innerWidth, 420) - 32
                        : undefined
                    }
                    renderTextLayer={!isMobile}
                    renderAnnotationLayer={true}
                    className="mx-auto p-2 md:p-4"
                    loading={
                      <div className="flex items-center justify-center h-96 w-full">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-700"></div>
                      </div>
                    }
                  />
                </div>
              ))}
          </Document>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 w-full bg-gray-50 rounded border border-gray-200 p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300 mb-4"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <div className="text-gray-500 text-center">
              <p className="text-base font-medium">No document loaded</p>
              <p className="text-sm mt-2">
                Select a document to view its contents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
