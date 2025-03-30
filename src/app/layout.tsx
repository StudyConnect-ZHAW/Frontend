import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Sidebar from '@/components/sidebar/Sidebar';
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
        <Sidebar/>

        {children}
        </body>
        </html>
    );
}