import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "SUNFLEX ERP",
  description: "Luxury Crystal Inventory System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/style.css" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <AppProvider>
          <ClientLayout>{children}</ClientLayout>
        </AppProvider>
      </body>
    </html>
  );
}
