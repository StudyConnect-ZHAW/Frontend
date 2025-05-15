"use client";

import * as React from "react";
import PageHeader from "@/components/PageHeader";
import ForumPost, { ForumPostData } from "@/components/ForumPost";
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
    setLoading(true);
    try {
      const url = q.trim()
        ? `${API_BASE_URL}/api/v1/posts/search?query=${encodeURIComponent(q)}`
        : `${API_BASE_URL}/api/v1/posts`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 404) {
        setPosts([]);
        return;
      }
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---- Initial load ------------------------------------------- */
  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ---- Debounced search --------------------------------------- */
  React.useEffect(() => {
    const t = setTimeout(() => fetchPosts(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search, fetchPosts]);

  /* ---- Render -------------------------------------------------- */
  return (
    <div className="p-4">
      <PageHeader title="Forum" />

      {/* new post form */}
      <NewPostForm onPostCreated={() => fetchPosts(search)} />

      {/* search & sort */}
      <div className="mt-4 flex flex-row items-center gap-4">
        <SearchField
          value={search}
          placeholder="Search…"
          onChange={setSearch}
        />
        <SortField /* TODO: wire‑up with backend sort */ />
      </div>

      {/* list */}
      {loading ? (
        <p className="mt-4">Loading…</p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {posts.map((p) => (
            <Link key={p.id} href={`/forum/${p.id}`} className="hover:opacity-80">
              <ForumPost post={p} />
            </Link>
          ))}
          {!posts.length && <p className="text-sm text-gray-500">No posts found.</p>}
        </div>
      )}
    </div>
  );
}