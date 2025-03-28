import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from '@/components/sidebar/Sidebar';
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'StudyConnect',
  description: 'A platform for learn and project groups',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Sidebar />

        {children}
      </body>
    </html>
  );
}