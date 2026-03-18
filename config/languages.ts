/** Supported languages — add new entries here only. No other file changes needed. */
export const SUPPORTED_LANGUAGES = {
  en: { label: 'EN',   name: 'English',            flag: '🇺🇸' },
  zh: { label: '中文', name: 'Simplified Chinese',  flag: '🇨🇳' },
  ja: { label: '日本語', name: 'Japanese',           flag: '🇯🇵' },
} as const;

export type Language = keyof typeof SUPPORTED_LANGUAGES;
