import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["300", "400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "وين الطلب | أسرع خدمة توصيل",
  description: "طلبك يوصل أسرع. منصة لوجستية متطورة لتوصيل الطلبات والطرود.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
