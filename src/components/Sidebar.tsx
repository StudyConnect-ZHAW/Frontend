"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiUsers,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";

// Navigation items for the sidebar
const navItems = [
  { icon: FiHome, label: "Home", path: "/" },
  { icon: FiUser, label: "Profile", path: "/preferences" },
  { icon: FiUsers, label: "Groups", path: "/groups" },
  { icon: FiCalendar, label: "Calendar", path: "/calendar" },
  { icon: FiMessageSquare, label: "Forum", path: "/forum" },
];

/**
 * Component representing the sidebar displayed on the left side of each page. It handles routing
 * and jumping to the respective page.
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div
      style={{
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
        bg-sidebar-bg
        border-sidebar
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
              className={`text-4xl duration-200 cursor-pointer ${isActive ? `text-icon scale-125` : `hover:scale-125 hover:text-icon`}`}
            >
              <Icon />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
