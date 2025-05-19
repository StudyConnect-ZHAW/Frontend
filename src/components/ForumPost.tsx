"use client";

import React from "react";
import { FiThumbsUp, FiMessageSquare, FiShare2 } from "react-icons/fi";
import { ForumPostData } from "@/types/forum";

interface Props {
  post: ForumPostData;
}

export default function ForumPost({ post }: Props) {
  const borderColor =
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "#ec3349"
      : "#FDBA15";

  return (
    <article
      className="mb-0.5 rounded-[15px] border-2 p-4 bg-[var(--sidebar-bg)]"
      style={{ borderColor }}
    >
      {/* header */}
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

      {/* snippet */}
      <p className="line-clamp-2 text-sm leading-snug">{post.content}</p>

      {/* footer */}
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
