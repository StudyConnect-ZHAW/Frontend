'use client';

import Button, { ButtonVariant } from '@/components/Button';
import { showToast, ToastType } from '@/components/Toast';
import React, { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function NotificationSettings({ onClose }: Props) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [displayPopups, setDisplayPopups] = useState(false);

  const handleSave = () => {
    showToast(ToastType.Success, "Success", "Successfully saved the changes.");
  };

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
          <span>Sounds aktivieren</span>
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
          <span>Benachrichtigungen für Chats</span>
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
          <span>Pop-up Hinweise anzeigen</span>
        </label>
      </div>

      {/* Bottom button bar */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={"Schliessen"} type={ButtonVariant.Ghost} onClick={onClose} />
        <Button text={"Speichern"} type={ButtonVariant.Primary} onClick={handleSave} />
      </div>
    </div>
  );
}
