'use client';

import { useState, useTransition } from 'react';

import { joinRoom, type JoinRoomResult } from '@/features/rooms/server/join-room';

interface JoinRoomButtonProps {
  roomId: string;
}

export const JoinRoomButton = (props: JoinRoomButtonProps) => {
  const { roomId } = props;
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoinRoom = () => {
    setErrorMessage('');

    startTransition(async () => {
      const response = (await joinRoom({ roomId })) as JoinRoomResult | undefined;

      if (response?.status === 'error') {
        setErrorMessage(response.message);
      }
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={handleJoinRoom}
        className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Joining...' : 'Join'}
      </button>
      {errorMessage ? <p className="text-xs text-rose-600">{errorMessage}</p> : null}
    </div>
  );
};
