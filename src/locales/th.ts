import type { en } from '@/locales/en';
import { authTh } from '@/locales/auth/th';
import { commonTh } from '@/locales/common/th';
import { messagesTh } from '@/locales/messages/th';
import { roomsTh } from '@/locales/rooms/th';
import type { LocaleMessages } from '@/locales/types';

export const th: LocaleMessages<typeof en> = {
  ...commonTh,
  ...authTh,
  ...roomsTh,
  ...messagesTh,
} as const;
