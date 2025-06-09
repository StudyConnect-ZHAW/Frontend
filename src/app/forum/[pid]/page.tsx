"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Post } from "@/types/posts";
import { useTranslation } from "react-i18next";
import { getPostById } from "@/lib/handlers/postHandler";
import Logo from "@/components/Logo";
import CommentInput from "@/components/CommentInput";
import CommentThread from "@/components/CommentThread";
import { useComments } from "@/hooks/useForumComments";

export default function PostDetailPage() {
  const { t, i18n } = useTranslation(["forum", "common"]);
  const { pid } = useParams<{ pid: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);

  const {
    comments,
    likedCommentIds,
    submitComment,
    handleToggleLike,
    refresh: refreshComments,
  } = useComments(pid);

  useEffect(() => {
    async function fetchPost() {
      try {
        const postData = await getPostById(pid);
        setPost(postData);
      } catch (err) {
        console.error('Failed to load post detail page:', err);
      } finally {
        setLoadingPost(false);
      }
    }

    fetchPost();
  }, [pid]);

  if (loadingPost || !post) {
    return (
      <div className="flex items-center justify-center h-full text-primary text-xl">
        {t('common:loading')}
      </div>
    );
  }

  const createdAt = new Date(post.created);
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(createdAt);

  return (
    <div className="flex flex-row justify-between items-start w-full gap-4">
      {/* Left corner: Back button */}
      <Link
        href="/forum"
        className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-main text-primary bg-sidebar-bg hover:bg-primary-bg"
        aria-label="Back to forum"
      >
        <FiArrowLeft className="text-2xl" />
      </Link>

      {/* Middle: Post */}
      <div className="grow px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-64">
        <section className="rounded-xl border border-main bg-sidebar-bg p-5 shadow-sm mb-3">
          <div className="text-sm text-gray-500 mb-1">
            {formattedDate} • {post.user.firstName} {post.user.lastName}
          </div>

          <h1 className="text-xl font-semibold mb-2">{post.title}</h1>

          <p className="text-base text-primary whitespace-pre-wrap wrap-anywhere">{post.content}</p>
        </section>

        <CommentInput
          onSubmit={async (text) => {
            await submitComment(text);
          }}
        />

        <section className="mt-2">
          <h2 className="text-lg font-semibold mb-3">{t('comments')}</h2>

          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">{t('noComments', 'No comments yet.')}</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => {
                console.log("Rendering comment:", comment);

                return (
                  <CommentThread
                    key={comment.forumCommentId}
                    comment={comment}
                    depth={0}
                    postId={pid}
                    onCommentsUpdated={refreshComments}
                    isLiked={(id) => likedCommentIds.has(id)}
                    onLike={handleToggleLike}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Right corner: Logo */}
      <div className="shrink-0">
        <Logo />
      </div>
    </div>
  );
}
