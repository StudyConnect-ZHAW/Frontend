'use client';

import { createGroup } from '@/lib/api/groups';
import { useState } from 'react';
import Button, { ButtonVariant } from '@/components/Button';

interface Props {
  onClose: () => void;
}

export default function CreateGroupModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      await createGroup({
        name: name.trim(),
        description: description.trim(),
        ownerId: '12',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-primary-bg shadow-lg p-6 w-full max-w-md relative border-main rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-white cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Create New Group</h2>

        <div className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Group description (optional)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            text={loading ? 'Creating…' : 'Create Group'}
            type={ButtonVariant.Primary}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}