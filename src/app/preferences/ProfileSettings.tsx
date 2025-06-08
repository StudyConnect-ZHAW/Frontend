"use client";

import Button, { ButtonVariant } from "@/components/Button";
import { showToast, ToastType } from "@/components/Toast";
import Image from "next/image";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Category } from "@/types/category";

/**
 * Component to manage and update user profile settings.
 *
 * Allows the user to update:
 *  • first name, last name & ZHAW e-mail address
 *
 * Displays:
 *  • profile picture
 *  • preferred modules
 *  • weekly availability
 * (not yet updateable – will be added in a future issue)
 *
 * Uses current user data and props from parent.
 */

type Availability = {
  [day: string]: { active: boolean; from?: string; to?: string };
};

type Field = "firstName" | "lastName" | "email";
type Errors = Record<Field, string>;

type Props = {
  onClose: () => void;
  categories: Category[];
  loadingCats: boolean;
  catsError?: string | null;
};

export default function ProfileSettings({
  onClose,
  categories,
  loadingCats,
  catsError,
}: Props) {
  // local state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/default_image.jpg");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>({});
  const [errors, setErrors] = useState<Errors>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Snapshot after last successful save → used to detect if form is dirty
  const baseline = useRef({
    firstName: "",
    lastName: "",
    email: "",
    modules: [] as string[],
  });

  // Keep track of the latest toast so we can replace it instead of stacking
  const lastToastId = useRef<string | undefined>(undefined);

  // hooks & i18n
  const { t } = useTranslation(["preferences", "common"]);
  const { user, update } = useCurrentUser();

  // populate inputs when user loads
  useEffect(() => {
    if (!user) {
      return;
    }
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);

    // Initialize baseline on first load
    if (!baseline.current.firstName) {
      baseline.current = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        modules: [],
      };
    }
  }, [user]);

  const weekdays = [
    t("common:weekday.monday"),
    t("common:weekday.tuesday"),
    t("common:weekday.wednesday"),
    t("common:weekday.thursday"),
    t("common:weekday.friday"),
    t("common:weekday.saturday"),
    t("common:weekday.sunday"),
  ];

  const toggleDay = (day: string) =>
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        active: !prev[day]?.active,
        from: prev[day]?.from ?? "08:00",
        to: prev[day]?.to ?? "17:00",
      },
    }));

  const updateTime = (day: string, type: "from" | "to", value: string) =>
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));

  const requiredMsg = t("preferences:errors.required");

  const validateRequired = (key: Field, value: string) => {
    setErrors((prev) => ({
      ...prev,
      [key]: value.trim() === "" ? requiredMsg : "",
    }));
  };

  // Starts at the beginning of handleSave
  const validateForm = () => {
    const draft: Errors = {
      firstName: firstName.trim() === "" ? requiredMsg : "",
      lastName: lastName.trim() === "" ? requiredMsg : "",
      email: email.trim() === "" ? requiredMsg : "",
    };

    setErrors(draft);

    return Object.values(draft).every((msg) => msg === "");
  };

  // avatar
  const handleEditPicture = () => fileInputRef.current?.click();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  // save
  const handleSave = async () => {
    if (!user) {
      return;
    }

    if (!validateForm()) {
      return;
    }
    // Detect changes (dirty state)
    const isDirty =
      firstName !== baseline.current.firstName ||
      lastName !== baseline.current.lastName ||
      email !== baseline.current.email ||
      selectedModules.length !== baseline.current.modules.length ||
      !selectedModules.every((id) => baseline.current.modules.includes(id));

    if (!isDirty) {
      return;
    }

    // Validate email
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showToast(
        ToastType.Error,
        t("common:toast.titleError"),
        t("preferences:toast.invalidEmail")
      );

      return;
    }

    try {
      await update({
        firstName,
        lastName,
        email: trimmedEmail,
      });

      // Update baseline
      baseline.current = {
        firstName,
        lastName,
        email: trimmedEmail,
        modules: [...selectedModules],
      };

      lastToastId.current = showToast(
        ToastType.Success,
        t("common:toast.titleSuccess"),
        t("common:toast.saveSuccess")
      ) as unknown as string;
    } catch (err) {
      console.error("Update failed:", err);
      showToast(ToastType.Error, t("common:toast.titleError"), "Update failed");
    }
  };

  // loading / error UI
  if (loadingCats) {
    return <p className="p-8">{t("common:loading")}</p>;
  }
  if (catsError) {
    return <p className="p-8 text-red-500">{catsError}</p>;
  }

  return (
    <div className="flex flex-col h-[85vh] dark:primary-bg dark:text-primary rounded-2xl overflow-hidden shadow-lg">
      <div className="overflow-y-auto pt-2 px-8 pb-8 space-y-6 flex-1">
        {/* Profile Picture, Name & Email Setting Field */}
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
              {errors.firstName && (
                <p className="text-red-500 text-sm -mt-1 mb-1">
                  {errors.firstName}
                </p>
              )}
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={(e) => validateRequired("firstName", e.target.value)}
                className={`
                w-full border-2 rounded-lg px-4 py-3 dark:bg-primary-bg text-base
                ${
                  errors.firstName
                    ? "border-red-500 focus:border-red-500"
                    : "border-main"
                }
                `}
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">
                {t("profile.lastNameLabel")}
              </label>
              {errors.lastName && (
                <p className="text-red-500 text-sm -mt-1 mb-1">
                  {errors.lastName}
                </p>
              )}
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={(e) => validateRequired("lastName", e.target.value)}
                className={`
                w-full border-2 rounded-lg px-4 py-3 dark:bg-primary-bg text-base
                ${
                  errors.lastName
                    ? "border-red-500 focus:border-red-500"
                    : "border-main"
                }
                `}
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">
                {t("profile.emailLabel")}
              </label>
              {errors.email && (
                <p className="text-red-500 text-sm -mt-1 mb-1">
                  {errors.email}
                </p>
              )}
              <input
                type="email"
                value={email}
                placeholder="user@students.zhaw.ch"
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateRequired("email", e.target.value); // sofortiges Feedback
                }}
                onBlur={(e) => validateRequired("email", e.target.value)} // Fallback
                className={`w-full border-2 rounded-lg px-4 py-3 dark:bg-primary-bg text-base ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-main"
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            <p className="text-xs text-secondary">
              {t("preferences:account.calendarInfoText")}
            </p>
          </div>
        </div>

        {/* Module Preferences Field*/}
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
                      : "bg-white dark:bg-gray-800 text-black" +
                        "dark:text-white border-yellow-400 dark:border-red-600 hover:bg-yellow-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[var(--color-secondary)] mt-2">
            {t("profile.modulePreferencesInfo")}
          </p>
        </div>

        {/* Availability Setting Field*/}
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
