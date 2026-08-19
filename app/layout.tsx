import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUNFLEX ERP",
  description: "Luxury Crystal Inventory System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/style.css" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
