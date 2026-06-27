import { z } from 'zod';

import { t } from '@/locales';

export const sendMessageSchema = z.object({
  roomId: z.string().min(1, t('messages.validation.roomIdRequired')),
  content: z
    .string()
    .trim()
    .min(1, t('messages.validation.contentRequired'))
    .max(500, t('messages.validation.contentMax')),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
