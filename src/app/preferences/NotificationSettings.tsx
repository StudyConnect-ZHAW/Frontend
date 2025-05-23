'use client';

import Button, { ButtonVariant } from '@/components/Button';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
};

export default function NotificationSettings({ onClose }: Props) {

  const { t } = useTranslation(['preferences', 'common']);

  return (
    <div className="flex flex-col space-y-6 max-h-[70vh] bg-primary-bg text-primary">

      {/* Cancel button */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={t('common:button.cancel')} type={ButtonVariant.Ghost} onClick={onClose} />
      </div>
    </div>
  );
}
