import { Group } from "@/types/group";
import SearchInput from "./SearchInput";
import Selector from "./Selector";
import GroupCard from "./GroupCard";
import { SortOption, useGroupFilter } from "@/hooks/useGroupsFilter";
import { useTranslation } from "react-i18next";

interface Props {
  onClose: () => void;
  groups: Group[];
  onJoin: (groupId: string) => void;
  error?: string;
  loading?: boolean;
}

export default function JoinGroupModal({ onClose, groups, onJoin, error, loading }: Props) {
  const { search, setSearch, sort, setSort, sortOptions, filteredGroups } = useGroupFilter(groups);

  const { t } = useTranslation(['groups', 'common']);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-primary-bg shadow-lg p-6 w-full max-w-4xl h-[80vh] relative border-main rounded-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-white cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">{t('titleJoin')}</h2>

        <div className="flex items-center gap-4 mb-4">
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
            className="w-full sm:w-48"
          />
        </div>

        {/* Groups grid */}
        <div className="flex-1 overflow-y-auto pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-primary text-xl">
              {t('common:loading')}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-primary text-xl">
              {error}
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="flex items-center justify-center h-full text-primary text-xl">
              {t('noGroupFound')}
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2">
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.groupId}
                  group={group}
                  joined={false}
                  onJoin={() => onJoin(group.groupId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}