"use client";

/**
 * ForumPost component for displaying individual forum posts.
 * Renders a post card with title, author info, content preview,
 * and engagement metrics (likes, comments, shares).
 * Styling adapts to the current theme (light/dark).
 */

import React from "react";
import { FiThumbsUp, FiMessageSquare, FiShare2 } from "react-icons/fi";
import { ForumPostData } from "@/types/forum";

interface Props {
  post: ForumPostData; // Post data to be displayed
}

export default function ForumPost({ post }: Props) {
  // Determine border color based on theme
  const borderColor =
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "#ec3349"
      : "#FDBA15";

  return (
    <article
      className="mb-0.5 rounded-[15px] border-2 p-4 bg-[var(--sidebar-bg)]"
      style={{ borderColor }}
    >
      {/* Post header with title and metadata */}
      <header className="mb-1 flex items-center justify-between gap-2">
        <h3 className="line-clamp-1 text-lg font-bold">{post.title}</h3>
        <time
          className="whitespace-nowrap text-xs text-gray-500"
          dateTime={post.createdAt}
        >
          {new Date(post.createdAt).toLocaleDateString()} •{" "}
          {`${post.author.firstName} ${post.author.lastName}`}
        </time>
      </header>

      {/* Post content preview with line clamping */}
      <p className="line-clamp-2 text-sm leading-snug">{post.content}</p>

      {/* Post footer with engagement metrics */}
      <footer className="mt-2 flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <FiThumbsUp /> {post.likes}
        </span>
        <span className="flex items-center gap-1">
          <FiMessageSquare /> {post.commentsCount}
        </span>
        <span className="flex items-center gap-1">
          <FiShare2 /> {post.shares}
        </span>
      </footer>
    </article>
  );
}
