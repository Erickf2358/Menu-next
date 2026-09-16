import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import ToastNotification from "@/components/ui/ToastNotification";

const font = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
 });


export const metadata: Metadata = {
  title: "Quiosco Next.js con App router y Prisma",
  description: "Quiosco Next.js con App router y Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} bg-gray-100 antialiased`}      >
        {children}
        <ToastNotification />
      </body>
    </html>
  );
}
