'use client';

import React, { useState, useEffect, useCallback } from 'react';

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

  // Memoized submit handler to avoid ESLint warning
  const handleSubmit = useCallback(() => {
    try {
      console.log({ name, avatarUrl, selectedModules, availability });
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
        onSaved(); // closes parent modal
      }, 800);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 500);
    }
  }, [name, avatarUrl, selectedModules, availability, onSaved]);

  useEffect(() => {
    if (shouldSave) {
      handleSubmit();
    }
  }, [shouldSave, handleSubmit]);

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

  return (
    <div className="flex flex-col max-h-[70vh] bg-background text-foreground">
      {/* Scrollable content */}
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">
        {/* Name input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-background text-foreground"
          />
        </div>

        {/* Avatar input and preview */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Profilbild-URL</label>
          <input
            type="text"
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-background text-foreground"
          />
          <img
            src={avatarUrl}
            alt="Vorschau"
            className="mt-2 w-24 h-24 rounded-full border object-cover"
          />
        </div>

        {/* Module selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Modulpräferenzen</label>
          <select
            multiple
            value={selectedModules}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(option => option.value);
              setSelectedModules(selected);
            }}
            className="w-full border rounded-md px-4 py-2 h-40 bg-background text-foreground"
          >
            {availableModules.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted mt-1">
            Halte <strong>Strg</strong> (Windows) oder <strong>Cmd</strong> (Mac), um mehrere Module auszuwählen.
          </p>
        </div>

        {/* Availability inputs */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Verfügbarkeit (Wochentage & Zeiten)</label>
          <div className="space-y-2">
            {weekdays.map(day => (
              <div key={day} className="flex items-center gap-4">
                {/* Day name and checkbox */}
                <div className="w-[150px] flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={availability[day]?.active || false}
                    onChange={() => toggleDay(day)}
                  />
                  <span>{day}</span>
                </div>

                {/* Time input fields */}
                {availability[day]?.active && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={availability[day]?.from || ''}
                      onChange={(e) => updateTime(day, 'from', e.target.value)}
                      className="border rounded px-2 py-1 w-[100px] bg-background text-foreground"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={availability[day]?.to || ''}
                      onChange={(e) => updateTime(day, 'to', e.target.value)}
                      className="border rounded px-2 py-1 w-[100px] bg-background text-foreground"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky action buttons */}
      <div className="border-t pt-4 mt-4 flex justify-between bg-background sticky bottom-0">
        <button
          onClick={onClose}
          className="bg-gray-300 text-foreground px-6 py-2 rounded-xl hover:bg-gray-400 transition"
        >
          Schliessen
        </button>
        <button
          onClick={handleSubmit}
          className="btn btn-save"
        >
          Speichern
        </button>
      </div>

      {/* Status feedback */}
      {status === 'success' && (
        <div className="text-green-600 mt-2">Änderungen erfolgreich gespeichert!</div>
      )}
      {status === 'error' && (
        <div className="text-red-600 mt-2">Fehler beim Speichern. Bitte erneut versuchen.</div>
      )}
    </div>
  );
}
