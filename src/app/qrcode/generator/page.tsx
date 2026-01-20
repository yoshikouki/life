import type { Metadata } from "next";
import { QRCodeForm } from "./_components/qrcode-form";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Generate customizable QR codes with various styles and colors",
};

export default function QRCodeGeneratorPage() {
  return (
    <main className="container relative mx-auto min-h-screen px-4 py-16">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mb-16 text-center">
        <h1 className="mb-4 font-bold text-5xl text-foreground tracking-tight sm:text-6xl">
          QR Code Generator
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Create beautiful, customizable QR codes in seconds
        </p>
      </div>

      <QRCodeForm />
    </main>
  );
}
