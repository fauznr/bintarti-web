import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  try {
    const driveUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download`;
    const response = await fetch(driveUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      }
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch from Google Drive", { status: response.status });
    }

    const newHeaders = new Headers(response.headers);
    // Remove content-disposition so the browser treats it as a stream, not a download
    newHeaders.delete("content-disposition");
    // Ensure content-type is set (fallback to audio/mpeg if missing)
    if (!newHeaders.has("content-type")) {
      newHeaders.set("content-type", "audio/mpeg");
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (error) {
    console.error("Audio proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
