export interface Group {
  groupId: string;
  ownerId: string;
  name: string;
  description: string;
  members: {
    userId: string;
    name: string;
  }[];
  creationDate: string;
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