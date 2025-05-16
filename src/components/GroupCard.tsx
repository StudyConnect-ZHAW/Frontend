import React from 'react';
import type { Group } from '@/types/group';

interface Props {
  group: Group;
}

export default function GroupCard({ group }: Props) {
  return (
    <div className="border-main rounded-lg shadow p-4 bg-primary-bg cursor-pointer">
      <h3 className="text-lg font-semibold text-primary mb-1">{group.name}</h3>
      <p className="text-sm text-secondary mb-1">{`Owner: ${group.ownerId}`}</p>
      <p className="text-sm text-secondary mb-1">{group.description}</p>
    </div>
  );
}