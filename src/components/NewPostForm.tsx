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

  // Beim Laden aus localStorage lesen, ob User "dark" oder "light" eingestellt hat:
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

  // Dynamische Farbwerte analog zur Sidebar
  const borderAndShadowColor = theme === "dark" ?  "#ec3349" : "#FDBA15";

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
        throw new Error(`Fehler beim Erstellen des Posts: ${response.status}`);
      }

      if (onPostCreated) {
        onPostCreated();
      }

      setContent("");
      setImages(null);
    } catch (error: any) {
      setErrorMsg(error.message || "Etwas ist schief gelaufen...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx">
      <div
        className={`
          relative p-4 flex items-start 
        `}
        
        style={{
          border: `3px solid ${borderAndShadowColor}`,
          boxShadow: `4px 4px 10px ${borderAndShadowColor}`,
          borderRadius: "15px",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Profilbild (Beispiel) */}
        <img
          src="/path/to/avatar.png"
          alt="Avatar"
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />

        {/* Formular */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <textarea
            className={`
              w-full mb-3 text-base
              border-0 bg-transparent
              focus:outline-none focus:ring-0
            `}
            rows={3}
            placeholder="Was gibt's Neues?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Bild-Upload-Icon (absolute Position) */}
        <label
          className="cursor-pointer absolute bottom-4 left-20"
          title="Bild hochladen"
        >
          <FiImage
            className="text-2xl text-gray-600
                       transition-all duration-200
                       hover:scale-125 hover:text-[#ec3349]"
          />
        </label>

          {/* Fehlermeldung */}
          {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

          {/* Post-Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1
                         bg-blue-600 text-white px-4 py-2 rounded
                         hover:bg-blue-700 transition-colors"
            >
              {isLoading ? (
                "Poste..."
              ) : (
                <>
                  <FiSend className="text-white" />
                  <span>Posten</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
