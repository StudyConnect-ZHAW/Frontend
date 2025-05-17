import { useEffect, useState } from 'react';
import {
  getAllGroups,
  getOwnGroups,
  joinGroup,
  leaveGroup,
} from '@/lib/api/groups';
import type { Group } from '@/types/group';
import { showToast, ToastType } from '@/components/Toast';

export function useGroups(userId: string) {
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Failed to load groups. Please try again.');
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

      showToast(ToastType.Success, "Joined Group", "You have successfully joined the group.");
    } catch (err) {
      console.error('Failed to join group', err);
      showToast(ToastType.Error, "Join Failed", "Could not join the group. Please try again.");
    }
  };

  const handleLeave = async (groupId: string) => {
    try {
      await leaveGroup(groupId);
      const leavingGroup = myGroups.find((g) => g.groupId === groupId);
      if (!leavingGroup) return;
      setAvailableGroups((prev) => [...prev, leavingGroup]);
      setMyGroups((prev) => prev.filter((g) => g.groupId !== groupId));

      showToast(ToastType.Success, "Left Group", "You have successfully left the group.");
    } catch (err) {
      console.error('Failed to leave group', err);
      showToast(ToastType.Error, "Leave Failed", "Could not leave the group. Please try again.");
    }
  };

  return {
    myGroups,
    availableGroups,
    loading,
    error,
    handleJoin,
    handleLeave,
  };
}