'use client';

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import GroupCard from "@/components/GroupCard";
import SearchInput from "@/components/SearchInput";
import Selector from "@/components/Selector";
import Button, { ButtonVariant } from "@/components/Button";
import CreateGroupModal from "@/components/CreateGroupModal";
import JoinGroupModal from "@/components/JoinGroupModal";
import { useGroupFilter, SortOption } from "@/hooks/useGroupsFilter";
import { useGroups } from "@/hooks/useGroups";

const GroupsPage = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { t } = useTranslation(['groups', 'common']);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }

        const user = await res.json();
        setUserId(user.userId);
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  const {
    myGroups,
    availableGroups,
    loading,
    error,
    handleJoin,
    handleLeave,
    handleCreate,
  } = useGroups(userId);

  const {
    search,
    setSearch,
    sort,
    setSort,
    sortOptions,
    filteredGroups: filteredMyGroups
  } = useGroupFilter(myGroups);

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-full text-primary text-xl">
        {t('common:loading')}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t('title')} />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 pb-4">
        <div className="flex flex-wrap gap-3">
          <SearchInput
            placeholder={t('search')}
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
            text={t('button.join')}
            type={ButtonVariant.Primary}
            onClick={() => setShowJoinModal(true)}
          />
          <Button
            text={t('button.create')}
            type={ButtonVariant.Primary}
            onClick={() => setShowCreateModal(true)}
          />
        </div>
      </div>

      {/* Groups grid */}
      <div className="grow overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-primary text-xl">
            {t('common:loading')}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-primary text-xl">
            {error}
          </div>
        ) : filteredMyGroups.length === 0 ? (
          <div className="flex items-center justify-center h-full text-primary text-xl">
            {t('noGroup')}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-3">
            {filteredMyGroups.map((group) => (
              <GroupCard
                key={group.groupId}
                group={group}
                joined={true}
                onLeave={() => handleLeave(group.groupId)}
              />
            ))}
          </div>
        )}
      </div>

      {showJoinModal && (
        <JoinGroupModal
          onClose={() => setShowJoinModal(false)}
          groups={availableGroups}
          onJoin={handleJoin}
          error={error ?? undefined}
          loading={loading}
        />
      )}

      {showCreateModal && userId && (
        <CreateGroupModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default GroupsPage;