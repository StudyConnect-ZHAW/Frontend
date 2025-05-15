"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { FiSend } from "react-icons/fi";

interface Props {
  onPostCreated?: () => void;
  currentUserId?: string;        // override if you already know the signed-in user
}

interface Category {
  id: string;
  name: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function NewPostForm({ onPostCreated, currentUserId }: Props) {
  const [title,       setTitle]       = useState("");
  const [content,     setContent]     = useState("");
  const [categoryId,  setCategoryId]  = useState<string>("");
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [isLoading,   setLoading]     = useState(false);
  const [errorMsg,    setErrorMsg]    = useState("");

  /* fetch categories once */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/api/v1/categories`, { cache: "no-store" });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        console.log("Fetched categories", data);
        setCategories(
          data.map((c: any) => ({
            id:   c.forumCategoryId,
            name: c.name,
          }))
        );
        data.length && setCategoryId(data[0].id);
      } catch (e) {
        console.error("Could not fetch categories", e);
      }
    })();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;

    const userId =
      currentUserId ??
      localStorage.getItem("userId");

    const createDto = {
      userId,
      title:           title.trim(),
      forumCategoryId: categoryId,
      content:         content.trim() || null,     // nullable in DTO
    };

    console.log("Creating post", createDto);
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch(`${API_BASE_URL}/api/v1/posts`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ createDto }),
      });

      if (!res.ok) throw new Error(await res.text());

      onPostCreated?.();
      setTitle("");
      setContent("");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const borderColor =
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "#ec3349"
      : "#FDBA15";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 rounded-[15px] border-2 p-4"
      style={{ borderColor, background: "var(--sidebar-bg)" }}
    >
      <input
        className="w-full rounded border p-1 text-sm focus:outline-none"
        placeholder="Post title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="w-full rounded border p-1 text-sm focus:outline-none"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <textarea
        className="h-24 w-full resize-none rounded border p-1 text-sm focus:outline-none"
        placeholder="What do you want to share?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="ml-auto flex items-center gap-1 rounded bg-[#ec3349] px-2 py-1 text-sm font-bold text-white transition hover:scale-105 hover:bg-black disabled:opacity-60"
        style={{ borderRadius: "7px" }}
      >
        {isLoading ? "Posting…" : <>Post <FiSend /></>}
      </button>
    </form>
  );
}
