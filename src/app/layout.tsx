import { CssBaseline } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "./ThemeProvider";
import { font } from "./theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "yoshikouki",
  description: "Software engineer and former physical therapist",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={font.className}>
        <ThemeProvider>
          <CssBaseline />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
