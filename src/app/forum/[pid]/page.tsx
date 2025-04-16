"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
  const params = useParams();
  const pid = params.pid; // "pid" corresponds to the dynamic route folder name: [pid]

  const [post, setPost] = useState<any>(null);

  // Simulate fetching post data (e.g., from an API)
  useEffect(() => {
    // Example API call:
    // fetch(`http://localhost:5000/v1/forum/${pid}`)
    //   .then((res) => res.json())
    //   .then((data) => setPost(data));

    // Demo placeholder content using pid
    setPost({
      title: "Example Post " + pid,
      content: "Lorem ipsum dolor sit amet...",
    });
  }, [pid]);

  if (!post) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="p-4">
      {/* Post title */}
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>

      {/* Post content */}
      <p>{post.content}</p>
    </div>
  );
}
