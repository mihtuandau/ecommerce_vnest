import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Minh Tuan Shop — Mua sắm trực tuyến",
  description: "Nền tảng mua sắm trực tuyến hiện đại, tối giản và hiệu quả.",
  keywords: ["ecommerce", "minh tuan shop", "shopping", "online store"],
  icons: {
    icon: "/logoMT.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logoMT.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
