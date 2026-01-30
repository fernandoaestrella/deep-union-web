export type Locale = 'en' | 'es' | 'zh' | 'hi';

export const locales: Locale[] = ['en', 'es', 'zh', 'hi'];
export const defaultLocale: Locale = 'en';

export type Dictionary = {
  [key: string]: string | Dictionary;
};

