import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Sidebar from '@/components/Sidebar';
import type {Metadata} from "next";

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
    icons: {
        icon: [
            {url: '/favicon.ico'},
            {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
            {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
            {url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png'},
        ],
    },
    manifest: '/site.webmanifest',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1">
                <Sidebar/>
                <main className="flex-1 p-4 pb-0 flex flex-col">
                    {children}
                </main>
            </div>

            <Footer/>
        </div>

        </body>
        </html>
    );
}