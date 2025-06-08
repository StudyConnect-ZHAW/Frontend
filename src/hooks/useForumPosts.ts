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
      setPosts((prev) =>
        prev.map((p) =>
          p.forumPostId === postId
            ? {
              ...p,
              likeCount: likedPostIds.has(postId)
                ? p.likeCount - 1
                : p.likeCount + 1,
            }
            : p
        )
      );

      setLikedPostIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });

      await togglePostLike(postId);
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
  };
}