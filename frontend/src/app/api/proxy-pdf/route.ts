import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new Response("Missing url", { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!res.ok) {
      return new Response(`Failed to fetch PDF: ${res.statusText}`, {
        status: res.status,
      });
    }

    const blob = await res.arrayBuffer();

    // Get filename from URL or use default
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1] || "document.pdf";

    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*", // Important for CORS
      },
    });
  } catch (error) {
    console.error("PDF proxy error:", error);
    return new Response(
      `Failed to fetch PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      {
        status: 500,
      }
    );
  }
}
