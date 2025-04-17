"use client";

import React, { useEffect, useState } from "react";
import { FiThumbsUp, FiMessageSquare, FiShare2 } from "react-icons/fi";

interface Post {
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

interface Props {
  post: Post;
}

export default function ForumPost({ post }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme from localStorage on component mount
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
      className="p-4 mb-0.5"
      style={{
        border: `3px solid ${borderAndShadowColor}`,
        borderRadius: "15px",
        background: "var(--sidebar-bg)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Post title */}
      <h2 className="text-xl font-bold mb-1">{post.title}</h2>

      {/* Author and date */}
      <p className="text-sm text-gray-500 mb-2">
        {post.author} • {post.date}
      </p>

      {/* Post content */}
      <p className="mb-2">{post.content}</p>

      {/* Post interaction bar */}
      <div className="flex gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1 cursor-pointer">
          <FiThumbsUp className="text-base text-black transition-all duration-200 hover:scale-125" />
          {post.likes}
        </span>
        <span className="flex items-center gap-1 cursor-pointer">
          <FiMessageSquare className="text-base text-black transition-all duration-200 hover:scale-125" />
          {post.comments}
        </span>
        <span className="flex items-center gap-1 cursor-pointer">
          <FiShare2 className="text-base text-black transition-all duration-200 hover:scale-125" />
          {post.shares}
        </span>
      </div>
    </div>
  );
}
