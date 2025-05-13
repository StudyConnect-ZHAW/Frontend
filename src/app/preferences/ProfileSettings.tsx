'use client';

import Button, { ButtonVariant } from '@/components/Button';
import { showToast, ToastType } from '@/components/Toast';
import React, { useState } from 'react';
import Image from "next/image";
import { useTranslation } from 'react-i18next';

// TODO: Fetch modules (categories) from the API
const availableModules = [
  'SWEN 2', 'Computertechnik 1', 'Computertechnik 2', 'Physics Engines',
  'Betriebssysteme', 'Cloud Computing', 'Lineare Algebra', 'Theoretische Informatik',
  'Datenbanken', 'Programmieren 1', 'Programmieren 2',
];

type Availability = {
  [day: string]: {
    active: boolean;
    from?: string;
    to?: string;
  };
};

type Props = {
  onClose: () => void;
};

export default function ProfileSettings({ onClose }: Props) {
  const [name, setName] = useState('Max Mustermann');
  const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150?img=3');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>({});

  const { t } = useTranslation(['preferences', 'common']);

  const weekdays = [
    `${t('common:weekday.monday')}`,
    `${t('common:weekday.tuesday')}`,
    `${t('common:weekday.wednesday')}`,
    `${t('common:weekday.thursday')}`,
    `${t('common:weekday.friday')}`,
    `${t('common:weekday.saturday')}`,
    `${t('common:weekday.sunday')}`,
  ];

  const handleSave = () => {
    showToast(ToastType.Success, t('common:toast.titleSuccess'), t('common:toast.saveSuccess'));
  };

  const toggleDay = (day: string) =>
    setAvailability(prev => ({
      ...prev,
      [day]: {
        active: !prev[day]?.active,
        from: prev[day]?.from || '08:00',
        to: prev[day]?.to || '17:00',
      },
    }));

  const updateTime = (
    day: string,
    type: 'from' | 'to',
    value: string,
  ) =>
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));

  return (
    <div className="flex flex-col max-h-[70vh] bg-primary-bg text-primary">
      {/* Scrollable content */}
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('profile.nameLabel')}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-primary-bg"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('profile.profilePictureLabel')}</label>
          <input
            type="text"
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-primary-bg"
          />
          <Image
            src={avatarUrl}
            alt="Vorschau"
            width={96}
            height={96}
            className="mt-2 w-24 h-24 rounded-full border object-cover"
          />
        </div>

        {/* Module */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('profile.modulePreferencesLabel')}
          </label>
          <select
            multiple
            value={selectedModules}
            onChange={e =>
              setSelectedModules(
                Array.from(e.target.selectedOptions).map(o => o.value),
              )
            }
            className="w-full border rounded-md px-4 py-2 h-40 bg-primary-bg"
          >
            {availableModules.map(mod => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted mt-1">
            {t('profile.modulePreferencesInfo')}
          </p>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('profile.availabilityLabel')}
          </label>
          <div className="space-y-2">
            {weekdays.map(day => (
              <div key={day} className="flex items-center gap-4">
                {/* Checkbox */}
                <div className="w-[150px] flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={availability[day]?.active || false}
                    onChange={() => toggleDay(day)}
                  />
                  <span>{day}</span>
                </div>

                {/* Time fields */}
                {availability[day]?.active && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={availability[day]?.from || ''}
                      onChange={e => updateTime(day, 'from', e.target.value)}
                      className="border rounded px-2 py-1 w-[100px] bg-primary-bg"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={availability[day]?.to || ''}
                      onChange={e => updateTime(day, 'to', e.target.value)}
                      className="border rounded px-2 py-1 w-[100px] bg-primary-bg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4 flex justify-between bg-primary-bg sticky bottom-0">
        <Button text={`${t('common:button.cancel')}`} type={ButtonVariant.Ghost} onClick={onClose} />
        <Button text={`${t('common:button.save')}`} type={ButtonVariant.Primary} onClick={handleSave} />
      </div>
    </div>
  );
}
