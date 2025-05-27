"use client";

/**
 * ForumPost component for displaying individual forum posts.
 * Renders a post card with title, author info, content preview,
 * and engagement metrics (likes, comments, shares).
 * Styling adapts to the current theme (light/dark).
 */

import { Post } from "@/types/posts";
import { FiMessageSquare, FiThumbsUp } from "react-icons/fi";

interface Props {
  post: Post;
}

export default function ForumPost({ post }: Props) {
  return (
    <article className="mb-0.5 rounded-[15px] border-2 p-4 bg-sidebar-bg border-main">
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
          <FiThumbsUp /> {post.likeCount}
        </span>
        <span className="flex items-center gap-1">
          <FiMessageSquare /> {post.commentCount}
        </span>
      </footer>
    </article>
  );
}
