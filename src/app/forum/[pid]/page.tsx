/* ── app/forum/[pid]/page.tsx ─────────────────────────────────────────
   Client-side page that shows a single forum post with threaded comments
   ------------------------------------------------------------------- */
   "use client";

   import React, { useEffect, useState } from "react";
   import Link from "next/link";
   import { useParams } from "next/navigation";
   
   import PageHeader from "@/components/PageHeader";
   import SortField   from "@/components/SortField";
   
   import {
     FiArrowLeft,
     FiMessageSquare,
     FiSend,
     FiShare2,
     FiThumbsUp,
   } from "react-icons/fi";
   
   /* ---------- Type definitions -------------------------------------- */
   interface Comment {
     id: number;
     author: string;
     minutesAgo: number;
     content: string;
     likes?: number;
     children?: Comment[];
   }
   
   interface Post {
     title: string;
     author: string;
     minutesAgo: number;
     content: string;
     tags: string[];
     likes: number;
     shares: number;
     comments: Comment[];
   }
   
   /* ---------- Component --------------------------------------------- */
   export default function PostDetailPage() {
     const { pid } = useParams<{ pid: string }>();
   
     const [post, setPost]                 = useState<Post | null>(null);
     const [commentInput, setCommentInput] = useState("");
     const [isCommentLoading, setLoading]  = useState(false);
     const [replyTo, setReplyTo]           = useState<Comment | null>(null);
   
     /* Temporary demo data – replace with real API call later */
     useEffect(() => {
       setPost({
         title: "ZHAW Feier",
         author: "Alex Sivapalan",
         minutesAgo: 38,
         content:
           "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
         tags: ["ZHAW", "Feier"],
         likes: 210,
         shares: 10,
         comments: [
           {
             id:        1,
             author:    "Sumaya Mohat",
             minutesAgo: 20,
             content:   "Oh wow... Lorem Ipsum.. REALLY??",
             children: [
               {
                 id:         2,
                 author:     "Raggi Thayan",
                 minutesAgo: 5,
                 content:    "YES YES",
               },
             ],
           },
           {
             id:         3,
             author:     "Sumaya Mohat",
             minutesAgo: 2,
             content:    "crazy",
           },
         ],
       });
     }, [pid]);
   
     /* ---------- Helper components ------------------------------------ */
     const TagChip = ({ label }: { label: string }) => (
       <span className="ml-1 rounded-full bg-black px-2 py-[2px] text-[10px] uppercase leading-none text-white">
         {label} ✕
       </span>
     );
   
     const iconHover = "text-base transition-all duration-200 hover:scale-125";
   
     /** Single comment node (recursive) */
     const CommentNode = ({
       comment,
       depth = 0,
     }: {
       comment: Comment;
       depth?: number;
     }) => {
       const [likes, setLikes] = useState(comment.likes ?? 0);
   
       return (
         <div
           className={`mt-4 ${depth ? "border-l pl-5" : ""} border-gray-300`}
         >
           {/* meta-line */}
           <div className="flex items-center gap-1 text-xs text-gray-500">
             <span className="font-semibold">{comment.author}</span> •{" "}
             <span>{comment.minutesAgo} min ago</span>
           </div>
   
           <p className="text-sm">{comment.content}</p>
   
           {/* like / reply bar */}
           <div className="mt-1 flex items-center gap-4 text-xs text-gray-600">
             <button
               onClick={() => setLikes(likes + 1)}
               className="flex items-center gap-1 transition hover:scale-110"
             >
               <FiThumbsUp /> {likes}
             </button>
   
             <button
               onClick={() => setReplyTo(comment)}
               className="hover:underline"
             >
               Reply
             </button>
           </div>
   
           {/* nested replies */}
           {comment.children?.map((c) => (
             <CommentNode key={c.id} comment={c} depth={depth + 1} />
           ))}
         </div>
       );
     };
   
     /* ---------- Loading state ---------------------------------------- */
     if (!post) return <div className="p-10">Loading …</div>;
   
     /* ---------- Render ------------------------------------------------ */
     return (
       <div className="relative flex gap-6 px-6 py-4">
         {/* MAIN COLUMN */}
         <main className="flex-1 pr-6">
           {/* header with back arrow + title */}
           <div className="relative mb-4">
             <Link
               href="/forum"
               title="Back to Forum"
               className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-black p-1 transition hover:bg-[#ec3349] hover:text-white dark:border-white"
             >
               <FiArrowLeft size={16} />
             </Link>
   
             <div className="pl-8">
               <PageHeader title={post.title} />
             </div>
           </div>
   
           {/* post box */}
           <section className="rounded-[15px] border-2 border-[#FDBA15] bg-[var(--sidebar-bg,#fff)] p-4">
             <div className="mb-2 flex items-start justify-between">
               {/* author + time */}
               <div className="flex items-center gap-1 text-xs text-gray-500">
                 <img
                   src="/path/to/avatar.png"
                   alt="avatar"
                   className="h-4 w-4 rounded-full"
                 />
                 <span className="font-semibold">{post.author}</span> •{" "}
                 <span>{post.minutesAgo} minutes ago</span>
               </div>
   
               {/* tags */}
               <div className="flex">
                 {post.tags.map((t) => (
                   <TagChip key={t} label={t} />
                 ))}
               </div>
             </div>
   
             <p>{post.content}</p>
           </section>
   
           {/* interaction bar */}
           <div className="mt-2 flex gap-6 text-sm text-gray-600">
             <span className="flex items-center gap-1">
               <FiThumbsUp className={iconHover} /> {post.likes}
             </span>
             <span className="flex items-center gap-1">
               <FiShare2 className={iconHover} /> {post.shares}
             </span>
           </div>
   
           {/* comment editor */}
           <form
             className="relative mt-8"
             onSubmit={async (e) => {
               e.preventDefault();
               if (!commentInput.trim()) return;
   
               try {
                 setLoading(true);
                 /* TODO: send to backend – replyTo holds parent ID */
                 setCommentInput("");
                 setReplyTo(null);
               } finally {
                 setLoading(false);
               }
             }}
           >
             {replyTo && (
               <div className="mb-1 flex items-center gap-2 text-xs">
                 Replying to{" "}
                 <span className="font-semibold">{replyTo.author}</span>
                 <button
                   type="button"
                   onClick={() => setReplyTo(null)}
                   className="text-red-500 hover:underline"
                 >
                   cancel
                 </button>
               </div>
             )}
   
             <textarea
               placeholder="Write a comment…"
               value={commentInput}
               onChange={(e) => setCommentInput(e.target.value)}
               rows={1}
               className="w-full resize-none rounded-xl border-2 border-[#FDBA15] bg-white px-4 py-2 pr-24 text-sm focus:outline-none focus:ring-0"
             />
   
             <button
               type="submit"
               disabled={isCommentLoading}
               className="absolute top-5 right-2 -translate-y-1/2 flex items-center gap-1 rounded bg-[#ec3349] px-1.5 py-1 text-sm font-bold text-white transition hover:scale-105 hover:bg-black disabled:opacity-60"
               style={{ borderRadius: "7px" }}
             >
               {isCommentLoading ? "Posting…" : <>Post <FiSend /></>}
             </button>
           </form>
   
           {/* sort dropdown + comment list */}
           <div className="mt-6 flex items-center justify-between">
             <span className="text-sm font-semibold">Sorted by: Newest first</span>
             <SortField />
           </div>
   
           <div className="mt-4">
             {post.comments.map((c) => (
               <CommentNode key={c.id} comment={c} />
             ))}
           </div>
         </main>
   
         {/* RIGHT SIDEBAR (chat) */}
         <aside className="ml-auto w-80 flex-shrink-0">
           <div className="h-full rounded-xl border-2 border-[#FDBA15]">
             <h2 className="m-4 text-2xl font-bold">Chat</h2>
           </div>
         </aside>
       </div>
     );
   }
   