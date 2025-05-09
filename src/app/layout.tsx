'use client';

import React, { useMemo } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "@/styles/globals.css";
import "@/styles/toast.css";
import Footer from "@/components/Footer";
import Sidebar from '@/components/Sidebar';
import ToastManager from "@/components/ToastManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Valid routes
const knownRoutes = [
  '/',
  '/preferences',
  '/groups',
  '/chat',
  '/calendar',
  '/forum',
  '/login',
];

// Valid routes without a sidebar
const hiddenRoutes = ['/login'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideSidebar = useMemo(() => {
    // Hide if explicitly hidden or unknown route
    return hiddenRoutes.includes(pathname) || !knownRoutes.includes(pathname);
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-1">
            {!hideSidebar && <Sidebar />}
            <main className="flex-1 p-4 pb-0 flex flex-col">
              {children}

              {/* Toast container for displaying feedback for the user */}
              <div id="toast-container"></div>
              <ToastManager />
            </main>
          </div>

          <Footer />
        </div>
      </body>
    </html>
  );
}