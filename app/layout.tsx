import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'

const rubik = Rubik({
  subsets: ['latin', 'arabic'],
  variable: '--font-rubik',
});


export const metadata: Metadata = {
  title: "CCTV Home",
  description: "CCTV Home Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body
        className={`${rubik.className} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
