'use client';

import Button, { ButtonVariant } from '@/components/Button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
};

export default function NotificationSettings({ onClose }: Props) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [displayPopups, setDisplayPopups] = useState(false);

  const { t } = useTranslation(['preferences', 'common']);

  return (
    <div className="flex flex-col space-y-6 max-h-[70vh] bg-primary-bg text-primary">
      {/* Sound toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
          />
          <span>{t('notifications.activateSoundsLabel')}</span>
        </label>
      </div>

      {/* Chat notifications toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={chatNotifications}
            onChange={() => setChatNotifications(!chatNotifications)}
          />
          <span>{t('notifications.notificationsForChats')}</span>
        </label>
      </div>

      {/* Pop-up toggle */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={displayPopups}
            onChange={() => setDisplayPopups(!displayPopups)}
          />
          <span>{t('notifications.showPopupNotifications')}</span>
        </label>
      </div>

      {/* Cancel button */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={t('common:button.cancel')} type={ButtonVariant.Ghost} onClick={onClose} />
      </div>
    </div>
  );
}
