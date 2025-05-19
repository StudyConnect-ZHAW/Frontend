import type { Group, GroupCreateData, GroupUpdateData } from '@/types/group';
import { parseResponse } from '@/lib/api/parseResponse';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}v1`;

function getRequestHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',   // Request body format
    'Accept': 'application/json',         // Response body format
  };
}

export async function createGroup(data: GroupCreateData): Promise<Group> {
  const res = await fetch(`${BASE_URL}/groups`, {
    method: 'POST',
    credentials: 'include',
    headers: getRequestHeaders(),
    body: JSON.stringify(data),
  });

  return parseResponse<Group>(res);
}

export async function getAllGroups(): Promise<Group[]> {
  const res = await fetch(`${BASE_URL}/groups`, {
    method: 'GET',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<Group[]>(res);
}

export async function getOwnGroups(userId: string): Promise<Group[]> {
  const res = await fetch(`${BASE_URL}/users/${userId}/groups`, {
    method: 'GET',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<Group[]>(res);
}

export async function getGroupById(groupId: string): Promise<Group> {
  const res = await fetch(`${BASE_URL}/groups/${groupId}`, {
    method: 'GET',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<Group>(res);
}

export async function joinGroup(groupId: string): Promise<Group> {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/join`, {
    method: 'POST',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<Group>(res);
}

export async function leaveGroup(groupId: string): Promise<Group> {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/leave`, {
    method: 'POST',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  return parseResponse<Group>(res);
}

export async function updateGroup(groupId: string, data: GroupUpdateData): Promise<string> {
  const res = await fetch(`${BASE_URL}/groups/${groupId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: getRequestHeaders(),
    body: JSON.stringify(data),
  });

  // Success response is "Group updated successfully"
  return parseResponse<string>(res);
}

export async function deleteGroup(groupId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/groups/${groupId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getRequestHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Unknown error');
  }

  // 204 No Content
}