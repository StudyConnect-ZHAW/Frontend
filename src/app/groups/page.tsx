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
import { useGroupFilter, sortOptions, SortOption, } from "@/hooks/useGroupsFilter";
import { useGroups } from "@/hooks/useGroups";

const userId = 'some-user-id';

const GroupsPage = () => {
  const { t } = useTranslation(['groups', 'common']);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    myGroups,
    availableGroups,
    loading,
    error,
    handleJoin,
    handleLeave,
  } = useGroups(userId);

  const { search, setSearch, sort, setSort, filteredGroups: filteredMyGroups } = useGroupFilter(myGroups);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t('title')} />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 pb-4">
        <div className="flex flex-wrap gap-3">
          <SearchInput
            placeholder="Search groups..."
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
            text={"Join Group"}
            type={ButtonVariant.Primary}
            onClick={() => setShowJoinModal(true)}
          />
          <Button
            text={"Create Group"}
            type={ButtonVariant.Primary}
            onClick={() => setShowCreateModal(true)}
          />
        </div>
      </div>

      {/* Groups grid */}
      <div className="grow overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-primary text-xl">
            Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-primary text-xl">
            {error}
          </div>
        ) : filteredMyGroups.length === 0 ? (
          <div className="flex items-center justify-center h-full text-primary text-xl">
            You don't have any groups.
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

      {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};

export default GroupsPage;