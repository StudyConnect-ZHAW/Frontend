'use client';

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import GroupCard from "@/components/GroupCard";
import SearchInput from "@/components/SearchInput";
import Selector from "@/components/Selector";
import Button, { ButtonVariant } from "@/components/Button";
import CreateGroupModal from "@/components/CreateGroupModal";
import JoinGroupModal from "@/components/JoinGroupModal";
import { useGroupFilter, SortOption } from "@/hooks/useGroupsFilter";
import { useGroups } from "@/hooks/useGroups";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const GroupsPage = () => {
  const { t } = useTranslation(['groups', 'common']);
  const { user, loading: loadingUser } = useCurrentUser();
  const userGuid = user?.userGuid;

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    myGroups,
    availableGroups,
    memberCounts,
    loading,
    error,
    handleJoin,
    handleLeave,
    handleCreate,
  } = useGroups(userGuid);

  const {
    search,
    setSearch,
    sort,
    setSort,
    sortOptions,
    filteredGroups: filteredMyGroups
  } = useGroupFilter(myGroups);

  // Show loading screen until user is loaded
  if (loadingUser || !userGuid) {
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
            text={t('button.joinGroup')}
            type={ButtonVariant.Primary}
            onClick={() => setShowJoinModal(true)}
          />
          <Button
            text={t('button.createGroup')}
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
                memberCount={memberCounts[group.groupId]}
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

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={({ name, description }) =>
            handleCreate({ name, description })
          }
        />
      )}
    </div>
  );
};

export default GroupsPage;