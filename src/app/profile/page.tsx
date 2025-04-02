'use client';

import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import WIPSection from "@/components/WIPSection";

const availableModules = ['SWEN 2', 'Computertechnik 2', 'Physics Engines', 'Betriebssysteme', 'Cloud Computing','Lineare Algebra','Theoretische Informatik','Datenbanken','Programmieren 1'];
const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

export default function ProfilePage() {
    const [name, setName] = useState('Max Mustermann');
    const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150?img=3');
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [availability, setAvailability] = useState<{ [key: string]: boolean }>({});
    const [status, setStatus] = useState<'success' | 'error' | null>(null);

    const toggleAvailability = (day: string) => {
        setAvailability(prev => ({
            ...prev,
            [day]: !prev[day],
        }));
    };

    const handleSubmit = () => {
        try {
            // API-Call
            console.log({
                name,
                avatarUrl,
                selectedModules,
                availability,
            });

            setStatus('success');
            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            setStatus('error');
            setTimeout(() => setStatus(null), 3000);
        }
    };

    return (
        <main className="p-6">
            <PageHeader title="Profil bearbeiten" />

            <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 border border-gray-200 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border rounded-md px-4 py-2"
                    />
                </div>

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
                        alt="Vorschau"
                        className="mt-2 w-24 h-24 rounded-full border object-cover"
                    />
                </div>

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
                        Halte <strong>Strg</strong> (Windows) oder <strong>Cmd</strong> (Mac), um mehrere Module auszuwählen.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verfügbarkeit</label>
                    <div className="flex flex-wrap gap-4">
                        {weekdays.map(day => (
                            <label key={day} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={!!availability[day]}
                                    onChange={() => toggleAvailability(day)}
                                />
                                <span>{day}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
                >
                    Speichern
                </button>

                {status === 'success' && (
                    <div className="text-green-600 mt-2">Änderungen erfolgreich gespeichert!</div>
                )}
                {status === 'error' && (
                    <div className="text-red-600 mt-2">Fehler beim Speichern. Bitte erneut versuchen.</div>
                )}
            </div>

            <WIPSection />
        </main>
    );
}
