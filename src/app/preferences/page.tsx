"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

import ProfileSettings from "./ProfileSettings";
import GeneralSettings from "./GeneralSettings";
import AppearanceSettings from "./AppearanceSettings";
import AccountSettings from "./AccountSettings";
import PrivacySettings from "./PrivacySettings";
import NotificationsSettings from "./NotificationSettings";

import PageHeader from "@/components/PageHeader";
import { useTranslation } from "react-i18next";
import { useForumCategories } from "@/hooks/useForumCategories";

export default function SettingsPage() {
  // local UI state
  const [selectedBlock, setSelectedBlock] = useState<null | string>(null);

  // data: categories are fetched once here and passed down as props 
  const {
    categories,
    loading: loadingCats,
    error: catsError,
  } = useForumCategories();

  // i18n
  const { t } = useTranslation(["preferences", "common"]);

  const settingsBlocks = [
    {
      id: "general",
      title: t("general.title"),
      description: t("general.subtitle"),
    },
    {
      id: "appearance",
      title: t("appearance.title"),
      description: t("appearance.subtitle"),
    },
    {
      id: "privacy",
      title: t("privacy.title"),
      description: t("privacy.subtitle"),
    },
    {
      id: "notifications",
      title: t("notifications.title"),
      description: t("notifications.subtitle"),
    },
    {
      id: "account",
      title: t("account.title"),
      description: t("account.subtitle"),
    },
    {
      id: "profile",
      title: t("profile.title"),
      description: t("profile.subtitle"),
    },
  ];

  return (
    <main className="min-h-full flex flex-col">
      <PageHeader title={t("title")} />

      {/* Tiles */}
      <div className="bg-primary-bg grid grid-cols-2 gap-6 border-main p-6 rounded-xl flex-grow border-2">
        {settingsBlocks.map((block) => (
          <button
            key={block.id}
            onClick={() => setSelectedBlock(block.id)}
            className="text-left p-4 rounded-xl border-2 transition-colors bg-primary-bg border-main cursor-pointer"
          >
            <h3 className="text-xl font-semibold">{block.title}</h3>
            <p className="text-primary mt-1">{block.description}</p>
          </button>
        ))}
      </div>

      {/* Modal */}
      <Dialog
        open={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-hidden">
          <Dialog.Panel className="bg-primary-bg p-6 w-full max-w-4xl shadow-lg border-main rounded-2xl h-auto">
            <Dialog.Title className="text-xl font-bold mb-4">
              {settingsBlocks.find((b) => b.id === selectedBlock)?.title}
            </Dialog.Title>

            {selectedBlock === "profile" && (
              <ProfileSettings
                onClose={() => setSelectedBlock(null)}
                categories={categories}
                loadingCats={loadingCats}
                catsError={catsError}
              />
            )}
            {selectedBlock === "general" && (
              <GeneralSettings onClose={() => setSelectedBlock(null)} />
            )}
            {selectedBlock === "appearance" && (
              <AppearanceSettings onClose={() => setSelectedBlock(null)} />
            )}
            {selectedBlock === "account" && (
              <AccountSettings onClose={() => setSelectedBlock(null)} />
            )}
            {selectedBlock === "privacy" && (
              <PrivacySettings onClose={() => setSelectedBlock(null)} />
            )}
            {selectedBlock === "notifications" && (
              <NotificationsSettings onClose={() => setSelectedBlock(null)} />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </main>
  );
}
