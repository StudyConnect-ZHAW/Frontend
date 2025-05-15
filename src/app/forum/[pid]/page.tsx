"use client";

import { useEffect, useState, useCallback } from "react";
import Link         from "next/link";
import { useParams } from "next/navigation";

import PageHeader   from "@/components/PageHeader";
import SortField    from "@/components/SortField";
import {
  FiArrowLeft,
  FiSend,
  FiShare2,
  FiThumbsUp,
} from "react-icons/fi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/* ---------- Types ------------------------------------------------- */
interface Comment {
  id: string;
  author: string;
  createdAt: string; 
  content: string;
  likes: number;
  children?: Comment[];
}

interface Post {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  tags: string[];
  likes: number;
  shares: number;
  comments: Comment[];
}

/* ---------- Helpers ---------------------------------------------- */
const minutesAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  return Math.floor(diffMs / 60000);
};

/* ---------- Component -------------------------------------------- */
export default function PostDetailPage() {
  const { pid } = useParams<{ pid: string }>();

  const [post, setPost]                 = useState<Post | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [isCommentLoading, setLoading]  = useState(false);
  const [replyTo, setReplyTo]           = useState<Comment | null>(null);

  /* ---- Load post (incl. comments) ------------------------------- */
  const fetchPost = useCallback(async () => {
    if (!pid) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/posts/${pid}`, { cache: "no-store" });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error("Could not load post", err);
    }
  }, [pid]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  /* ---- Create a new comment ------------------------------------ */
  const createComment = async () => {
    if (!commentInput.trim() || !pid) return;
    try {
      setLoading(true);
      const body = {
        content: commentInput.trim(),
        parentCommentId: replyTo?.id ?? null,
      };
      const res = await fetch(`${API_BASE_URL}/api/v1/posts/${pid}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());

      setCommentInput("");
      setReplyTo(null);
      await fetchPost(); // refresh
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---- Recursive comment node ----------------------------------- */
  const CommentNode = ({ comment }: { comment: Comment }) => {
    const [likes, setLikes] = useState(comment.likes);
    return (
      <div className="mt-4 first:mt-0 border-l border-gray-300 pl-5">
        {/* meta */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="font-semibold">{comment.author}</span> • {minutesAgo(comment.createdAt)} min ago
        </div>
        <p className="text-sm">{comment.content}</p>
        <div className="mt-1 flex items-center gap-4 text-xs text-gray-600">
          <button onClick={() => setLikes(likes + 1)} className="flex items-center gap-1 transition hover:scale-110">
            <FiThumbsUp /> {likes}
          </button>
          <button onClick={() => setReplyTo(comment)} className="hover:underline">
            Reply
          </button>
        </div>
        {comment.children?.map((c) => (
          <CommentNode key={c.id} comment={c} />
        ))}
      </div>
    );
  };

  /* ---- Early loading state -------------------------------------- */
  if (!post) return <div className="p-10">Loading…</div>;

  /* ---- Render ---------------------------------------------------- */
  return (
    <div className="relative flex gap-6 px-6 py-4">
      {/* MAIN COLUMN */}
      <main className="flex-1 pr-6">
        {/* header with back arrow */}
        <div className="relative mb-4">
          <Link
            href="/forum"
            title="Back to Forum"
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-black p-1 transition hover:bg-[#ec3349] hover:text-white dark:border-white"
          >
            <FiArrowLeft size={16} />
          </Link>
          <div className="pl-8">
            <PageHeader title={post.title} />
          </div>
        </div>

        {/* post box */}
        <section className="rounded-[15px] border-2 border-[#FDBA15] bg-[var(--sidebar-bg,#fff)] p-4">
          <div className="mb-2 flex items-start justify-between">
            {/* author + time */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <img src="/placeholder-avatar.svg" alt="avatar" className="h-4 w-4 rounded-full" />
              <span className="font-semibold">{post.author}</span> • {minutesAgo(post.createdAt)} minutes ago
            </div>
            {/* tags */}
            <div className="flex flex-wrap gap-1">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full bg-black px-2 py-[2px] text-[10px] uppercase leading-none text-white">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <p>{post.content}</p>
        </section>

        {/* interaction bar */}
        <div className="mt-2 flex gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-1"><FiThumbsUp /> {post.likes}</span>
          <span className="flex items-center gap-1"><FiShare2 /> {post.shares}</span>
        </div>

        {/* comment editor */}
        <form
          className="relative mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            createComment();
          }}
        >
          {replyTo && (
            <div className="mb-1 flex items-center gap-2 text-xs">
              Replying to <span className="font-semibold">{replyTo.author}</span>
              <button type="button" onClick={() => setReplyTo(null)} className="text-red-500 hover:underline">
                cancel
              </button>
            </div>
          )}
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
            className="absolute top-5 right-2 -translate-y-1/2 flex items-center gap-1 rounded bg-[#ec3349] px-1.5 py-1 text-sm font-bold text-white transition hover:scale-105 hover:bg-black disabled:opacity-60"
            style={{ borderRadius: "7px" }}
          >
            {isCommentLoading ? "Posting…" : <>Post <FiSend /></>}
          </button>
        </form>

        {/* sort dropdown + comment list */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-semibold">Sorted by: Newest first</span>
          <SortField /* TODO: wire‑up when backend supports comment sorting */ />
        </div>

        <div className="mt-4">
          {post.comments.map((c) => (
            <CommentNode key={c.id} comment={c} />
          ))}
        </div>
      </main>

      {/* RIGHT SIDEBAR (chat placeholder) */}
      <aside className="ml-auto w-80 flex-shrink-0">
        <div className="h-full rounded-xl border-2 border-[#FDBA15]">
          <h2 className="m-4 text-2xl font-bold">Chat</h2>
        </div>
      </aside>
    </div>
  );
}
