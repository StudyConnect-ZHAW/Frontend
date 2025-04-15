"use client";

import React from "react";
import PageHeader from "@/components/PageHeader";
import WIPSection from "@/components/WIPSection";
import ForumPost from "@/components/ForumPost";
import SearchField from "@/components/SearchField";
import SortField from "@/components/SortField";
import Link from "next/link";
import NewPostForm from "@/components/NewPostForm";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string; // oder z.B. Date
  likes: number;
  comments: number;
  shares: number;
}

// Nur zur Demo; später bekommst du diese Daten vom Backend
const initialPosts: Post[] = [
  {
    id: 1,
    title: "Erster Testpost",
    content: "Lorem ipsum ...",
    author: "Alice",
    date: "2025-04-05",
    likes: 10,
    comments: 2,
    shares: 1,
  },
  {
    id: 2,
    title: "Zweiter Testpost",
    content: "Lorem ipsum ...",
    author: "Bob",
    date: "2025-04-06",
    likes: 5,
    comments: 0,
    shares: 2,
  },
];

export default function ForumPage() {
  return (
    <div className="p-4">
      <PageHeader title="Forum" />
      <NewPostForm
        onPostCreated={() => {
          // Neuladen der Posts o.Ä., wenn ein Post erfolgreich erstellt wurde
          // z.B. setPosts([...posts, neuErstellterPost]);
        }}
      />

      <div className="mt-4 flex flex-row items-center gap-4">
        <SearchField placeholder="Search..." />
        <SortField />
      </div>

      {/* Posts-Liste */}
      <div className="mt-4 flex flex-col gap-4">
        {initialPosts.map((post) => (
          <Link
            key={post.id}
            href={`/forum/${post.id}`} // <-- /forum/1, /forum/2, etc.
            className="hover:opacity-80" // Optionales Styling
          >
            <ForumPost post={post} />
          </Link>
        ))}
      </div>
    </div>
  );
}