"use client";

import { Post } from "@/types/posts";
import { useTranslation } from "react-i18next";
import { FiMessageSquare, FiThumbsUp } from "react-icons/fi";
import Link from 'next/link';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const { i18n } = useTranslation();

  console.log(post.created);

  const createdAt = new Date(post.created);

  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(createdAt);

  return (
    <Link
      href={`/forum/${post.forumPostId}`}
      className="hover:opacity-80 transition"
    >
      <article className="rounded-lg p-4 bg-sidebar-bg border-main">

        {/* Title */}
        <h3 className="text-lg font-bold">{post.title}</h3>

        {/* Meta */}
        <div className="mb-2 text-xs text-gray-500 flex items-center justify-between">
          <span>
            {formattedDate} • {post.author.firstName} {post.author.lastName}
          </span>
        </div>

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
    </Link >
  );
}
