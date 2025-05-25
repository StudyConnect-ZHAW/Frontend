import React from 'react';
import type { Group } from '@/types/group';
import { useTranslation } from 'react-i18next';
import Button, { ButtonVariant } from './Button';

interface Props {
  group: Group;
  joined: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
}

export default function GroupCard({ group, joined, onJoin, onLeave }: Props) {
  const { t, i18n } = useTranslation(['groups', 'common']);

  const date = new Intl.DateTimeFormat(i18n.language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(group.createdAt));

  return (
    <div className="border-main rounded-lg shadow p-4 bg-primary-bg cursor-pointer relative">
      <div className="absolute top-3 right-3">
        <Button
          text={joined ? t('button.leave') : t('button.join')}
          type={ButtonVariant.Primary}
          onClick={joined ? onLeave ?? (() => { }) : onJoin ?? (() => { })}>
        </Button>
      </div>

      <h3 className="text-lg font-semibold text-primary mb-1">{group.name}</h3>
      <p className="text-sm text-secondary mb-1">{group.description}</p>
      <p className="text-sm text-secondary mb-1">{`${t('card.owner')}: ${group.ownerId}`}</p>
      <p className="text-sm text-secondary mb-1">{`${t('card.members')}: ${group.members?.length ?? 'N/A'}`}</p>
      <p className="text-sm text-secondary mb-1">{`${t('card.createdAt')}: ${date}`}</p>
    </div>
  );
}