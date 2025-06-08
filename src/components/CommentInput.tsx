"use client";

import { useState } from "react";
import Button, { ButtonVariant } from "./Button";
import { useTranslation } from "react-i18next";

interface Props {
  onSubmit: (text: string) => Promise<void>;
  placeholder?: string;
}

export default function CommentInput({ onSubmit, placeholder }: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation(["forum", "common"]);

  const handleSubmit = async () => {
    if (!text.trim()) { return; }

    try {
      setError(null);
      await onSubmit(text.trim());
      setText(""); // Clear after submit
    } catch (err) {
      console.error("Failed to submit comment:", err);
      setError("Failed to submit comment.");
    }
  };

  return (
    <div className="mb-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || t("placeholder.joinConversation")}
        className="w-full border border-main bg-sidebar-bg text-primary rounded-md p-3 resize-y min-h-[80px] mb-2"
      />
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      <Button
        text={t("button.reply")}
        type={ButtonVariant.Primary}
        onClick={handleSubmit}
      />
    </div>
  );
}