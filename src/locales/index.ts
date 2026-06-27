import { en } from '@/locales/en';
import { th } from '@/locales/th';

export const DEFAULT_LOCALE = 'en';

export const messagesByLocale = {
  en,
  th,
} as const;

export type Locale = keyof typeof messagesByLocale;
export type MessageKey = keyof typeof en;

export const getMessages = (locale: Locale = DEFAULT_LOCALE) => {
  return messagesByLocale[locale];
};

export const t = (key: MessageKey, locale: Locale = DEFAULT_LOCALE) => {
  return messagesByLocale[locale][key];
};
