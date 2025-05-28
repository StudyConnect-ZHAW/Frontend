"use client";

import Button, { ButtonVariant } from "@/components/Button";
import { showToast, ToastType } from "@/components/Toast";
import Image from "next/image";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useForumCategories } from "@/hooks/useForumCategories";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("https://i.pravatar.cc/250");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const {
    categories,
    loading: loadingCats,
    error: catsError,
  } = useForumCategories();
  const [availability, setAvailability] = useState<Availability>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(["preferences", "common"]);

  const { user, update } = useCurrentUser();

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
  }, [user]);

  const weekdays = [
    `${t("common:weekday.monday")}`,
    `${t("common:weekday.tuesday")}`,
    `${t("common:weekday.wednesday")}`,
    `${t("common:weekday.thursday")}`,
    `${t("common:weekday.friday")}`,
    `${t("common:weekday.saturday")}`,
    `${t("common:weekday.sunday")}`,
  ];

  const toggleDay = (day: string) =>
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        active: !prev[day]?.active,
        from: prev[day]?.from || "08:00",
        to: prev[day]?.to || "17:00",
      },
    }));

  const updateTime = (day: string, type: "from" | "to", value: string) =>
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));

  const handleEditPicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const handleSave = async () => {
    if (!user) return; // Safety
    try {
      await update({ firstName, lastName, email }); // PATCH
      showToast(
        ToastType.Success,
        t("common:toast.titleSuccess"),
        t("common:toast.saveSuccess")
      );
    } catch (err: any) {
      console.error("Update failed:", err);
      showToast(
        ToastType.Error,
        t("common:toast.titleError"),
        err?.message || "Update failed"
      );
    }
  };

  return (
    <div className="flex flex-col h-[85vh] dark:primary-bg dark:text-primary rounded-2xl overflow-hidden shadow-lg">
      <div className="overflow-y-auto p-8 space-y-6 flex-1">
        {/* Profile Picture & Name Row */}
        <div className="flex items-center gap-10 mb-8">
          <div className="flex flex-col items-center">
            <Image
              src={avatarUrl}
              alt="Profilbild"
              width={140}
              height={140}
              className="rounded-full border-4 border-main object-cover"
            />
            <button
              onClick={handleEditPicture}
              className="mt-3 text-base font-bold text-black dark:text-primary hover:underline cursor-pointer"
            >
              {t("Edit")}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <div>
              <label className="block text-base font-semibold mb-1">
                {t("profile.firstNameLabel")}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border-2 border-main rounded-lg px-4 py-3 dark:bg-primary-bg text-base"
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">
                {t("profile.lastNameLabel")}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border-2 border-main rounded-lg px-4 py-3 dark:bg-primary-bg text-base"
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">
                {t("profile.emailLabel")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@students.zhaw.ch"
                className="w-full border-2 border-main rounded-lg px-4 py-3 dark:bg-primary-bg text-base"
              />
            </div>
          </div>
        </div>

        {/* Module Preferences */}
        <div>
          <label className="block text-base font-semibold mb-3">
            {t("profile.modulePreferencesLabel")}
          </label>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              const isSelected = selectedModules.includes(cat.forumCategoryId);
              return (
                <button
                  key={cat.forumCategoryId}
                  type="button"
                  onClick={() =>
                    setSelectedModules((prev) =>
                      isSelected
                        ? prev.filter((id) => id !== cat.forumCategoryId)
                        : [...prev, cat.forumCategoryId]
                    )
                  }
                  className={`px-5 py-2 rounded-full border-2 text-base transition cursor-pointer ${
                    isSelected
                      ? "bg-yellow-400 dark:bg-red-600 text-black dark:text-white border-yellow-400 dark:border-red-600"
                      : "bg-white dark:bg-gray-800 text-black dark:text-white border-yellow-400 dark:border-red-600 hover:bg-yellow-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-[var(--color-secondary)] mt-2">
            {t("profile.modulePreferencesInfo")}
          </p>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-base font-semibold mb-3">
            {t("profile.availabilityLabel")}
          </label>
          <div className="space-y-2">
            {weekdays.map((day) => {
              const isActive = availability[day]?.active || false;
              return (
                <div
                  key={day}
                  className={`p-3 rounded-lg border-2 flex flex-col gap-2 transition
            ${
              isActive
                ? "bg-white dark:bg-gray-800 border-yellow-400 dark:border-red-600"
                : "bg-white dark:bg-gray-800 border-yellow-400 dark:border-red-600"
            }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{day}</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isActive}
                        onChange={() => toggleDay(day)}
                      />
                      <div
                        className={`w-12 h-6 rounded-full transition
                  ${
                    isActive
                      ? "bg-yellow-400 dark:bg-yellow-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  } relative`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full shadow absolute top-0.5 transition
                    bg-white dark:bg-gray-200
                    ${isActive ? "translate-x-6" : "translate-x-0.5"}
                  `}
                        ></div>
                      </div>
                    </label>
                  </div>

                  {isActive && (
                    <div className="flex items-center gap-3 ml-4">
                      <input
                        type="time"
                        value={availability[day]?.from || ""}
                        onChange={(e) =>
                          updateTime(day, "from", e.target.value)
                        }
                        className="border-2 rounded px-3 py-1 w-[100px] bg-white dark:bg-gray-700 text-base cursor-text"
                      />
                      <span>–</span>
                      <input
                        type="time"
                        value={availability[day]?.to || ""}
                        onChange={(e) => updateTime(day, "to", e.target.value)}
                        className="border-2 rounded px-3 py-1 w-[100px] bg-white dark:bg-gray-700 text-base cursor-text"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="border-t-2 border-yellow-400 dark:border-red-600 p-4 flex justify-between bg-white dark:bg-gray-800">
        <Button
          text={t("common:button.cancel")}
          type={ButtonVariant.Ghost}
          onClick={onClose}
        />
        <Button
          text={t("common:button.save")}
          type={ButtonVariant.Primary}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
