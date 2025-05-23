'use client';

import React, { useEffect, useState } from 'react';
import Button, { ButtonVariant } from '@/components/Button';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
};

export default function AppearanceSettings({ onClose }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const { t } = useTranslation(['preferences', 'common']);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = storedTheme ?? (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  const applyTheme = (mode: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
  };

  const handleThemeChange = (mode: 'light' | 'dark') => {
    setTheme(mode);
    applyTheme(mode);
  };

  return (
    <div className="flex flex-col max-h-[70vh] bg-primary-bg text-primary">
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">
        {/* Theme selection */}
        <div>
          <label className="block text-primary mb-1">{t('appearance.themeLabel')}</label>
          <select
            value={theme}
            onChange={e => handleThemeChange(e.target.value as 'light' | 'dark')}
            className="w-full border rounded-md px-4 py-2 bg-primary-bg text-primary"
          >
            <option value="light">{t('appearance.theme.light')}</option>
            <option value="dark">{t('appearance.theme.dark')}</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={t('common:button.cancel')} type={ButtonVariant.Ghost} onClick={onClose} />
      </div>
    </div>
  );
}
