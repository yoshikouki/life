import type { MetadataRoute } from "next";
import { description } from "./metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "yoshikouki",
    short_name: "yoshikouki",
    description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/logo.webp",
        sizes: "600x600",
        type: "image/webp",
      },
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
}
