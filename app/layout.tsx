import type { Metadata } from "next";
import { Audiowide } from "next/font/google";
import "./globals.css";

// إعداد خط Audiowide
const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
});

export const metadata: Metadata = {
  title: "Aira Pro - قطع غيار ومستلزمات الطابعات",
  description: "الإمبراطورية التجارية لتوزيع قطع غيار الطابعات في العلمة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${audiowide.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}