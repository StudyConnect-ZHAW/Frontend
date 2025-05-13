import { useTranslation } from "react-i18next";

/**
 * Component representing the footer displayed at the bottom of the pages.
 */
export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="w-full text-center text-sm text-secondary p-4">
      © {new Date().getFullYear()} StudyConnect | {`${t('copyright')}`}
    </footer>
  );
}