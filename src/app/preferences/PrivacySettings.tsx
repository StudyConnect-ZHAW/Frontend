'use client';

import Button, { ButtonVariant } from '@/components/Button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
};

export default function PrivacySettings({ onClose }: Props) {
  // Placeholder settings
  const [cameraAccess, setCameraAccess] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const { t } = useTranslation(['preferences', 'common']);

  return (
    <div className="flex flex-col space-y-6 max-h-[70vh] bg-primary-bg text-primary">
      {/* Camera access toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={cameraAccess}
            onChange={() => setCameraAccess(!cameraAccess)}
          />
          <span>{t('privacy.allowCameraLabel')}</span>
        </label>
      </div>

      {/* Do not disturb toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={doNotDisturb}
            onChange={() => setDoNotDisturb(!doNotDisturb)}
          />
          <span>{t('privacy.doNotDisturbLabel')}</span>
        </label>
      </div>

      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={`${t('common:button.cancel')}`} type={ButtonVariant.Ghost} onClick={onClose} />
      </div>
    </div>
  );
}
