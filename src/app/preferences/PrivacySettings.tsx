'use client';

import Button, { ButtonVariant } from '@/components/Button';
import { showToast, ToastType } from '@/components/Toast';
import React, { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function PrivacySettings({ onClose }: Props) {
  // Placeholder settings
  const [cameraAccess, setCameraAccess] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const handleSave = () => {
    showToast(ToastType.Success, "Success", "Successfully saved the changes.");
  };

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
          <span>Kamerazugriff erlauben</span>
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
          <span>Bitte nicht stören (Do Not Disturb)</span>
        </label>
      </div>

      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={"Schliessen"} type={ButtonVariant.Ghost} onClick={onClose} />
        <Button text={"Speichern"} type={ButtonVariant.Primary} onClick={handleSave} />
      </div>
    </div>
  );
}
