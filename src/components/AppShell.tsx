'use client';

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Sidebar from '@/components/Sidebar';
import ToastManager from "@/components/ToastManager";
import { normalizeLanguage } from "@/i18n/config";

import i18n from "@/i18n";

const knownRoutes = [
  '/',
  '/preferences',
  '/groups',
  '/calendar',
  '/forum',
  '/login'
];
const hiddenRoutes = [
  '/login'
];

/**
 * AppShell is the main client-side wrapper for all pages.
 * 
 * It is responsible for initializing client-specific settings before rendering
 * any content. This prevents hydration mismatches and ensures consistent user
 * experience.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  // Determine if the sidebar should be hidden based on route
  const hideSidebar = useMemo(() => {
    if (hiddenRoutes.includes(pathname)) { return true; }

    // Sidebar should show for all known base routes and their subpaths
    return !knownRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  }, [pathname]);

  useEffect(() => {
    // Theme selection
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark').matches;
    const theme = storedTheme ?? (prefersDark ? 'dark' : 'light');

    // Apply theme across entire website
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Language selection
    const storedLang = localStorage.getItem('lang');
    const browserLang = navigator.language;

    const normalizedLang = normalizeLanguage(storedLang ?? browserLang);

    // Apply language to i18next
    if (i18n.language !== normalizedLang) {
      i18n.changeLanguage(normalizedLang).finally(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, []);

  // Prevent hydration error
  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {!hideSidebar && <Sidebar />}
        <main className="flex-1 p-4 pb-0 flex flex-col">
          {children}
          <div id="toast-container" />
          <ToastManager />
        </main>
      </div>
      <Footer />
    </div>
  );
}
