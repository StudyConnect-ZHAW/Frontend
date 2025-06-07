"use client";

import Button, { ButtonVariant } from "@/components/Button";
import CreatePostModal from "@/components/CreatePostModal";
import PostCard from "@/components/PostCard";
import PageHeader from "@/components/PageHeader";
import SearchInput from "@/components/SearchInput";
import Selector from "@/components/Selector";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useForumCategories } from "@/hooks/useForumCategories";
import { SortOption, useForumFilter } from "@/hooks/useForumFilters";
import { useForumPosts } from "@/hooks/useForumPosts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLikedPostIds } from "@/lib/handlers/postHandler";

export default function ForumPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { t } = useTranslation(["forum", "common"]);

  const { user, loading: loadingUser } = useCurrentUser();

  const {
    posts,
    likedPostIds,
    loading: loadingPosts,
    handleCreatePost,
    handleToggleLike,
  } = useForumPosts();

  const {
    search,
    setSearch,
    sort,
    setSort,
    sortOptions,
    filteredPosts
  } = useForumFilter(posts);

  const { categories } = useForumCategories();

  if (loadingUser || !user) {
    return (
      <div className="flex items-center justify-center h-full text-primary text-xl">
        {t("common:loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t("title")} />

      <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-64">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 pb-4">

          <div className="flex flex-wrap gap-3">
            <SearchInput
              placeholder={t("placeholder.search")}
              value={search}
              onChange={setSearch}
              className="w-full sm:w-64"
            />

            <Selector
              options={sortOptions}
              value={sort}
              onChange={(val) => setSort(val as SortOption)}
              className="w-full sm:w-64"
            />
          </div>

          <div className="flex flex-wrap gap-3 ml-auto">
            <Button
              text={t("button.createPost")}
              type={ButtonVariant.Primary}
              onClick={() => setShowCreateModal(true)}
            />
          </div>
        </div>

        {/* Post list */}
        {loadingPosts ? (
          <p>{t("common:loading")}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPosts.map((p) => (
              <PostCard
                key={p.forumPostId}
                post={p}
                onLike={handleToggleLike}
                isLiked={likedPostIds.has(p.forumPostId)}
              />
            ))}
            {!filteredPosts.length && (
              <p className="text-sm text-gray-500">{t("noPosts")}</p>
            )}
          </div>
        )}

        {/* Modal for creating a new post */}
        {showCreateModal && (
          <CreatePostModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreatePost}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}
