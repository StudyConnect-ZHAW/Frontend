export interface Group {
  groupId: string;
  ownerId: string;
  name: string;
  description: string;
  createdAt: string;
  members?: GroupMember[];
}

export interface GroupMember {
  memberId: string; // userId
  groupId: string;
  joinedAt: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface GroupCreateData {
  name: string;
  description: string;
}

export interface GroupUpdateData {
  name: string;
  description: string;
}