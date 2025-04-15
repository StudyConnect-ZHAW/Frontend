'use client';

import React, { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function AccountSettings({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const handleAddAccount = () => {
    console.log('Account hinzugefügt mit Email:', email);
    setStatus('success');
    setTimeout(() => {
      setStatus(null);
      onClose();
    }, 1000);
  };

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
      setTimeout(() => setStatus(null), 500);
    }
  };

  return (
    <div className="flex flex-col space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Add Account */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Neuer Account (E-Mail)</label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded-md px-4 py-2"
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddAccount}
        >
          Account hinzufügen
        </button>
      </div>

      {/* Delete Account */}
      <div className="border-t pt-4">
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
      <div className="border-t pt-4 mt-4 flex justify-end bg-white sticky bottom-0">
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-6 py-2 rounded-xl hover:bg-gray-400 transition"
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
