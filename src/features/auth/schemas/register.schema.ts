import { z } from 'zod';

import { t } from '@/locales';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, t('auth.validation.usernameMin'))
    .max(32, t('auth.validation.usernameMax'))
    .regex(/^[a-zA-Z0-9_]+$/, t('auth.validation.usernamePattern')),
  email: z.string().email(t('auth.validation.emailInvalid')),
  password: z
    .string()
    .min(8, t('auth.validation.passwordMin'))
    .max(72, t('auth.validation.passwordMax')),
});

export type RegisterInput = z.infer<typeof registerSchema>;
