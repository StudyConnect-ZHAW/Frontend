import {
  createPost,
  getAllPosts,
  getLikedPostIds,
  togglePostLike,
} from "@/lib/handlers/postHandler";
import { Post, PostCreateData } from "@/types/posts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function useForumPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    fetchPostsAndLikes();
  }, []);

  const fetchPostsAndLikes = async () => {
    try {
      setLoading(true);
      const [postsData, likedIds] = await Promise.all([
        getAllPosts(),
        getLikedPostIds(),
      ]);

      setPosts(postsData);
      setLikedPostIds(new Set(likedIds));
      setError(null);
    } catch (err) {
      console.error("Failed to fetch posts or likes", err);
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
      const added = await togglePostLike(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p.forumPostId === postId
            ? { ...p, likeCount: p.likeCount + (added ? 1 : -1) }
            : p
        )
      );

      setLikedPostIds((prev) => {
        const updated = new Set(prev);
        if (added) {
          updated.add(postId);
        } else {
          updated.delete(postId);
        }

        return updated;
      });
    } catch (err) {
      console.error("Failed to toggle like", err);
      setError(t("common:toast.titleError", "Failed to update like."));
    }
  };

  return {
    posts,
    likedPostIds,
    loading,
    error,
    handleCreatePost,
    handleToggleLike,
    refresh: fetchPostsAndLikes,
  };
}