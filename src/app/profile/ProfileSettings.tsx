'use client';

import React, { useState, useEffect } from 'react';

const availableModules = [
  'SWEN 2', 'Computertechnik 1', 'Computertechnik 2', 'Physics Engines',
  'Betriebssysteme', 'Cloud Computing', 'Lineare Algebra', 'Theoretische Informatik',
  'Datenbanken', 'Programmieren 1', 'Programmieren 2'
];

const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

type Availability = {
  [day: string]: {
    active: boolean;
    from?: string;
    to?: string;
  };
};

type Props = {
  onClose: () => void;
  shouldSave: boolean;
  onSaved: () => void;
};

export default function ProfileSettings({ onClose, shouldSave, onSaved }: Props) {
  const [name, setName] = useState('Max Mustermann');
  const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150?img=3');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>({});
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  // Listen for external save trigger
  useEffect(() => {
    if (shouldSave) {
      handleSubmit();
    }
  }, [shouldSave]);

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        active: !prev[day]?.active,
        from: prev[day]?.from || '08:00',
        to: prev[day]?.to || '17:00',
      }
    }));
  };

  const updateTime = (day: string, type: 'from' | 'to', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      }
    }));
  };

  // Handles saving and calls onSaved after
  const handleSubmit = () => {
    try {
      console.log({ name, avatarUrl, selectedModules, availability });
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
        onSaved(); // triggers close from outside
      }, 1000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh]">
      {/* Scrollable content */}
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">
        {/* Name input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          />
        </div>

        {/* Avatar URL input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profilbild-URL</label>
          <input
            type="text"
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          />
          <img
            src={avatarUrl}
            alt="Preview"
            className="mt-2 w-24 h-24 rounded-full border object-cover"
          />
        </div>

        {/* Module preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modulpräferenzen</label>
          <select
            multiple
            value={selectedModules}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(option => option.value);
              setSelectedModules(selected);
            }}
            className="w-full border rounded-md px-4 py-2 h-40"
          >
            {availableModules.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Hold <strong>Ctrl</strong> (Windows) or <strong>Cmd</strong> (Mac) to select multiple.
          </p>
        </div>

        {/* Weekly availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability (Days & Times)</label>
          <div className="space-y-2">
            {weekdays.map(day => (
              <div key={day} className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={availability[day]?.active || false}
                    onChange={() => toggleDay(day)}
                  />
                  <span>{day}</span>
                </label>
                {availability[day]?.active && (
                  <>
                    <input
                      type="time"
                      value={availability[day]?.from || ''}
                      onChange={(e) => updateTime(day, 'from', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={availability[day]?.to || ''}
                      onChange={(e) => updateTime(day, 'to', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed button bar */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-white sticky bottom-0">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Schliessen
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
        >
          Speichern
        </button>
      </div>

      {/* Status message */}
      {status === 'success' && (
        <div className="text-green-600 mt-2">Änderungen erfolgreich gespeichert!</div>
      )}
      {status === 'error' && (
        <div className="text-red-600 mt-2">Fehler beim Speichern. Bitte erneut versuchen.</div>
      )}
    </div>
  );
}
