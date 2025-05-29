import { useMemo, useState } from 'react';
import type { Group } from '@/types/group';
import { useTranslation } from 'react-i18next';

export type SortOption = 'alphabet' | 'members' | 'newest';

export function useGroupFilter(groups: Group[]) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('alphabet');

  const { t } = useTranslation(['groups', 'common']);

  const sortOptions = [
    { label: t('sort.alphabet'), value: 'alphabet' },
    { label: t('sort.members'), value: 'members' },
    { label: t('sort.newest'), value: 'newest' },
  ];

  const filteredGroups = useMemo(() => {
    const filtered = groups.filter((g) =>
      g.name.toLowerCase().includes(search.toLowerCase())
    );

    switch (sort) {
      case 'alphabet':
        return filtered.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      case 'members':
        return filtered.sort((a, b) => (b.members?.length ?? 0) - (a.members?.length ?? 0));
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return filtered;
    }
  }, [groups, search, sort]);

  return {
    search,
    setSearch,
    sort,
    setSort,
    sortOptions,
    filteredGroups,
  };
}
