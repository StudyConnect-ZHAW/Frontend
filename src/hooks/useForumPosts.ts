import {
  createPost,
  getAllPosts,
  getPostById,
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
      const newPostId = await createPost(data);
      const newPost = await getPostById(newPostId);
      setPosts((prev) => [newPost, ...prev]);
    } catch (err) {
      console.error("Failed to create post", err);
      setError(t("common:error.creatingPost", "Failed to create post."));
    }
  };

  return {
    posts,
    loading,
    error,
    handleCreatePost,
  };
}
