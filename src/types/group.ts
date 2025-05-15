export interface Group {
  groupId: string;
  ownerId: string;
  name: string;
  description: string;
}

export interface GroupCreateData {
  ownerId: string;
  name: string;
  description: string;
}

export interface GroupUpdateData {
  name: string;
  description: string;
}