import { useEffect, useState } from "react";
import {
  getCommentsForPost,
  getLikedCommentIds,
  toggleCommentLike,
  createComment,
} from "@/lib/handlers/commentHandler";
import { Comment } from "@/types/comment";
import { useTranslation } from "react-i18next";

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const [comments, liked] = await Promise.all([
        getCommentsForPost(postId),
        getLikedCommentIds(),
      ]);
      setComments(comments);
      setLikedCommentIds(new Set(liked));
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (text: string, parentCommentId: string | null = null) => {
    await createComment(postId, { parentCommentId, content: text });
    await fetchComments();
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      const added = await toggleCommentLike(commentId); // boolean

      const updateLikeRecursively = (comments: Comment[]): Comment[] =>
        comments.map((c) => ({
          ...c,
          likeCount:
            c.forumCommentId === commentId
              ? c.likeCount + (added ? 1 : -1)
              : c.likeCount,
          replies: c.replies ? updateLikeRecursively(c.replies) : [],
        }));

      setComments((prev) => updateLikeRecursively(prev));

      setLikedCommentIds((prev) => {
        const updated = new Set(prev);
        if (added) {
          updated.add(commentId);
        } else {
          updated.delete(commentId);
        }

        return updated;
      });
    } catch (err) {
      console.error("Failed to toggle comment like", err);
      setError(t("common:toast.titleError", "Failed to update like."));
    }
  };

  return {
    comments,
    likedCommentIds,
    loading,
    error,
    submitComment,
    handleToggleLike,
    refresh: fetchComments,
  };
}
