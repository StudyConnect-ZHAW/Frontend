"use client";

import React, { ChangeEvent, useEffect, useState } from "react";

interface Props {
  value?: string;
  onChange?: (val: string) => void;
}

export default function SortField({ value, onChange }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  const borderAndShadowColor = theme === "dark" ? "#ec3349" : "#FDBA15";

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div
      className="relative p-2"
      style={{
        border: `3px solid ${borderAndShadowColor}`,
        boxShadow: `4px 4px 10px ${borderAndShadowColor}`,
        borderRadius: "10px",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        background: "var(--sidebar-bg)",
      }}
    >
      <select
        className="
          w-full 
          bg-transparent
          text-sm
          focus:outline-none
          focus:ring-0
        "
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
