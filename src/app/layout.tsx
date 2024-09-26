import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "yoshikouki | Web Developer & Engineer",
  description:
    "yoshikouki の作品と自己紹介を掲載するポートフォリオ。鹿児島在住の開発者。Web を主軸とした創作活動が趣味。Web3、プロダクト開発、コミュニティ活動などに興味を示す。",
};

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
