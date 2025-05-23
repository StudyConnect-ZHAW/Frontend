import { useEffect, useState, useCallback } from 'react';
import {
  createGroup,
  getAllGroups,
  getJoinedGroups,
  getOwnedGroups,
  joinGroup,
  leaveGroup,
} from '@/lib/api/groups';
import type { Group, GroupCreateData } from '@/types/group';
import { showToast, ToastType } from '@/components/Toast';
import { useTranslation } from 'react-i18next';

export function useGroups(userId: string | null) {
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation(['groups', 'common']);

  const fetchGroups = useCallback(async () => {
    if (!userId) { return; };

    try {
      setLoading(true);
      setError(null);

      const [joined, owned, all] = await Promise.all([
        getJoinedGroups(userId as string),
        getOwnedGroups(userId as string),
        getAllGroups(),
      ]);

      // Avoid duplicates: prefer owned group over joined group
      const ownedIds = new Set(owned.map((g) => g.groupId));
      const combined = [
        ...owned,
        ...joined.filter((g) => !ownedIds.has(g.groupId)),
      ]

      const myIds = new Set(combined.map((g) => g.groupId));
      const available = all.filter((g) => !myIds.has(g.groupId));

      setMyGroups(combined);
      setAvailableGroups(available);
    } catch (err) {
      console.error('Error loading groups:', err);
      setError(t('errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleJoin = async (groupId: string) => {
    if (!userId) { return; };

    try {
      await joinGroup(groupId, userId);

      const group = availableGroups.find((g) => g.groupId === groupId)
      if (!group) { return; }

      setMyGroups((prev) => [...prev, group]);
      setAvailableGroups((prev) => prev.filter((g) => g.groupId !== groupId));

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('toast.joinSuccess'));
    } catch (err) {
      console.error('Failed to join group', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('toast.joinError'));
    }
  };

  const handleLeave = async (groupId: string) => {
    if (!userId) { return; };

    const group = myGroups.find((g) => g.groupId === groupId);
    if (!group) { return; }

    try {
      await leaveGroup(groupId, userId);

      const isOwner = group.ownerId === userId;

      // If owner leaves, the group gets deleted on backend, so don't move to available
      if (!isOwner) {
        setAvailableGroups((prev) => [...prev, group]);
      }

      setMyGroups((prev) => prev.filter((g) => g.groupId !== groupId));

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('toast.leaveSuccess'));
    } catch (err) {
      console.error('Failed to leave group', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('toast.leaveError'));
    }
  };

  const handleCreate = async (data: GroupCreateData) => {
    if (!userId) { return; };

    try {
      const newGroup = await createGroup({ ...data, ownerId: userId });
      setMyGroups((prev) => [...prev, newGroup]);

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('toast.createSuccess'));
    } catch (err) {
      console.error('Failed to create group', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('toast.createError'));
    }
  };

  return {
    myGroups,
    availableGroups,
    loading: loading || !userId,
    error,
    handleJoin,
    handleLeave,
    handleCreate,
    refresh: fetchGroups,
  };
}