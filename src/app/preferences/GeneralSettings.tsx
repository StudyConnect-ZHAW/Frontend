'use client';

import Button, { ButtonVariant } from '@/components/Button';
import { languageOptions } from '@/i18n/config';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
};

export default function GeneralSettings({ onClose }: Props) {
  const { t, i18n } = useTranslation(['preferences', 'common']);
  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
    await i18n.changeLanguage(lang);
  };

  return (
    <div className="flex flex-col max-h-[70vh] bg-primary-bg text-primary">
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">
        {/* Language Selector */}
        <div>
          <label className="block text-primary mb-1">{`${t('general.languageLabel')}`}</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-primary-bg text-primary"
          >
            {languageOptions.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={`${t('common:button.cancel')}`} type={ButtonVariant.Ghost} onClick={onClose} />
      </div>
    </div>
  );
}
