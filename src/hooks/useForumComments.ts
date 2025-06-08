import { useEffect, useState } from "react";
import {
  getCommentsForPost,
  getLikedCommentIds,
  toggleCommentLike,
  createComment,
} from "@/lib/handlers/commentHandler";
import { Comment } from "@/types/comment";

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

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
    await toggleCommentLike(commentId);
    setLikedCommentIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(commentId)) {
        updated.delete(commentId);
      } else {
        updated.add(commentId);
      }
      return updated;
    });
  };

  return {
    comments,
    likedCommentIds,
    loading,
    submitComment,
    handleToggleLike,
    refresh: fetchComments,
  };
}
