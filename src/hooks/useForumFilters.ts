import { Post } from "@/types/posts";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type SortOption = "newest" | "comments" | "likes";

export function useForumFilter(posts: Post[]) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const { t } = useTranslation(["forum", "common"]);

  const sortOptions = [
    { label: t("sort.newest"), value: "newest" },
    { label: t("sort.mostComments"), value: "comments" },
    { label: t("sort.mostLikes"), value: "likes" },
  ];

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

    switch (sort) {
      case "newest":
        return filtered.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      case "comments":
        return filtered.sort((a, b) => b.commentCount - a.commentCount);
      case "likes":
        return filtered.sort((a, b) => b.likeCount - a.likeCount);
      default:
        return filtered;
    }
  }, [posts, search, sort]);

  return {
    search,
    setSearch,
    sort,
    setSort,
    sortOptions,
    filteredPosts,
  };
}
