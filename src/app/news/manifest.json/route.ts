import { NextResponse } from "next/server";

export function GET() {
  const manifest = {
    name: "News - yoshikouki",
    short_name: "News",
    description: "RSS feed updates",
    start_url: "/news",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        src: "/icon-512x512.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
