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

/**
 * AccountSettings allows users to update their ZHAW email and log out.
 * The current user's data is retrieved via token-based identification.
 * Input is validated client-side, and feedback is shown via toast messages.
 */
export default function AccountSettings({ onClose }: Props) {
  const { t } = useTranslation(['preferences', 'common']);
  const [zhawEmail, setZhawEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Handles logout by redirecting to the logout route
  const handleLogout = () => {
    redirect('/auth/logout');
  };

  // Updates the user's email after validating the input
  const handleEmailUpdate = async () => {
    const trimmedEmail = zhawEmail.trim();

    // Basic email format check — does not ensure domain or validity
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValidEmail) {
      showToast(ToastType.Error, t('common:toast.titleError'), t('preferences:toast.invalidEmail'));

      return;
    }

    setLoading(true);

    try {
      // Fetch the current user from backend (based on token)
      const currentUser = await getCurrentUser();

      // Only email is being updated — preserve other user data
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

      {/* Info about calendar integration and ZHAW email */}
      <p className="text-sm text-secondary mb-2">
        {t('preferences:account.calendarInfoText')}
      </p>

      {/* Email input field for updating ZHAW email */}
      <input
        type="email"
        value={zhawEmail}
        onChange={(e) => setZhawEmail(e.target.value)}
        placeholder="user@students.zhaw.ch"
        className="w-full border rounded-md px-4 py-2 bg-primary-bg mb-2"
      />

      {/* Button to confirm email update */}
      <div className="flex justify-end sticky bottom-0 bg-primary-bg pt-4">
        <Button
          text={loading ? t('common:button.update') : t('common:button.update')}
          type={ButtonVariant.Primary}
          onClick={handleEmailUpdate}
        />
      </div>

      {/* Cancel and logout actions */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={t('common:button.cancel')} type={ButtonVariant.Ghost} onClick={onClose} />
        <Button text={t('common:button.logout')} type={ButtonVariant.Danger} onClick={handleLogout} />
      </div>
    </div>
  );
}
