import type { commonEn } from '@/locales/common/en';
import type { LocaleMessages } from '@/locales/types';

export const commonTh: LocaleMessages<typeof commonEn> = {
  'common.app.name': 'Room Chat',
  'common.metadata.title': 'Room Chat MVP',
  'common.metadata.description': 'ระบบแชตห้องแบบ MVP ด้วย Next.js, Prisma, Auth.js และ Socket.IO',
} as const;
