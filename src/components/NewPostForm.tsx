"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { FiImage, FiSend } from "react-icons/fi";

interface NewPostFormProps {
  onPostCreated?: () => void;
}

export default function NewPostForm({ onPostCreated }: NewPostFormProps) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const borderAndShadowColor = theme === "dark" ? "#ec3349" : "#FDBA15";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);
      setErrorMsg("");

      const formData = new FormData();
      formData.append("content", content);
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      const response = await fetch("/v1/forum", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }

      if (onPostCreated) {
        onPostCreated();
      }

      setContent("");
      setImages(null);
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx">
      <div
        className="relative p-3 flex items-start max-h-[100px]"
        style={{
          border: `2px solid ${borderAndShadowColor}`,
          borderRadius: "15px",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          background: theme === "dark" ? "var(--sidebar-bg)" : "#FFFFFF",
        }}
      >
        {/* Avatar image */}
        <img
          src="/path/to/avatar.png"
          alt="Avatar"
          className="w-10 h-10 rounded-full mr-6 object-cover mt-4"
        />

        {/* Post form */}
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <textarea
            className="w-full mb-1 text-sm border-0 bg-transparent focus:outline-none focus:ring-0 h-15 overflow-y-auto resize-none"
            rows={2}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ lineHeight: "1.2rem" }}
          />

          {/* Image upload icon */}
          <label
            className="cursor-pointer absolute bottom-0 left-0"
            title="Upload image"
          >
            <FiImage
              className="text-2l text-gray-600 transition-all duration-200 hover:scale-125 hover:text-[#ec3349]"
            />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="hidden"
            />
          </label>

          {/* Submit button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="absolute bottom-0 right-0
               font-bold text-sm inline-flex items-center gap-1
               bg-[#ec3349] text-white px-2 py-1 rounded 
               transition hover:scale-105 hover:bg-black
               disabled:opacity-60"
              style={{ 
                borderRadius: "7px"
              }}

            >
              {isLoading ? (
                "Posting..."
              ) : (
                <>
                  <span>Post</span>
                  <FiSend className="text-white" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
