"use client";

/**
 * NewPostForm component for creating forum posts.
 * Provides form interface with title, category selection, and content fields.
 * Handles form submission to API, validation, and error handling.
 * Uses React hooks for state management and API interactions.
 */

import React, { useState, useEffect, FormEvent } from "react";
import { FiSend } from "react-icons/fi";

interface Props {
  onPostCreated?: () => void; // Optional callback triggered after successful post creation
  currentUserId?: string; // Optional user ID, fallback value used if not provided
}

interface Category {
  id: string; // Unique identifier for the category
  name: string; // Display name of the category
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function NewPostForm({ onPostCreated, currentUserId }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Fetch available categories on component mount
        const res = await fetch(`${API_BASE_URL}/api/v1/categories`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();

        // Transform API response to match internal Category interface
        const formattedCategories = data.map((c: any) => ({
          id: c.forumCategoryId,
          name: c.name,
        }));
        setCategories(formattedCategories);

        // Auto-select first category if available
        if (formattedCategories.length) {
          setCategoryId(formattedCategories[0].id);
        }
      } catch (e) {
        setErrorMsg("Failed to load categories.");
      }
    })();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;

    // Use provided user ID or fallback to default
    const userId = currentUserId ?? "d3f5c8c4-56a9-11ec-90d6-0242ac120003";

    const payload = {
      userId,
      title: title.trim(),
      forumCategoryId: categoryId,
      content: content.trim(),
    };

    try {
      setLoading(true);
      setErrorMsg("");

      // Submit post data to API
      const res = await fetch(`${API_BASE_URL}/api/v1/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Read response body only once
        const errorText = await res.text();

        // Attempt to parse error response as JSON
        let message = errorText;
        try {
          const json = JSON.parse(errorText);
          message =
            json?.errors?.[0]?.defaultMessage || // E.g., from Spring-Validation
            json?.message ||
            JSON.stringify(json);
        } catch {
          /* Not JSON - keep raw text */
        }
        throw new Error(message);
      }

      // Success handling
      onPostCreated?.();
      setTitle("");
      setContent("");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Determine border color based on theme
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
        {isLoading ? (
          "Posting…"
        ) : (
          <>
            Post <FiSend />
          </>
        )}
      </button>
    </form>
  );
}
