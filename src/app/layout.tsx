import type { Metadata } from "next";
import "./globals.css";
import { SessionGuard } from "@/components/SessionGuard";

export const metadata: Metadata = {
  title: "JemsCreations | Handmade pieces with a story",
  description: "One-of-a-kind wood and resin jewelry, made by hand.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><SessionGuard />{children}</body>
    </html>
  );
}
