import type { messagesEn } from '@/locales/messages/en';
import type { LocaleMessages } from '@/locales/types';

export const messagesTh: LocaleMessages<typeof messagesEn> = {
  'messages.room.eyebrow': 'ห้อง',
  'messages.emptyState': 'ยังไม่มีข้อความ เริ่มห้องนี้ด้วยข้อความแรกได้เลย',
  'messages.composer.label': 'ข้อความ',
  'messages.composer.placeholder': 'พิมพ์ข้อความถึงห้องนี้...',
  'messages.composer.submit': 'ส่งข้อความ',
  'messages.composer.submitting': 'กำลังส่ง...',
  'messages.validation.roomIdRequired': 'จำเป็นต้องมีรหัสห้อง',
  'messages.validation.contentRequired': 'ข้อความต้องไม่ว่าง',
  'messages.validation.contentMax': 'ข้อความต้องมีไม่เกิน 500 ตัวอักษร',
  'messages.errors.sendFailed': 'ไม่สามารถส่งข้อความได้',
} as const;
