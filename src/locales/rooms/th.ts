import type { roomsEn } from '@/locales/rooms/en';
import type { LocaleMessages } from '@/locales/types';

export const roomsTh: LocaleMessages<typeof roomsEn> = {
  'rooms.page.eyebrow': 'Room Chat',
  'rooms.page.emptyTitle': 'คุณพร้อมเริ่มห้องแรกแล้ว',
  'rooms.page.emptyDescription': 'ใช้แถบด้านข้างเพื่อสร้างห้องหรือเข้าร่วมห้องที่มีอยู่แล้ว',
  'rooms.page.emptyAction': 'เลือกห้องจากรายการหรือสร้างห้องใหม่เพื่อเริ่มต้นได้เลย',
  'rooms.sidebar.signedInAs': 'ลงชื่อเข้าใช้เป็น',
  'rooms.sidebar.yourRooms': 'ห้องของคุณ',
  'rooms.sidebar.availableRooms': 'ห้องที่เข้าร่วมได้',
  'rooms.sidebar.emptyUserRooms': 'สร้างห้องใหม่หรือเข้าร่วมห้องจากรายการด้านล่างได้เลย',
  'rooms.sidebar.emptyAvailableRooms': 'คุณเข้าร่วมห้องที่มีอยู่ทั้งหมดแล้ว',
  'rooms.create.label': 'สร้างห้อง',
  'rooms.create.placeholder': 'อัปเดตสินค้า',
  'rooms.create.submit': 'สร้างห้อง',
  'rooms.create.submitting': 'กำลังสร้าง...',
  'rooms.join.submit': 'เข้าร่วม',
  'rooms.join.submitting': 'กำลังเข้าร่วม...',
  'rooms.validation.nameMin': 'ชื่อห้องต้องมีอย่างน้อย 2 ตัวอักษร',
  'rooms.validation.nameMax': 'ชื่อห้องต้องมีไม่เกิน 50 ตัวอักษร',
  'rooms.errors.invalidRoomDetails': 'ข้อมูลห้องไม่ถูกต้อง',
  'rooms.errors.roomExists': 'มีห้องชื่อนี้อยู่แล้ว',
  'rooms.notFound.title': 'ไม่พบห้อง',
  'rooms.notFound.description': 'ห้องนี้อาจถูกลบไปแล้ว หรือคุณอาจยังไม่ได้เป็นสมาชิก',
  'rooms.notFound.backToRooms': 'กลับไปหน้าห้อง',
} as const;
