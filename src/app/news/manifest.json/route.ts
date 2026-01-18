import { newsManifest } from "@life/news";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(newsManifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
