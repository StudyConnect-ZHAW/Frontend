"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiUser,
    FiUsers,
    FiMessageSquare,
    FiCalendar,
    FiStar,
} from "react-icons/fi";

// Navigation items for the sidebar
const navItems = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiUser, label: "Profile", path: "/preferences" },
    { icon: FiUsers, label: "Groups", path: "/groups" },
    { icon: FiMessageSquare, label: "Chat", path: "/chat" },
    { icon: FiCalendar, label: "Calendar", path: "/calendar" },
    { icon: FiStar, label: "Forum", path: "/forum" },
];

/**
 * Component representing the sidebar displayed on the left side of each page. It handles routing
 * and jumping to the respective page.
 */
export default function Sidebar() {
    const pathname = usePathname();

    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        } else {
            // standard = light
            setTheme("light");
            document.documentElement.classList.remove("dark");
        }
    }, []);

    // Klick-Handler, that switches between dark and light mode
    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            setTheme("light");
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const borderAndShadowColor = theme === "dark" ? "#FDBA15" : "#ec3349";
    const iconColorClass = theme === "dark" ? "text-[#FDBA15]" : "text-[#ec3349]";

    return (
        <div
            style={{
                border: `3px solid ${borderAndShadowColor}`,
                boxShadow: `4px 4px 10px ${borderAndShadowColor}`,
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            className={`
        flex
        flex-col
        justify-between
        m-4 mb-0 w-20 
        rounded-xl 
        p-4 gap-4 
        items-center
        bg-[var(--sidebar-bg)]
      `}
        >
            <div className="flex flex-col items-center gap-8">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = pathname === path;

                    return (
                        <Link
                            href={path}
                            key={label}
                            aria-label={label}
                            className={`text-[35px] transition-all duration-200 cursor-pointer ${isActive
                                ? `${iconColorClass} scale-125`
                                : `hover:scale-125 hover:${iconColorClass}`
                                }`}
                        >
                            <Icon />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
