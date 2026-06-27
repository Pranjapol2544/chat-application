import { z } from 'zod';

import { t } from '@/locales';

export const createRoomSchema = z.object({
  name: z.string().min(2, t('rooms.validation.nameMin')).max(50, t('rooms.validation.nameMax')),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
