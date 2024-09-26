import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import { Footer } from "./footer";

export { metadata, viewport } from "./metadata";

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
