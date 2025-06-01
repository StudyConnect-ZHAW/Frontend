import {
  createPost,
  getAllPosts,
  getPostById,
  toggleLike,
} from "@/lib/handlers/postHandler";
import { Post, PostCreateData } from "@/types/posts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function useForumPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setError(t("common:error.loadingPosts", "Failed to load posts."));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (data: PostCreateData) => {
    try {
      const post = await createPost(data);
      setPosts((prev) => [post, ...prev]);
    } catch (err) {
      console.error("Failed to create post", err);
      setError(t("common:error.creatingPost", "Failed to create post."));
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      await toggleLike(postId);

      // TODO: Like count isn't updated in time for this call (backend problem)
      const updatedPost = await getPostById(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p.forumPostId === postId ? updatedPost : p
        )
      );

      setError(null);
    } catch (err) {
      console.error("Failed to toggle like", err);
      setError(t("common:toast.titleError", "Failed to update like."));
    }
  };

  return {
    posts,
    loading,
    error,
    handleCreatePost,
    handleToggleLike,
  };
}
