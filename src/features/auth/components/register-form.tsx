'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { registerSchema, type RegisterInput } from '@/features/auth/schemas/register.schema';
import { registerUser, type RegisterActionResult } from '@/features/auth/server/register-user';
import { cn } from '@/lib/cn';

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: RegisterInput) => {
    setRootError('');

    startTransition(async () => {
      const response = (await registerUser(values)) as RegisterActionResult | undefined;

      if (response?.status === 'error') {
        setRootError(response.message);
      }
    });
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-950/5">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-blue-700">Room Chat</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Create your account</h1>
        <p className="text-sm leading-6 text-zinc-600">
          Start with a simple username, email, and password.
        </p>
      </div>

      {rootError ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {rootError}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-800">Username</span>
          <input
            {...register('username')}
            type="text"
            autoComplete="username"
            className={cn(
              'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950',
              errors.username ? 'border-rose-300' : 'border-zinc-200',
            )}
            placeholder="alice"
          />
          {errors.username ? (
            <span className="text-xs text-rose-600">{errors.username.message}</span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-800">Email</span>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className={cn(
              'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950',
              errors.email ? 'border-rose-300' : 'border-zinc-200',
            )}
            placeholder="alice@example.com"
          />
          {errors.email ? (
            <span className="text-xs text-rose-600">{errors.email.message}</span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-800">Password</span>
          <input
            {...register('password')}
            type="password"
            autoComplete="new-password"
            className={cn(
              'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950',
              errors.password ? 'border-rose-300' : 'border-zinc-200',
            )}
            placeholder="Choose a strong password"
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
          {isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-600">
        Already have an account?{' '}
        <Link className="font-semibold text-zinc-950" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
};
