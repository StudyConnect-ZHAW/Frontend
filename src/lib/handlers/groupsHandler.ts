import type { Group, GroupCreateData, GroupMember, GroupUpdateData } from '@/types/group';
import { parseResponse } from '@/lib/api/parseResponse';

export async function createGroup(data: GroupCreateData): Promise<Group> {
  const res = await fetch(`api/groups`, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(data),
  });

  return parseResponse<Group>(res);
}

export async function getAllGroups(): Promise<Group[]> {
  const res = await fetch(`api/groups`, {
    credentials: 'include',
    method: 'GET',
  });

  return parseResponse<Group[]>(res);
}

export async function getGroupById(groupId: string): Promise<Group> {
  const res = await fetch(`api/groups/${groupId}`, {
    credentials: 'include',
    method: 'GET',
  });

  return parseResponse<Group>(res);
}

export async function updateGroup(groupId: string, data: GroupUpdateData): Promise<string> {
  const res = await fetch(`api/groups/${groupId}`, {
    credentials: 'include',
    method: 'PUT',
    body: JSON.stringify(data),
  });

  // Success response is "Group updated successfully"
  return parseResponse<string>(res);
}

export async function deleteGroup(groupId: string): Promise<void> {
  const res = await fetch(`api/groups/${groupId}`, {
    credentials: 'include',
    method: 'DELETE',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Unknown error');
  }

  // 204 No Content
}

export async function joinGroup(groupId: string): Promise<void> {
  const res = await fetch(`api/groups/${groupId}/members`, {
    credentials: 'include',
    method: 'POST',
  });

  // 200 OK with no body
  return parseResponse<void>(res);
}

export async function leaveGroup(groupId: string): Promise<void> {
  const res = await fetch(`api/groups/${groupId}/members`, {
    credentials: 'include',
    method: 'DELETE',
  });

  // 204 No Content
  return parseResponse<void>(res);
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  const res = await fetch(`api/groups/${groupId}/members`, {
    credentials: 'include',
    method: 'GET',
  });

  return parseResponse<GroupMember[]>(res);
}

export async function getJoinedGroups(userId: string): Promise<Group[]> {
  const res = await fetch(`api/users/${userId}/groups`, {
    credentials: 'include',
    method: 'GET',
  });

  return parseResponse<Group[]>(res);
}

export async function getOwnedGroups(userId: string): Promise<Group[]> {
  const res = await fetch(`api/users/${userId}/owned`, {
    credentials: 'include',
    method: 'GET',
  });

  return parseResponse<Group[]>(res);
}