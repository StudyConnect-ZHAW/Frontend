"use client";

import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

interface ToggleSwitchProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function ToggleSwitch({ theme, toggleTheme }: ToggleSwitchProps) {

    const backgroundColor = theme === "dark" ? "#1A1821" : "#fff";
    const borderAndShadowColor = theme === "dark" ? "#FDBA15" : "#ec3349";

  return (
    <div
      onClick={toggleTheme}
      style={{
        position: "relative",
        width: "30px",
        height: "60px",
        border: `2px solid ${borderAndShadowColor}`,
        borderRadius: "9999px",
        backgroundColor,
        cursor: "pointer",
        transition: "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: `4px 4px 10px ${borderAndShadowColor}`,
      }}
    >
      {/* Mond-Icon (oben) */}
      <FiMoon
        style={{
          position: "absolute",
          top: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
        }}
      />

      {/* Sun Symbol below */}
      <FiSun
        style={{
          position: "absolute",
          bottom: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
        }}
      />

      {/* The circle handler */}
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "5px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: "transparent",
          border: `2px solid ${borderAndShadowColor}`,
          transformOrigin: "center",
          transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          transform:
            theme === "dark"
              ? "translate(-50%, 0)"
              : "translate(-50%, 29px)",
        }}
      />
    </div>
  );
}
