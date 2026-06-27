'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { loginSchema, type LoginInput } from '@/features/auth/schemas/login.schema';
import { cn } from '@/lib/cn';
import { t } from '@/locales';

interface LoginFormProps {
  registered?: boolean;
}

export const LoginForm = (props: LoginFormProps) => {
  const { registered = false } = props;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginInput) => {
    setRootError('');

    startTransition(async () => {
      const response = await signIn('credentials', {
        ...values,
        redirect: false,
      });

      if (!response?.ok) {
        setRootError(t('auth.login.errorInvalidCredentials'));
        return;
      }

      router.push('/rooms');
      router.refresh();
    });
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-950/5">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-700">
          {t('common.app.name')}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {t('auth.login.title')}
        </h1>
        <p className="text-sm leading-6 text-zinc-600">{t('auth.login.description')}</p>
      </div>

      {registered ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {t('auth.login.successRegistered')}
        </div>
      ) : null}

      {rootError ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {rootError}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-800">{t('auth.login.emailLabel')}</span>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className={cn(
              'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950',
              errors.email ? 'border-rose-300' : 'border-zinc-200',
            )}
            placeholder={t('auth.login.emailPlaceholder')}
          />
          {errors.email ? (
            <span className="text-xs text-rose-600">{errors.email.message}</span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-800">{t('auth.login.passwordLabel')}</span>
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            className={cn(
              'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950',
              errors.password ? 'border-rose-300' : 'border-zinc-200',
            )}
            placeholder={t('auth.login.passwordPlaceholder')}
          />
          {errors.password ? (
            <span className="text-xs text-rose-600">{errors.password.message}</span>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? t('auth.login.submitting') : t('auth.login.submit')}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-600">
        {t('auth.login.registerPrompt')}{' '}
        <Link className="font-semibold text-zinc-950" href="/register">
          {t('auth.login.registerLink')}
        </Link>
      </p>
    </div>
  );
};
