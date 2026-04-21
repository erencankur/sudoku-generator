export type Language = 'tr' | 'en';

export const SUPPORTED_LANGUAGES: Language[] = ['tr', 'en'];
export const DEFAULT_LANGUAGE: Language = 'tr';
export const LANGUAGE_STORAGE_KEY = 'sudoku-generator-language';

export function isLanguage(value: string | null | undefined): value is Language {
  return value === 'tr' || value === 'en';
}
