import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { assetPath, siteUrl } from "./site-config";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const previewUrl = new URL(assetPath("/og.png"), siteUrl.origin).href;
const description = "G.影视 的爬虫介接、配置字典与 App 功能指南。";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "G.影视 使用与开发指南", template: "%s · G.影视" },
  description,
  openGraph: {
    title: "G.影视 使用与开发指南",
    description,
    type: "website",
    images: [
      {
        url: previewUrl,
        width: 1730,
        height: 909,
        alt: "G.影视 使用与开发指南",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "G.影视 使用与开发指南",
    description,
    images: [previewUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${plex.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
