import useSWR from 'swr';
import {
  getAllGroups,
  getGroupById,
} from '@/lib/api/groups';
import type { Group } from '@/types/group';

export function useGroups() {
  const {
    data: groups,
    error,
    isLoading,
    mutate,
  } = useSWR<Group[]>('/v1/groups', getAllGroups);

  return {
    groups,
    isLoading,
    isError: !!error,
    mutate,
  };
}

export function useGroupById(id?: string) {
  const shouldFetch = Boolean(id);

  const {
    data: group,
    error,
    isLoading,
  } = useSWR<Group>(shouldFetch ? `/v1/groups/${id}` : null, () => getGroupById(id!));

  return {
    group,
    isLoading,
    isError: !!error,
  };
}
