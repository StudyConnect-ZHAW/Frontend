'use client';

import { useState } from 'react';
import Button, { ButtonVariant } from '@/components/Button';
import { useTranslation } from 'react-i18next';
import { showToast, ToastType } from '@/components/Toast';
import { GroupCreateData } from '@/types/group';

type GroupFormInput = Omit<GroupCreateData, 'ownerId'>;

interface Props {
  onClose: () => void;
  onCreate: (data: GroupFormInput) => void;
}

export default function CreateGroupModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { t } = useTranslation(['groups', 'common']);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      showToast(ToastType.Error, t('common:toast.titleError'), t('errorRequiredFields'));
      return;
    }

    onCreate({ name: trimmedName, description: trimmedDescription });
    onClose();
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

        <h2 className="text-lg font-semibold mb-4">{t('titleCreate')}</h2>

        <div className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder={t('placeholderName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder={t('placeholderDescription')}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            text={t('common:button.create')}
            type={ButtonVariant.Primary}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}