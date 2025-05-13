'use client';

import React from 'react';
import Button, { ButtonVariant } from '@/components/Button';
import { redirect } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
};

export default function AccountSettings({ onClose }: Props) {
  const { t } = useTranslation(['preferences', 'common'])

  const handleLogout = () => {
    redirect('/auth/logout');
  };

  return (
    <div className="flex flex-col max-h-[70vh] bg-primary-bg text-primary">
      <div className="flex justify-start bg-primary-bg sticky bottom-0">
        <Button text={`${t('common:button.logout')}`} type={ButtonVariant.Danger} onClick={handleLogout} />
      </div>

      <div className="border-t pt-4 mt-4 flex justify-start bg-primary-bg sticky bottom-0">
        <Button text={`${t('common:button.cancel')}`} type={ButtonVariant.Ghost} onClick={onClose} />
      </div>
    </div>
  );
}
