"use client";

import React, { useEffect, useState } from "react";

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: number;
  createdAt: Date;
}

interface Props {
  group: Group;
  joined: boolean;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
}

export default function GroupCard({ group, joined, onJoin, onLeave }: Props) {
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

  return (
    <div
      className="flex flex-col justify-between p-4 rounded-[15px] h-full
                 bg-[var(--sidebar-bg)] border-2 shadow-sm transition-all"
      style={{ borderColor: borderAndShadowColor }}
    >
      <div>
        <h3 className="text-lg font-semibold mb-1">{group.name}</h3>
        {group.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">
            {group.description}
          </p>
        )}
        <span className="text-xs text-gray-500">
          {group.members} Members
        </span>
      </div>

      <button
        onClick={() => (joined ? onLeave(group.id) : onJoin(group.id))}
        className={`mt-3 w-full py-1 rounded font-semibold
          ${joined
            ? "bg-black text-white hover:opacity-80"
            : "bg-[#ec3349] text-white hover:bg-black"}
          transition`}
      >
        {joined ? "Leave" : "Join"}
      </button>
    </div>
  );
}
