import type { Metadata } from "next";
import { QRCodeForm } from "./_components/qrcode-form";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Generate customizable QR codes with various styles and colors",
};

export default function QRCodeGeneratorPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-3xl">QR Code Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create customizable QR codes with various styles and colors
        </p>
      </div>
      <QRCodeForm />
    </main>
  );
}
