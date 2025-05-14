"use client";

import React, { ChangeEvent, useEffect, useState } from "react";

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
}

export default function SearchField({ placeholder, value, onChange }: Props) {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div
      className="relative p-1"
      style={{
        border: `2px solid ${borderAndShadowColor}`,
        //boxShadow: `4px 4px 10px ${borderAndShadowColor}`,
        borderRadius: "10px",
        transition: "border-color 0.3s ease, boxShadow 0.3s ease",
        background: "var(--sidebar-bg)",
      }}
    >
      <input
        className="
          w-full 
          bg-transparent
          text-sm
          focus:outline-none
          focus:ring-0
        "
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}