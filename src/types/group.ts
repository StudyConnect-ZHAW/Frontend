import { User } from "@/types/user";

/**
 * Represents an individual group.
 * Note that members must be fetched separately.
 */
export interface Group {
  groupId: string;
  name: string;
  description: string;
  createdAt: string;
  owner: User;
  members?: GroupMember[];
}

/**
 * Represents an individual member of the group.
 */
export interface GroupMember {
  groupId: string;
  joinedAt: string;
  member: User;
}

/**
 * Payload for creating a new group in the backend.
 */
export interface GroupCreateData {
  name: string;
  description: string;
}

/**
 * Payload for updating an existing group in the backend.
 */
export interface GroupUpdateData {
  name: string;
  description: string;
}