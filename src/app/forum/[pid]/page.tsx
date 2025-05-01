/* ── app/forum/[pid]/page.tsx ───────────────────────────────────────── */
/* Client-side page for an individual forum post with comments */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SortField from "@/components/SortField";
import {
  FiArrowLeft,
  FiMessageSquare,
  FiSend,
  FiShare2,
  FiThumbsUp,
} from "react-icons/fi";

/* ---------- Helper types ------------------------------------------- */
interface Comment {
  id: number;
  author: string;
  minutesAgo: number;
  content: string;
  children?: Comment[];
}

interface Post {
  title: string;
  author: string;
  minutesAgo: number;
  content: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  shares: number;
}

/* ------------------------------------------------------------------- */
export default function PostDetailPage() {
  const { pid } = useParams<{ pid: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  /* Demo data – replace with real API call */
  useEffect(() => {
    setPost({
      title: "ZHAW Feier",
      author: "Alex Sivapalan",
      minutesAgo: 38,
      content:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd",
      tags: ["ZHAW", "Feier"],
      likes: 210,
      shares: 10,
      comments: [
        {
          id: 1,
          author: "Sumaya Mohat",
          minutesAgo: 20,
          content: "Oh wow... Lorem Ipsum.. REALLY??",
          children: [
            {
              id: 2,
              author: "Raggi Thayan",
              minutesAgo: 5,
              content: "YES YES",
            },
          ],
        },
        {
          id: 3,
          author: "Sumaya Mohat",
          minutesAgo: 2,
          content: "crazy",
        },
      ],
    });
  }, [pid]);

  /* ---------- Helper components ------------------------------------ */
  const TagChip = ({ label }: { label: string }) => (
    <span className="ml-1 rounded-full bg-black px-2 py-[2px] text-[10px] leading-none uppercase text-white">
      {label} ✕
    </span>
  );

  const iconHoverClass =
    "text-base transition-all duration-200 hover:scale-125";

  const InteractionBar = ({
    likes,
    comments,
    shares,
  }: {
    likes: number;
    comments: number;
    shares: number;
  }) => (
    <div className="mt-2 flex gap-6 text-sm text-gray-600">
      <span className="flex cursor-pointer items-center gap-1">
        <FiThumbsUp className={iconHoverClass} /> {likes}
      </span>
      <span className="flex cursor-pointer items-center gap-1">
        <FiMessageSquare className={iconHoverClass} /> {comments}
      </span>
      <span className="flex cursor-pointer items-center gap-1">
        <FiShare2 className={iconHoverClass} /> {shares}
      </span>
    </div>
  );

  const CommentNode = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => (
    <div
      className={`mt-3 ${depth > 0 ? "border-l pl-5" : ""} border-gray-300`}
    >
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <span className="font-semibold">{comment.author}</span> •
        <span>{comment.minutesAgo} minutes ago</span>
      </div>
      <p className="text-sm">{comment.content}</p>

      {comment.children?.map((child) => (
        <CommentNode key={child.id} comment={child} depth={depth + 1} />
      ))}
    </div>
  );

  /* ---------- Loading state ---------------------------------------- */
  if (!post) return <div className="p-10">Loading …</div>;

  /* ---------- Page markup ------------------------------------------ */
  return (
    <div className="flex gap-6 px-6 py-4">
      {/* MAIN COLUMN -------------------------------------------------- */}
      <main className="flex-1 pr-6">
        {/* Header with title, date, back arrow */}
        <header className="mb-3 flex items-baseline justify-between">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-3">
            <p className="font-semibold">
              {new Intl.DateTimeFormat("de-CH", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date())}
            </p>
            <Link
              href="/forum"
              title="Back to Forum"
              className="rounded-full border border-black p-1 transition hover:bg-[#ec3349] hover:text-white dark:border-white"
            >
              <FiArrowLeft size={14} />
            </Link>
          </div>
        </header>

        {/* Post box */}
        <section className="rounded-[15px] border-2 border-[#FDBA15] bg-[var(--sidebar-bg,#fff)] p-4">
          {/* author / time and tags */}
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <img
                src="/path/to/avatar.png"
                alt="avatar"
                className="h-4 w-4 rounded-full"
              />
              <span className="font-semibold">{post.author}</span> •{" "}
              <span>{post.minutesAgo} minutes ago</span>
            </div>

            <div className="flex">
              {post.tags.map((t) => (
                <TagChip key={t} label={t} />
              ))}
            </div>
          </div>

          <p>{post.content}</p>
        </section>

        {/* Likes / comments / shares */}
        <InteractionBar
          likes={post.likes}
          comments={post.comments.length}
          shares={post.shares}
        />

        {/* Comment input */}
        <form
          className="relative mt-6"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!commentInput.trim()) return;
            try {
              setIsCommentLoading(true);
              /* TODO: real API call */
              setCommentInput("");
            } finally {
              setIsCommentLoading(false);
            }
          }}
        >
          <textarea
            placeholder="Write a comment…"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            rows={1}
            className="w-full resize-none rounded-xl border-2 border-[#FDBA15] bg-white px-4 py-2 pr-24 text-sm focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={isCommentLoading}
            className="absolute top-5 right-2 -translate-y-1/2
                       flex items-center gap-1 rounded
                       bg-[#ec3349] px-2 py-1 text-sm font-bold text-white
                       transition hover:scale-105 hover:bg-black disabled:opacity-60"
            style={{ borderRadius: "7px" }}
          >
            {isCommentLoading ? (
              "Posting..."
            ) : (
              <>
                <span>Post</span>
                <FiSend className="text-white" />
              </>
            )}
          </button>
        </form>

        {/* Sort dropdown and comment list */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-semibold">Sorted by: Newest first</span>
          <SortField />
        </div>

        <div className="mt-4">
          {post.comments.map((c) => (
            <CommentNode key={c.id} comment={c} />
          ))}
        </div>
      </main>

      {/* RIGHT SIDEBAR ------------------------------------------------- */}
      <aside className="ml-auto w-80 flex-shrink-0">
        <div className="mb-6 h-64 rounded-t-xl border-2 border-[#FDBA15]">
          <h2 className="m-4 text-2xl font-bold">Chat</h2>
        </div>
        <div className="h-64 rounded-b-xl border-2 border-[#FDBA15]">
          <h2 className="m-4 text-2xl font-bold">Groups</h2>
        </div>
      </aside>
    </div>
  );
}
