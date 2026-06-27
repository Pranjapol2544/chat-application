import { authEn } from '@/locales/auth/en';
import { commonEn } from '@/locales/common/en';
import { messagesEn } from '@/locales/messages/en';
import { roomsEn } from '@/locales/rooms/en';

export const en = {
  ...commonEn,
  ...authEn,
  ...roomsEn,
  ...messagesEn,
} as const;
