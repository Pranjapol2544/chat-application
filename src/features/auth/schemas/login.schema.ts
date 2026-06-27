import { z } from 'zod';

import { t } from '@/locales';

export const loginSchema = z.object({
  email: z.string().email(t('auth.validation.emailInvalid')),
  password: z.string().min(8, t('auth.validation.passwordMin')),
});

export type LoginInput = z.infer<typeof loginSchema>;
