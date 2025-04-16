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
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

// Temporary demo posts; will be replaced with data from backend
const initialPosts: Post[] = [
  {
    id: 1,
    title: "First test post",
    content: "Lorem ipsum ...",
    author: "Alice",
    date: "2025-04-05",
    likes: 10,
    comments: 2,
    shares: 1,
  },
  {
    id: 2,
    title: "Second test post",
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
      {/* Page heading */}
      <PageHeader title="Forum" />

      {/* Form to create a new post */}
      <NewPostForm
        onPostCreated={() => {
          // Reload posts or fetch from backend once a post is successfully created
          // e.g., setPosts([...posts, newPost]);
        }}
      />

      {/* Search and sort controls */}
      <div className="mt-4 flex flex-row items-center gap-4">
        <SearchField placeholder="Search..." />
        <SortField />
      </div>

      {/* List of forum posts */}
      <div className="mt-4 flex flex-col gap-4">
        {initialPosts.map((post) => (
          <Link
            key={post.id}
            href={`/forum/${post.id}`} // e.g., /forum/1, /forum/2, etc.
            className="hover:opacity-80"
          >
            <ForumPost post={post} />
          </Link>
        ))}
      </div>
    </div>
  );
}
