import { Group } from '@/types/group';

export const mockGroups: Group[] = Array.from({ length: 30 }, (_, i) => ({
  groupId: `group-${i + 1}`,
  ownerId: `user-${(i % 3) + 1}`,
  name: `Group ${i + 1}`,
  description: `This is a description for Group ${i + 1}.`,
  members: Array.from({ length: (i % 5) + 1 }, (_, j) => ({
    userId: `user-${j + 1}`,
    name: `User ${j + 1}`,
  })),
  creationDate: new Date(Date.now() - i * 86400000).toISOString(),
}));
