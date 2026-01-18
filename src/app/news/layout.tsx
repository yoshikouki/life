import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/news/manifest.json",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
