"use client";

import { useState } from "react";
import Button, { ButtonVariant } from "@/components/Button";
import { useTranslation } from "react-i18next";

interface Props {
  onSubmit: (text: string) => Promise<void>;
  placeholder?: string;
}

export default function CommentInput({ onSubmit, placeholder }: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState<null | string>(null);

  const { t } = useTranslation(["forum", "common"]);

  const handleSubmit = async () => {
    const trimmed = text.trim();

    if (trimmed.length === 0) {
      setError(t("common:form.required", "This field is required."));

      return;
    }

    if (trimmed.length > 500) {
      setError("Max characters is 500");

      return;
    }

    setError(null);
    await onSubmit(trimmed);
    setText("");
  };

  return (
    <div className="mb-4">
      {error && <p className="text-sm text-red-500 mb-1">{error}</p>}
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) { setError(null); }
        }}
        maxLength={1000}
        placeholder={placeholder || t("placeholder.joinConversation")}
        className="w-full border border-main bg-sidebar-bg text-primary rounded-md p-3 resize-y min-h-[80px] mb-2"
      />
      <Button
        text={t("button.reply")}
        type={ButtonVariant.Primary}
        onClick={handleSubmit}
      />
    </div>
  );
}