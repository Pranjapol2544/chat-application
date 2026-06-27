'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import {
  createRoomSchema,
  type CreateRoomInput,
} from '@/features/rooms/schemas/create-room.schema';
import { createRoom, type RoomActionResult } from '@/features/rooms/server/create-room';
import { cn } from '@/lib/cn';

export const CreateRoomForm = () => {
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomInput>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (values: CreateRoomInput) => {
    setRootError('');

    startTransition(async () => {
      const response = (await createRoom(values)) as RoomActionResult | undefined;

      if (response?.status === 'error') {
        setRootError(response.message);
      }
    });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Create room
        </span>
        <input
          {...register('name')}
          type="text"
          className={cn(
            'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950',
            errors.name ? 'border-rose-300' : 'border-zinc-200',
          )}
          placeholder="Product updates"
        />
      </label>
      {errors.name ? <p className="text-xs text-rose-600">{errors.name.message}</p> : null}
      {rootError ? <p className="text-xs text-rose-600">{rootError}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Creating...' : 'Create room'}
      </button>
    </form>
  );
};
