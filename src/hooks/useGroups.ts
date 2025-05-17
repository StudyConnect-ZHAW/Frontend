import { useEffect, useState } from 'react';
import {
  createGroup,
  getAllGroups,
  getOwnGroups,
  joinGroup,
  leaveGroup,
} from '@/lib/api/groups';
import type { Group, GroupCreateData } from '@/types/group';
import { showToast, ToastType } from '@/components/Toast';
import { useTranslation } from 'react-i18next';

export function useGroups(userId: string) {
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation(['groups', 'common']);

  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        setError(null);

        const [all, own] = await Promise.all([
          getAllGroups(),
          getOwnGroups(userId),
        ]);

        const ownIds = new Set(own.map((g) => g.groupId));
        const available = all.filter((g) => !ownIds.has(g.groupId));

        setMyGroups(own);
        setAvailableGroups(available);
      } catch (err) {
        console.error('Error loading groups:', err);
        setError(t('errorLoading'));
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, [userId]);

  const handleJoin = async (groupId: string) => {
    try {
      const group = await joinGroup(groupId);
      setMyGroups((prev) => [...prev, group]);
      setAvailableGroups((prev) => prev.filter((g) => g.groupId !== groupId));

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('toast.joinSuccess'));
    } catch (err) {
      console.error('Failed to join group', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('toast.joinError'));
    }
  };

  const handleLeave = async (groupId: string) => {
    try {
      await leaveGroup(groupId);
      const leavingGroup = myGroups.find((g) => g.groupId === groupId);
      if (!leavingGroup) return;
      setAvailableGroups((prev) => [...prev, leavingGroup]);
      setMyGroups((prev) => prev.filter((g) => g.groupId !== groupId));

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('toast.leaveSuccess'));
    } catch (err) {
      console.error('Failed to leave group', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('toast.leaveError'));
    }
  };

  const handleCreate = async (data: GroupCreateData) => {
    try {
      const newGroup = await createGroup({ ...data, ownerId: userId });
      setMyGroups((prev) => [...prev, newGroup]);

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('toast.createSuccess'));
    } catch (err) {
      console.error('Failed to create group', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('toast.createError'));
    }
  }

  return {
    myGroups,
    availableGroups,
    loading,
    error,
    handleJoin,
    handleLeave,
    handleCreate,
  };
}