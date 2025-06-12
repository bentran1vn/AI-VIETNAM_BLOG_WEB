"use client";

import { useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexRendererProps {
  content: string;
}

export default function LatexRenderer({ content }: LatexRendererProps) {
  useEffect(() => {
    // Find all LaTeX expressions in the content
    const latexRegex = /\$\$(.*?)\$\$|\$(.*?)\$/g;
    const htmlContent = content.replace(
      latexRegex,
      (match, display, inline) => {
        try {
          if (display) {
            // Display mode ($$...$$)
            return katex.renderToString(display, { displayMode: true });
          } else if (inline) {
            // Inline mode ($...$)
            return katex.renderToString(inline, { displayMode: false });
          }
        } catch (error) {
          console.error("Error rendering LaTeX:", error);
          return match;
        }
        return match;
      }
    );

    // Update the content
    const container = document.getElementById("latex-content");
    if (container) {
      container.innerHTML = htmlContent;
    }
  }, [content]);

  return <div id="latex-content" className="prose max-w-none" />;
}
