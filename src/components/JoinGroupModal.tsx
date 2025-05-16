import { Group } from "@/types/group";
import { useMemo, useState } from "react";
import SearchInput from "./SearchInput";
import Selector from "./Selector";
import GroupCard from "./GroupCard";

interface Props {
  onClose: () => void;
}

const sortOptions = [
  { label: 'Alphabetical', value: 'alphabet' },
  { label: 'Most Members', value: 'members' },
  { label: 'Newest', value: 'newest' },
];

type SortOption = 'alphabet'; // TODO: Add the other options

export default function JoinGroupModal({ onClose }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('alphabet');

  // TODO: Fetch groups using API function

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-primary-bg shadow-lg p-6 w-full max-w-4xl h-[80vh] relative border-main rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-white cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Join a Group</h2>

        <div className="flex items-center gap-4 mb-4">
          <SearchInput
            placeholder="Search available groups..."
            value={search}
            onChange={setSearch}
            className="w-full sm:w-64"
          />
          <Selector
            options={sortOptions}
            value={sort}
            onChange={(val) => setSort(val as SortOption)}
            className="w-full sm:w-48"
          />
        </div>

        {/* Groups grid */}
        <div className="grow overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-primary text-xl">
              No groups found.
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2">
              {filtered.map((group) => (
                <GroupCard key={group.groupId} group={group} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}