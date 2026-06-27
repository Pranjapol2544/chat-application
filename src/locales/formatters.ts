import { DEFAULT_LOCALE, type Locale } from '@/locales';

export const formatMemberCount = (count: number, locale: Locale = DEFAULT_LOCALE) => {
  if (locale === 'th') {
    return `${count} สมาชิก`;
  }

  return `${count} member${count === 1 ? '' : 's'}`;
};

export const formatMessageCount = (count: number, locale: Locale = DEFAULT_LOCALE) => {
  if (locale === 'th') {
    return `${count} ข้อความ`;
  }

  return `${count} msg${count === 1 ? '' : 's'}`;
};

export const formatChatTime = (value: string, locale: Locale = DEFAULT_LOCALE) => {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};
