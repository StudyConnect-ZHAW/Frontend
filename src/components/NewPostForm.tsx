"use client";

/**
 * NewPostForm component for creating forum posts.
 * ----------------------------------------------------------
 * Provides form interface with title, category selection, and content fields.
 * Handles form submission to API, validation, and error handling.
 * Uses React hooks for state management and API interactions.
 */

import React, { useState, useEffect, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiSend } from "react-icons/fi";

interface Props {
  onPostCreated?: () => void; // Optional callback triggered after successful post creation
  currentUserId?: string; // Optional user ID, fallback value used if not provided
}

interface Category {
  id: string; // Unique identifier for the category
  name: string; // Display name of the category
}

// ---- Constants -------------------------------------------------
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function NewPostForm({ onPostCreated, currentUserId }: Props) {
  const { t } = useTranslation(["forum"]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ---- Fetch categories on mount --------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/categories`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        const formatted: Category[] = data.map((c: any) => ({
          id: c.forumCategoryId,
          name: c.name,
        }));
        setCategories(formatted);
        if (formatted.length) {
          setCategoryId(formatted[0].id);
        }
      } catch (e) {
        setErrorMsg(t("error.categoriesLoad", "Failed to load categories."));
      }
    })();
  }, [t]);

  // ---- Submit handler -------------------------------------------
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;

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

      const res = await fetch(`${API_BASE_URL}/api/v1/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let message = errorText;
        try {
          const json = JSON.parse(errorText);
          message =
            json?.errors?.[0]?.defaultMessage ||
            json?.message ||
            JSON.stringify(json);
        } catch {
          /* raw text */
        }
        throw new Error(message);
      }

      // Success
      onPostCreated?.();
      setTitle("");
      setContent("");
    } catch (err: any) {
      setErrorMsg(err.message || t("error.generic", "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  // ---- Theme-based accent color --------------------------------
  const accent =
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "#ec3349"
      : "#FDBA15";

  // ---- Render ---------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 rounded-[15px] border-2 p-4"
      style={{ borderColor: accent, background: "var(--sidebar-bg)" }}
    >
      {/* Title */}
      <input
        className="w-full rounded border p-1 text-sm focus:outline-none"
        placeholder={t("placeholder.postTitle")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Category select */}
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

      {/* Content */}
      <textarea
        className="h-24 w-full resize-none rounded border p-1 text-sm focus:outline-none"
        placeholder={t("placeholder.postContent")}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="ml-auto flex items-center gap-1 rounded bg-[#ec3349] px-2 py-1 text-sm font-bold text-white transition hover:scale-105 hover:bg-black disabled:opacity-60"
        style={{ borderRadius: "7px" }}
      >
        {isLoading ? (
          t("button.posting", "Posting…")
        ) : (
          <>
            <span>{t("button.post")}</span> <FiSend />
          </>
        )}
      </button>
    </form>
  );
}
