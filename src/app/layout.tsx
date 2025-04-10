'use client';

import React from "react";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Sidebar from '@/components/Sidebar';
import { usePathname } from "next/navigation";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) { 
  const pathname = usePathname();
  const hideSidebar = pathname === "/login";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-1">
            {!hideSidebar && <Sidebar />}
            <main className="flex-1 p-4 pb-0 flex flex-col">
              {children}
            </main>
          </div>

          <Footer />
        </div>
      </body>
    </html>
  );
}