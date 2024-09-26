import type { Metadata, Viewport } from "next";

export const title = "yoshikouki | Web Developer & Engineer";
export const description =
  "yoshikouki の作品と自己紹介を掲載するポートフォリオ。鹿児島在住の開発者。Web を主軸とした創作活動が趣味。Web3、プロダクト開発、コミュニティ活動などに興味を示す。";

export const metadata: Metadata = {
  metadataBase: new URL("https://yoshikouki.com/"),
  title,
  description,
  keywords: [],
  authors: { name: "yoshikouki", url: "https://yoshikouki.com/" },
  icons: [
    {
      url: "/logo.webp",
      sizes: "1200x1200",
      type: "image/webp",
      color: "#000000",
      fetchPriority: "high",
    },
    {
      url: "/icon-192x192.webp",
      sizes: "192x192",
      type: "image/webp",
      color: "#000000",
      fetchPriority: "auto",
    },
    {
      url: "/icon-512x512.webp",
      sizes: "512x512",
      type: "image/webp",
      color: "#000000",
      fetchPriority: "auto",
    },
  ],
  robots: "index, follow",
  openGraph: {
    url: "/",
    title,
    description,
    images: [
      {
        url: "/favicon.ico",
        alt: title,
        width: 256,
        height: 256,
      },
      {
        url: "/logo.webp",
        alt: title,
        width: 1200,
        height: 1200,
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@yoshikouki_",
    creator: "@yoshikouki_",
    title,
    description,
    images: "/logo.webp",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};
