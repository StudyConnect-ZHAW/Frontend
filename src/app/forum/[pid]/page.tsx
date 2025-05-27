"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { FiArrowLeft, FiSend, FiShare2, FiThumbsUp } from "react-icons/fi";
import { Post } from "@/types/posts";
import { Comment } from "@/types/comment";
import { useTranslation } from "react-i18next";
import { getPostById } from "@/lib/handlers/postHandler";
import { getCommentsForPost } from "@/lib/handlers/commentHandler";
import { create } from "domain";
import CommentThread from "@/components/CommentThread";

export default function PostDetailPage() {
  const { t, i18n } = useTranslation(["forum", "common"]);
  const { pid } = useParams<{ pid: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const postData = await getPostById(pid);
        const commentData = await getCommentsForPost(pid);
        setPost(postData);
        setComments(commentData);
      } catch (err) {
        console.error('Failed to load post detail page:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [pid]);

  if (loading || !post) {
    return (
      <div className="flex items-center justify-center h-full text-primary text-xl">
        {t('common:loading')}
      </div>
    )
  }

  const createdAt = new Date(post.created);
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(createdAt);

  return (
    <div className="flex flex-col">
      <PageHeader
        title={post.title}
        leadingContent={
          <Link
            href={"/forum"}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-main text-primary bg-sidebar-bg hover:bg-primary-bg transition"
            aria-label="Back to forum"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
        }
      />

      <section className="rounded-xl border border-main bg-sidebar-bg p-6 shadow-sm">
        <div className="text-sm text-gray-500 mb-2">
          {formattedDate} • {post.author.firstName} {post.author.lastName}
        </div>
        <p className="text-base text-primary whitespace-pre-wrap">{post.content}</p>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold mb-3">{t('comments')}</h2>

        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">{t('noComments', 'No comments yet.')}</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentThread key={comment.id} comment={comment} depth={0} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
