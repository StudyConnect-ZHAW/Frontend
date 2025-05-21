"use client";

/**
 * SearchField component
 * ----------------------------------------------------------
 * Reusable controlled search input with themed border & shadow.
 *
 * Features:
 *   • Reads the current theme (light/dark) from localStorage on mount
 *   • Dynamically styles border & shadow color based on theme
 *   • Debounces nothing – delegates all debouncing to the parent
 *   • Accepts optional placeholder, value, and onChange callback props
 *
 * Styling uses Tailwind classes plus inline style overrides for the
 * colored border & drop‑shadow to match the design system.
 */

import React, { ChangeEvent, useEffect, useState } from "react";

// ---- Props -----------------------------------------------------
interface Props {
  placeholder?: string; // Placeholder text inside the input
  value?: string; // Controlled value from parent
  onChange?: (val: string) => void; // Callback for value changes
}

// ---- Component -------------------------------------------------
export default function SearchField({ placeholder, value, onChange }: Props) {
  // Track the current theme (light/dark) so we can style accordingly
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // ---- Detect theme on mount ----------------------------------
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Compute the accent color based on theme (used for border + shadow)
  const accent = theme === "dark" ? "#ec3349" : "#FDBA15";

  // Proxy input change to parent, if provided
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  // ---- Render --------------------------------------------------
  return (
    <div
      className="relative p-2"
      style={{
        border: `3px solid ${accent}`,
        boxShadow: `4px 4px 10px ${accent}`,
        borderRadius: "10px",
        transition: "border-color 0.3s ease, boxShadow 0.3s ease",
        background: "var(--sidebar-bg)",
      }}
    >
      <input
        className="w-full bg-transparent text-sm focus:outline-none focus:ring-0"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
