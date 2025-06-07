"use client"

import { useState } from "react";

interface Props {
  onSubmit: (text: string) => Promise<void>;
  placeholder?: string;
}

export default function CommentInput({ onSubmit, placeholder }: Props) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) { return; }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(text.trim());
      setText(""); // Clear after submit
    } catch (err) {
      console.error("Failed to submit comment:", err);
      setError("Failed to submit comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || "Write a comment..."}
        className="w-full border border-main bg-sidebar-bg text-primary rounded-md p-3 resize-y min-h-[80px] mb-2"
      />
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50"
      >
        {submitting ? "Posting..." : "Post"}
      </button>
    </div>
  );
}