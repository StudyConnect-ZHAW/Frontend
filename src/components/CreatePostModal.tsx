"use client";

import { Category } from "@/types/category";
import { PostCreateData } from "@/types/posts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSend } from "react-icons/fi";
import Button, { ButtonVariant } from "./Button";

interface Props {
  onClose: () => void;
  onCreate: (data: PostCreateData) => void;
  categories: Category[];
}

export default function CreatePostModal({
  onClose,
  onCreate,
  categories,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const { t } = useTranslation(["forum", "common"]);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    const titleValid = !!trimmedTitle;
    const contentValid = !!trimmedContent;
    const categoryValid = !!categoryId;

    setTitleError(!titleValid);
    setContentError(!contentValid);
    setCategoryError(!categoryValid);

    if (!titleValid || !contentValid || !categoryValid) {
      return;
    }

    onCreate({
      title: trimmedTitle,
      content: trimmedContent,
      forumCategoryId: categoryId,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-primary-bg shadow-lg p-6 w-full max-w-md relative border-main rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-white cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">{t("titleCreate")}</h2>

        <div className="space-y-3">
          <div>
            {titleError && (
              <p className="text-red-500 text-sm mb-1">
                {t("common:form.required")}
              </p>
            )}
            <input
              className={`w-full border px-3 py-2 rounded ${
                titleError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("placeholder.postTitle")}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(false);
              }}
            />
          </div>
          <div>
            {categoryError && (
              <p className="text-red-500 text-sm mb-1">
                {t("common:form.required")}
              </p>
            )}
            <select
              className={`w-full border px-3 py-2 rounded ${
                categoryError ? "border-red-500" : "border-gray-300"
              }`}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                if (categoryError) setCategoryError(false);
              }}
            >
              <option value="">{t("placeholder.selectCategory")}</option>
              {categories.map((c) => (
                <option key={c.forumCategoryId} value={c.forumCategoryId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            {contentError && (
              <p className="text-red-500 text-sm mb-1">
                {t("common:form.required")}
              </p>
            )}
            <textarea
              className={`w-full border px-3 py-2 rounded ${
                contentError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("placeholder.postContent")}
              rows={4}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (contentError) setContentError(false);
              }}
            />
          </div>

          <Button type={ButtonVariant.Primary} onClick={handleSubmit}>
            <span className="flex items-center gap-1">
              <FiSend />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
