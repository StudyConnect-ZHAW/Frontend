"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
  const params = useParams();
  const pid = params.pid; // "pid" -> Ordnername: [pid]

  // Du kannst hier einen API-Call machen, um die Post-Daten vom Backend zu holen
  // Für Demo: nur ein simpler Zustand
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    // Beispiel: hole die Daten des Posts vom Backend:
    // fetch(`http://localhost:5000/v1/forum/${pid}`)
    //   .then((res) => res.json())
    //   .then((data) => setPost(data));
    
    // Für Demo: einfach nur "pid" reinsetzen
    setPost({
      title: "Beispiel-Post " + pid,
      content: "Lorem ipsum dolor sit amet...",
    });
  }, [pid]);

  if (!post) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
