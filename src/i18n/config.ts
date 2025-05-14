export const supportedLanguages = ['de-CH', 'en-GB'] as const;

export const fallbackLanguage = 'de-CH';

export const languageOptions: { code: string; label: string }[] = [
  { code: 'de-CH', label: 'Deutsch' },
  { code: 'en-GB', label: 'English' },
];

export const normalizeLanguage = (lang: string | null): string => {
  if (!lang) return fallbackLanguage;
  if (lang.startsWith('de')) return 'de-CH';
  if (lang.startsWith('en')) return 'en-GB';
  return fallbackLanguage;
};