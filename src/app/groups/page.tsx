'use client';

import React, { useMemo, useState } from "react";
import { useGroups } from "@/hooks/useGroups";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import GroupCard from "@/components/GroupCard";
import SearchInput from "@/components/SearchInput";
import Selector from "@/components/Selector";
import Button, { ButtonVariant } from "@/components/Button";
import CreateGroupModal from "@/components/CreateGroupModal";
import JoinGroupModal from "@/components/JoinGroupModal";

const sortOptions = [
  { label: 'Alphabetical', value: 'alphabet' },
  { label: 'Most Members', value: 'members' },
  { label: 'Newest', value: 'newest' },
]

type SortOption = 'alphabet'; // TODO: Add the other options

const GroupsPage = () => {
  const { t } = useTranslation(['groups', 'common']);

  const { groups = [], isLoading } = useGroups();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('alphabet');

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    let result = groups.filter((g) =>
      g.name.toLowerCase().includes(search.toLowerCase())
    );

    switch (sort) {
      case 'alphabet':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result;
    }
  }, [groups, search, sort]);

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
      <div className="grow overflow-y-auto pr-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-primary text-xl">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-primary text-xl">
            No groups found.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-3">
            {filtered.map((group) => (
              <GroupCard key={group.groupId} group={group} />
            ))}
          </div>
        )}
      </div>

      {showJoinModal && <JoinGroupModal onClose={() => setShowJoinModal(false)} />}
      {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

export default GroupsPage;