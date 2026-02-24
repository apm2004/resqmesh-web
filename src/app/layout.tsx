import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResQMesh — Command Center",
  description: "Emergency responder HUD dashboard for ResQMesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
