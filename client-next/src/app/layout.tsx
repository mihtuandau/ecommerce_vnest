import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  adjustFontFallback: false,
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "LUXE Store — Mua sắm trực tuyến cao cấp",
  description: "Trải nghiệm mua sắm đẳng cấp, tối giản và tinh tế tại LUXE Store.",
  keywords: ["ecommerce", "luxe", "premium shopping", "online store"],
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
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
