import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Commerce Backend Learning",
  description: "Backend öğrenme projesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">
                🛒 E-Commerce Backend Learning
              </h1>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
