"use client";

/**
 * NewPostForm component for creating forum posts.
 * ----------------------------------------------------------
 * Provides an i18n‑aware form (title, category, content) and submits a
 * `PostCreateDto` ({ userId, title, forumCategoryId, content }) to the
 * backend at POST /api/v1/posts. Handles auth token (if present), error
 * parsing, and success callback.
 */

import React, { useState, useEffect, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiSend } from "react-icons/fi";

interface Props {
  onPostCreated?: () => void; // fired after successful POST
  currentUserId?: string; // if omitted we fall back to dummy
}

interface Category {
  id: string;
  name: string;
}

// ---- Constants -------------------------------------------------
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
// fallback user (until real auth is wired)
const FALLBACK_USER_ID = "d3f5c8c4-56a9-11ec-90d6-0242ac120003";

export default function NewPostForm({ onPostCreated, currentUserId }: Props) {
  const { t } = useTranslation(["forum"]);

  // ---- Local state --------------------------------------------
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ---- Fetch categories on mount ------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/categories`, {
          cache: "no-store",
          credentials: "include", // send cookies if using session auth
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        const formatted: Category[] = data.map((c: any) => ({
          id: c.forumCategoryId,
          name: c.name,
        }));
        setCategories(formatted);
        setCategoryId((prev) => prev || formatted[0]?.id || "");
      } catch (e) {
        setErrorMsg(t("error.categoriesLoad", "Failed to load categories."));
      }
    })();
  }, [t]);

  // ---- Submit handler -----------------------------------------
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;

    const payload = {
      userId: currentUserId ?? FALLBACK_USER_ID,
      title: title.trim(),
      forumCategoryId: categoryId,
      content: content.trim(), // optional according to spec
    };

    try {
      setLoading(true);
      setErrorMsg("");

      const accessToken = localStorage.getItem("accessToken"); // if JWT stored

      const res = await fetch(`${API_BASE_URL}/api/v1/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: "include", // keep if backend uses cookies; harmless otherwise
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        // Try JSON → prettier message extraction
        try {
          const json = JSON.parse(errorText);
          throw new Error(
            json?.errors?.[0]?.defaultMessage || json?.message || errorText
          );
        } catch {
          throw new Error(errorText);
        }
      }

      // On success the backend returns 200 (OK) with the created entity
      await res.json();
      onPostCreated?.();
      setTitle("");
      setContent("");
    } catch (err: any) {
      setErrorMsg(err.message || t("error.generic", "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  // ---- Theme accent -------------------------------------------
  const accent =
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "#ec3349"
      : "#FDBA15";

  // ---- Render --------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 rounded-[15px] border-2 p-4"
      style={{ borderColor: accent, background: "var(--sidebar-bg)" }}
    >
      <input
        className="w-full rounded border p-1 text-sm focus:outline-none"
        placeholder={t("placeholder.postTitle")}
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
        placeholder={t("placeholder.postContent")}
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
