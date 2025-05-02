'use client';

import React, { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function AccountSettings({ onClose }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const handleDelete = () => {
    if (confirmDelete) {
      console.log('Account gelöscht');
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
        onClose();
      }, 1000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus(null), 1000);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh] bg-background text-foreground">
      {/* Delete Account */}
        <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={confirmDelete}
            onChange={() => setConfirmDelete(!confirmDelete)}
          />
          <span>Ich bin sicher, dass ich meinen Account löschen möchte</span>
        </label>
        <button
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Account löschen
        </button>
    </div>

      {/* Footer Buttons */}
      <div className="border-t pt-4 mt-4 flex justify-start bg-background sticky bottom-0">
        <button
          onClick={onClose}
          className="button-close"
        >
          Schliessen
        </button>
      </div>

      {/* Status messages */}
      {status === 'success' && (
        <div className="text-green-600 mt-2">Aktion erfolgreich!</div>
      )}
      {status === 'error' && (
        <div className="text-red-600 mt-2">Bitte bestätige das Löschen!</div>
      )}
    </div>
  );
}
