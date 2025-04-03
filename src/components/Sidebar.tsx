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
  FiSettings,
  FiMoon,
  FiSun,
} from "react-icons/fi";

// TODO: Find suitable icon for forum

const navItems = [
  { icon: FiHome, label: "Home", path: "/" },
  { icon: FiUser, label: "Profile", path: "/profile" },
  { icon: FiUsers, label: "Groups", path: "/groups" },
  { icon: FiMessageSquare, label: "Chat", path: "/chat" },
  { icon: FiCalendar, label: "Calendar", path: "/calendar" },
  { icon: FiSettings, label: "Settings", path: "/settings" },
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

  // Klick-Handler, der zwischen Light/Dark toggelt
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

  return (
    <div
      className={`
        flex
        flex-col
        justify-between
        m-4 mb-0 w-20 
        border-[3px] border-[#f03246]/50 
        shadow-[4px_4px_10px_#EC3349] 
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
              className={`text-[35px] transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-[#ec3349] scale-125"
                  : "hover:scale-125 hover:text-[#ec3349]"
              }`}
            >
              <Icon />
            </Link>
          );
        })}
      </div>

      {/* TOGGLE-BUTTON UNTEN */}
      <div style={{ marginTop: "16px" }}>
        <ToggleSwitch theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}

function ToggleSwitch({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  return (
    <div
      onClick={toggleTheme}
      style={{
        position: "relative",
        width: "40px",
        height: "80px",
        border: "2px solid #ec3349", // rote Umrandung
        borderRadius: "9999px", // pillenförmiges Oval
        backgroundColor: "#fff",
        cursor: "pointer",
      }}
    >
      {/* Mond-Icon (oben) */}
      <FiMoon
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "18px",
        }}
      />

      {/* Sonnensymbol (unten) */}
      <FiSun
        style={{
          position: "absolute",
          bottom: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "18px",
        }}
      />

      {/* Der "runde" Handle in der Mitte */}
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "8px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "transparent",
          border: "2px solid #ec3349", // rote Umrandung
          transformOrigin: "center",
          transition: "transform 0.3s",
          // Light: oben (0)
          // Dark: z. B. 40px weiter unten
          transform:
            theme === "light"
              ? "translate(-50%, 0)" // Licht: weiter oben
              : "translate(-50%, 40px)", // Dunkel: nach unten verschoben
        }}
      />
    </div>
  );
}