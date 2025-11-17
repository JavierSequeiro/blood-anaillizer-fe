/**
 * Supported Languages Configuration
 * 
 * Add new languages here to make them available throughout the application
 */

export interface Language {
  code: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "ch", name: "Chinese" },
  { code: "fr", name: "French" },
  // Add more languages here as needed
  // { code: "de", name: "German" },
  // { code: "it", name: "Italian" },
  // { code: "pt", name: "Portuguese" },
  // { code: "ja", name: "Japanese" },
  // { code: "ar", name: "Arabic" },
];

export const DEFAULT_LANGUAGE = "en";

/**
 * Get language name from code
 */
export function getLanguageName(code: string): string {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  return language?.name || code;
}

/**
 * Check if language code is valid
 */
export function isValidLanguage(code: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
}
