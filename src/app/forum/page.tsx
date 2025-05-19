"use client";

import * as React from "react";
import PageHeader from "@/components/PageHeader";
import { ForumPostData } from "@/types/forum";
import ForumPost from "@/components/ForumPost";
import SearchField from "@/components/SearchField";
import SortField from "@/components/SortField";
import Link from "next/link";
import NewPostForm from "@/components/NewPostForm";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const SEARCH_DEBOUNCE_MS = 300;

export default function ForumPage() {
  const [posts, setPosts] = React.useState<ForumPostData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState<string>("");

  /* ---- Fetch helpers ------------------------------------------ */
  const fetchPosts = React.useCallback(async (q = "") => {
    console.log("[fetchPosts] Fetching posts with query:", q);
    setLoading(true);
    try {
      const url = q.trim()
        ? `${API_BASE_URL}/api/v1/posts/search?query=${encodeURIComponent(q)}`
        : `${API_BASE_URL}/api/v1/posts`;
      const res = await fetch(url, { cache: "no-store" });

      console.log("[fetchPosts] Status:", res.status);

      if (res.status === 404) {
        console.warn("[fetchPosts] No posts found (404)");
        setPosts([]);
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`[${res.status}] ${text}`);
      }

      const data = await res.json();
      console.log("[fetchPosts] Received data:", data);

      const safePosts = Array.isArray(data) ? data : [];
      setPosts(safePosts);
      console.log("[fetchPosts] Set posts:", safePosts);
    } catch (err) {
      console.error("[fetchPosts] Error while fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---- Initial load ------------------------------------------- */
  React.useEffect(() => {
    console.log("[useEffect] Initial fetch");
    fetchPosts();
  }, [fetchPosts]);

  /* ---- Debounced search --------------------------------------- */
  React.useEffect(() => {
    console.log("[useEffect] Search changed:", search);
    const t = setTimeout(() => {
      console.log("[useEffect] Debounced fetch triggered");
      fetchPosts(search);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      console.log("[useEffect] Cleaning up debounce");
      clearTimeout(t);
    };
  }, [search, fetchPosts]);

  /* ---- Render -------------------------------------------------- */
  return (
    <div className="p-4">
      <PageHeader title="Forum" />

      {/* new post form */}
      <NewPostForm
        onPostCreated={() => {
          console.log("[NewPostForm] Post created → refetching");
          fetchPosts(search);
        }}
      />

      {/* search & sort */}
      <div className="mt-4 flex flex-row items-center gap-4">
        <SearchField
          value={search}
          placeholder="Search…"
          onChange={(v) => {
            console.log("[SearchField] Updated search:", v);
            setSearch(v);
          }}
        />
        <SortField /* TODO: wire‑up with backend sort */ />
      </div>

      {/* list */}
      {loading ? (
        <p className="mt-4">Loading…</p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {posts.map((p, i) => {
            console.log(`[Render] Post[${i}]:`, p);
            return (
              <div key={p.forumPostId}>
                <Link
                  href={`/forum/${p.forumPostId}`}
                  className="hover:opacity-80"
                >
                  <ForumPost post={p} />
                </Link>
              </div>
            );
          })}
          {!posts.length && (
            <p className="text-sm text-gray-500">No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
}
