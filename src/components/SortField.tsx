"use client";

/**
 * SortField component
 * ----------------------------------------------------------
 * Controlled select/drop‑down used to choose a sort order in the forum UI.
 *
 * Features:
 *   • Reads the current theme (light/dark) from localStorage on mount
 *   • Dynamically colors the border & drop‑shadow (#ec3349 in dark mode,
 *     #FDBA15 in light mode) to match the design system
 *   • Accepts a controlled `value` prop and propagates changes via the
 *     optional `onChange` callback
 *
 * Styling combines Tailwind classes with inline style overrides for the
 * colored border & shadow.
 */

import React, { ChangeEvent, useEffect, useState } from "react";

// ---- Props -----------------------------------------------------
interface Props {
  value?: string; // Current selected sort option
  onChange?: (val: string) => void; // Callback when the selection changes
}

// ---- Component -------------------------------------------------
export default function SortField({ value, onChange }: Props) {
  // Track theme so we can style the accent color
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Detect theme preference on mount ------------------------------------
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

  // Choose accent color based on theme (#FDBA15 = yellow, #ec3349 = red)
  const accent = theme === "dark" ? "#ec3349" : "#FDBA15";

  // Bubble change events up to parent (if provided) ----------------------
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
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
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        background: "var(--sidebar-bg)",
      }}
    >
      <select
        className="w-full bg-transparent text-sm focus:outline-none focus:ring-0"
        value={value}
        onChange={handleSelect}
      >
        <option value="newest">Neueste zuerst</option>
        <option value="oldest">Älteste zuerst</option>
        <option value="mostLiked">Meist geliked</option>
      </select>
    </div>
  );
}
