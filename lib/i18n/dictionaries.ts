import 'server-only';
import type { Locale } from './types';

const dictionaries = {
  en: () => import('@/public/locales/en/common.json').then((module) => module.default),
  es: () => import('@/public/locales/es/common.json').then((module) => module.default),
  zh: () => import('@/public/locales/zh/common.json').then((module) => module.default),
  hi: () => import('@/public/locales/hi/common.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

