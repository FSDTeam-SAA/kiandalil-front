// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "./SessionWrapper";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/query-provider";
import 'react-quill/dist/quill.snow.css';

export const metadata: Metadata = {
  title: "Hidden Prop",
  description: "Created with Love by the Hidden Props Team",
  generator: "Created with Love by the Hidden Props Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SessionWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
