'use client';

import Button, { ButtonVariant } from '@/components/Button';
import { showToast, ToastType } from '@/components/Toast';
import React, { useState, useEffect } from 'react';

type Props = {
  onClose: () => void;
  onSave: () => void;
};

export default function GeneralSettings({ onClose, onSave }: Props) {
  const [language, setLanguage] = useState('de'); // TODO: Don't reset to hardcoded state, use localStorage

  // TODO: Either define the save behavior here, or trigger the onSave callback - not both!
  const handleSave = () => {
    showToast(ToastType.Success, "Success", "Successfully saved the changes.");
  };

  return (
    <div className="flex flex-col max-h-[70vh] bg-primary-bg text-primary">
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">
        {/* Language Selector */}
        <div>
          <label className="block text-primary mb-1">Sprache</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-primary-bg text-primary"
          >
            <option value="de">Deutsch</option>
            <option value="en">Englisch</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={"Schliessen"} type={ButtonVariant.Ghost} onClick={onClose} />
        <Button text={"Speichern"} type={ButtonVariant.Primary} onClick={handleSave} />
      </div>
    </div>
  );
}
