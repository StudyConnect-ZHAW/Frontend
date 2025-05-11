'use client';

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Sidebar from '@/components/Sidebar';
import ToastManager from "@/components/ToastManager";
import i18n from "@/i18n";

const knownRoutes = ['/', '/preferences', '/groups', '/chat', '/calendar', '/forum', '/login'];
const hiddenRoutes = ['/login'];

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
    return hiddenRoutes.includes(pathname) || !knownRoutes.includes(pathname);
  }, [pathname]);

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') || 'de-CH';
    const theme = localStorage.getItem('theme') || 'light';

    // Apply dark theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply preferred language
    if (i18n.language !== storedLang) {
      i18n.changeLanguage(storedLang).finally(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, []);

  // Prevent hydration error
  if (!isReady) return null;

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
