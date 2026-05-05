import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AmplifyProvider from "@/components/AmplifyProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kentaro.T | Software Engineer",
  description:
    "Kentaro.T のポートフォリオサイト。Java / Spring Boot を軸に8年以上のバックエンド開発経験を持つエンジニアです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-theme="light" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
