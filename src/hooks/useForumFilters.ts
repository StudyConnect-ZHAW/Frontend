import { Post } from "@/types/posts";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type SortOption = "newest";

export function useForumFilter(posts: Post[]) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const { t } = useTranslation(["forum", "common"]);

  const sortOptions = [{ label: t("sort.newest"), value: "newest" }];

  const filteredPosts = posts;

  return {
    search,
    setSearch,
    sort,
    setSort,
    sortOptions,
    filteredPosts,
  };
}
