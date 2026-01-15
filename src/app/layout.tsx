import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import { cn } from "@/lib/utils";
import { Footer } from "./footer";
import { metadata as _metadata, viewport as _viewport } from "./metadata";

// biome-ignore lint/performance/noBarrelFile: Required for Next.js metadata export convention
export const metadata = _metadata;
export const viewport = _viewport;

const font = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="ja">
        <body
          className={cn("min-h-screen font-sans antialiased", font.variable)}
        >
          {children}
          <Footer />
        </body>
      </html>
    </ViewTransitions>
  );
}
