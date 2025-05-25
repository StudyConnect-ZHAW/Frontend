import { useEffect, useState, useCallback } from 'react';
import {
  createGroup,
  deleteGroup,
  getAllGroups,
  getJoinedGroups,
  getOwnedGroups,
  joinGroup,
  leaveGroup,
  getGroupMembers
} from '@/lib/handlers/groupsHandler';
import type { Group, GroupCreateData } from '@/types/group';
import { showToast, ToastType } from '@/components/Toast';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage groups the user has joined, owns, or can join.
 * 
 * @param userId - The unique identifier of the current user (required).
 */
export function useGroups(userId?: string) {
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation(['groups', 'common']);

  /**
   * Loads the user's owned/joined groups and all available groups.
   * Filters out groups the user is already part of (owned or joined).
   */
  const fetchGroups = useCallback(async () => {
    if (!userId) { return; }

    try {
      setLoading(true);
      setError(null);

      const [joined, owned, all] = await Promise.all([
        getJoinedGroups(userId as string),
        getOwnedGroups(userId as string),
        getAllGroups(),
      ]);

      // Merge owned and joined groups, avoiding duplicates
      const ownedIds = new Set(owned.map((g) => g.groupId));
      const combined = [
        ...owned,
        ...joined.filter((g) => !ownedIds.has(g.groupId)),
      ]

      // Filter out groups the user is already in
      const myIds = new Set(combined.map((g) => g.groupId));
      const available = all.filter((g) => !myIds.has(g.groupId));

      setMyGroups(combined);
      setAvailableGroups(available);

      // Fetch member in parallel
      const enrichedGroups = await Promise.all(
        combined.map(async (group) => {
          try {
            const members = await getGroupMembers(group.groupId);
            return {
              ...group,
              members,
            };
          } catch {
            return {
              ...group,
              members: [],
            };
          }
        })
      );

      // Update member count mapping (+1 for owner)
      const memberCountEntries = enrichedGroups.map(g => [g.groupId, (g.members?.length ?? 0) + 1]);
      setMemberCounts(Object.fromEntries(memberCountEntries));

      setMyGroups(enrichedGroups);
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

  /**
   * Joins a group and moves it from the available list to the joined list.
   */
  const handleJoin = async (groupId: string) => {
    if (!userId) { return; }

    try {
      await joinGroup(groupId, userId);

      const group = availableGroups.find((g) => g.groupId === groupId)
      if (!group) { return; }

      setMyGroups((prev) => [...prev, group]);
      setAvailableGroups((prev) => prev.filter((g) => g.groupId !== groupId));

      setMemberCounts((prev) => ({
        ...prev,
        [groupId]: (prev[groupId] ?? 1) + 1,
      }));

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('toast.joinSuccess'));
    } catch (err) {
      console.error('Failed to join group', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('toast.joinError'));
    }
  };

  /**
   * Leaves a group and moves it back to available (unless owned since it gets deleted 
   * in the backend).
   */
  const handleLeave = async (groupId: string) => {
    if (!userId) { return; }

    const group = myGroups.find((g) => g.groupId === groupId);
    if (!group) { return; }

    try {
      const isOwner = group.ownerId === userId;

      if (isOwner) {
        // Delete owned group upon leaving
        await deleteGroup(groupId);
      } else {
        // Leave group and add it to available groups
        await leaveGroup(groupId, userId);
        setAvailableGroups((prev) => [...prev, group]);
      }

      setMyGroups((prev) => prev.filter((g) => g.groupId !== groupId));
      setMemberCounts((prev) => {
        const copy = { ...prev };
        delete copy[groupId]; // Remove group
        return copy;
      });

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('toast.leaveSuccess'));
    } catch (err) {
      console.error('Failed to leave group', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('toast.leaveError'));
    }
  };

  /**
   * Creates a new group and adds it directly to the joined list.
   */
  const handleCreate = async (data: GroupCreateData) => {
    if (!userId) { return; }

    try {
      const now = new Date().toISOString();
      const newGroup = {
        ...(await createGroup({ ...data, ownerId: userId })),
        createdAt: now,
      };
      setMyGroups((prev) => [...prev, newGroup]);
      setMemberCounts((prev) => ({ ...prev, [newGroup.groupId]: 1 }));

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('toast.createSuccess'));
    } catch (err) {
      console.error('Failed to create group', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('toast.createError'));
    }
  };

  return {
    myGroups,
    availableGroups,
    memberCounts,
    loading,
    error,
    handleJoin,
    handleLeave,
    handleCreate,
    refresh: fetchGroups,
  };
}