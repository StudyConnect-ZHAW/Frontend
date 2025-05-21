'use client';

import React, { useState } from 'react';
import Button, { ButtonVariant } from '@/components/Button';
import { showToast, ToastType } from '@/components/Toast';
import { redirect } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
};

export default function AccountSettings({ onClose }: Props) {
  const { t } = useTranslation(['preferences', 'common']);
  const [zhawEmail, setZhawEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    redirect('/auth/logout');
  };

  const handleEmailUpdate = async () => {
    if (!zhawEmail.endsWith('@students.zhaw.ch')) {
      showToast(ToastType.Error, t('common:toast.titleError'), 'Only @students.zhaw.ch emails are supported.');
      
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}v1/users/{123}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Sumaya',
          lastName: 'Mohat',
          email: zhawEmail,
        }),
      });

      if (!res.ok) {throw new Error();}

      showToast(ToastType.Success, t('common:toast.titleSuccess'), 'Email updated successfully!');
    } catch (error) {
      showToast(ToastType.Error, t('common:toast.titleError'), 'Failed to update email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh] bg-primary-bg text-primary p-4">

      {/* Info Text */}
      <p className="text-sm text-secondary mb-2">
        {t('common:calendarInfoText')}
      </p>

      {/* Email Field */}
      <input
        type="email"
        value={zhawEmail}
        onChange={(e) => setZhawEmail(e.target.value)}
        placeholder="user@students.zhaw.ch"
        className="w-full border rounded-md px-4 py-2 bg-primary-bg mb-2"
      />

      {/* Update Button */}
      <div className="flex justify-end sticky bottom-0 bg-primary-bg pt-4">
        <Button
          text={loading ? 'Updating...' : t('common:button.update')}
          type={ButtonVariant.Primary}
          onClick={handleEmailUpdate}
          disabled={loading}
        />
      </div>

      {/* Footer Buttons */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={t('common:button.cancel')} type={ButtonVariant.Ghost} onClick={onClose} />
        <Button text={t('common:button.logout')} type={ButtonVariant.Danger} onClick={handleLogout} />
      </div>
    </div>
  );
}
