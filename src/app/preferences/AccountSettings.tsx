'use client';

import React, { useState } from 'react';
import Button, { ButtonVariant } from '@/components/Button';
import { showToast, ToastType } from '@/components/Toast';
import { redirect } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getCurrentUser, updateUser } from '@/lib/handlers/userHandler';
import { User } from '@/types/user';

type Props = {
  onClose: () => void;
};

export default function AccountSettings({ onClose }: Props) {
  const { t } = useTranslation(['preferences', 'common']);
  const [zhawEmail, setZhawEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Handles logout by redirecting to the logout route
  const handleLogout = () => {
    redirect('/auth/logout');
  };

  // Handles the email update logic including loading state and toast feedback
  const handleEmailUpdate = async () => {
    const trimmedEmail = zhawEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValidEmail) {
      showToast(ToastType.Error, t('common:toast.titleError'), t('preferences:toast.invalidEmail'));

      return;
    }

    setLoading(true);

    try {
      const currentUser = await getCurrentUser();

      const updatedUser: User = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: trimmedEmail,
      };

      await updateUser(updatedUser);

      showToast(ToastType.Success, t('common:toast.titleSuccess'), t('preferences:toast.emailSuccess'));
    } catch (err) {
      console.error('Failed to update email.', err);
      showToast(ToastType.Error, t('common:toast.titleError'), t('preferences:toast.emailError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh] bg-primary-bg text-primary p-4">

      {/* Info Text */}
      <p className="text-sm text-secondary mb-2">
        {t('preferences:account.calendarInfoText')}
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
          text={loading ? t('common:button.update') : t('common:button.update')}
          type={ButtonVariant.Primary}
          onClick={handleEmailUpdate}
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
