"use client";

import React from "react";
import Button, { ButtonVariant } from "@/components/Button";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";

type Props = { onClose: () => void };

/**
 * **AccountSettings**
 *
 * This component now contains **only the logout action**.
 * All profile–related changes (first / last name, e-mail, avatar …) were
 * migrated to **ProfileSettings**.
 */
export default function AccountSettings({ onClose }: Props) {
  const { t } = useTranslation(["preferences", "common"]);

  /** Redirects the user to the API route that destroys the session cookie */
  const handleLogout = () => redirect("/auth/logout");

  return (
    <div className="flex flex-col bg-primary-bg text-primary p-4">
      {/* FYI text about calendar sync (still useful information) */}
      <p className="text-sm text-secondary mb-4">
        {t("preferences:account.calendarInfoText")}
      </p>

      {/* Cancel / Logout actions */}
      <div className="flex justify-between border-t pt-4 mt-4 sticky bottom-0 bg-primary-bg">
        <Button
          text={t("common:button.cancel")}
          type={ButtonVariant.Ghost}
          onClick={onClose}
        />
        <Button
          text={t("common:button.logout")}
          type={ButtonVariant.Danger}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
