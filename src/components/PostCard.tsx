"use client";

import { Post } from "@/types/posts";
import { useTranslation } from "react-i18next";
import { FiMessageSquare } from "react-icons/fi";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import Link from 'next/link';

interface Props {
  post: Post;
  onLike: (postId: string) => void;
  isLiked: boolean;
}

export default function PostCard({ post, onLike, isLiked }: Props) {
  const { i18n } = useTranslation();
  const createdAt = new Date(post.created);
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(createdAt);

  return (
    <article className="flex rounded-lg bg-sidebar-bg border-main overflow-hidden">
      {/* Left column - Like button */}
      <div className="flex flex-col items-center justify-start px-3 py-4 min-w-[50px]">
        <button
          onClick={() => onLike(post.forumPostId)}
          className={`cursor-pointer ${isLiked ? "text-primary" : "text-gray-600 hover:text-primary"}`}
          title="Like this post"
        >
          {isLiked ? <FaThumbsUp className="text-xl" /> : <FaRegThumbsUp className="text-xl" />}
        </button>
        <span className="text-xs text-gray-600 mt-1">{post.likeCount}</span>
      </div>

      {/* Right column - Post content */}
      <Link
        href={`/forum/${post.forumPostId}`}
        className="flex-1 p-4 hover:opacity-80 transition"
      >
        {/* Title */}
        <h3 className="text-lg font-bold wrap-anywhere">{post.title}</h3>

        {/* Meta info */}
        <div className="mb-2 text-xs text-gray-500">
          {formattedDate} • {post.user.firstName} {post.user.lastName}
        </div>

        {/* Post content preview */}
        <p className="text-sm wrap-anywhere">{post.content}</p>

        {/* Footer with stats */}
        <footer className="mt-2 flex gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <FiMessageSquare /> {post.commentCount}
          </span>
        </footer>
      </Link>
    </article>
  );
}