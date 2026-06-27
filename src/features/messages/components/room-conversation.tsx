'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import {
  sendMessageSchema,
  type SendMessageInput,
} from '@/features/messages/schemas/send-message.schema';
import { sendMessage } from '@/features/messages/server/send-message';
import type { RoomMessage } from '@/features/messages/types/room-message';
import { cn } from '@/lib/cn';
import { getSocket } from '@/lib/socket';
import { t } from '@/locales';
import { formatChatTime } from '@/locales/formatters';

interface RoomConversationProps {
  currentUserId: string;
  initialMessages: RoomMessage[];
  roomId: string;
  roomName: string;
}

const upsertMessages = (messages: RoomMessage[], nextMessage: RoomMessage) => {
  const exists = messages.some((message) => message.id === nextMessage.id);

  if (exists) {
    return messages;
  }

  return [...messages, nextMessage];
};

export const RoomConversation = (props: RoomConversationProps) => {
  const { currentUserId, initialMessages, roomId, roomName } = props;
  const [messages, setMessages] = useState(initialMessages);
  const [rootError, setRootError] = useState('');
  const [isPending, startTransition] = useTransition();
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const socket = useMemo(() => getSocket(), []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMessageInput>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      roomId,
      content: '',
    },
  });

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.connect();

    socket.emit('room:join', { roomId });

    const handleMessageCreated = (message: RoomMessage) => {
      if (message.roomId !== roomId) {
        return;
      }

      setMessages((currentMessages) => upsertMessages(currentMessages, message));
    };

    socket.on('message:created', handleMessageCreated);

    return () => {
      socket.emit('room:leave', { roomId });
      socket.off('message:created', handleMessageCreated);
    };
  }, [roomId, socket]);

  const onSubmit = (values: SendMessageInput) => {
    setRootError('');

    startTransition(async () => {
      const response = await sendMessage(values);

      if (response.status === 'error') {
        setRootError(response.message ?? t('messages.errors.sendFailed'));
        return;
      }

      if (response.payload) {
        setMessages((currentMessages) => upsertMessages(currentMessages, response.payload!));
      }

      reset({ roomId, content: '' });
    });
  };

  return (
    <section className="flex h-full flex-col rounded-[2rem] border border-zinc-200 bg-white shadow-sm shadow-zinc-950/5">
      <header className="border-b border-zinc-200 px-8 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {t('messages.room.eyebrow')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">{roomName}</h1>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6 md:px-8">
        {messages.length ? (
          messages.map((message) => {
            const isCurrentUser = message.sender.id === currentUserId;

            return (
              <article
                key={message.id}
                className={cn('flex', isCurrentUser ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-xl rounded-3xl px-4 py-3 shadow-sm',
                    isCurrentUser
                      ? 'bg-zinc-950 text-white'
                      : 'border border-zinc-200 bg-zinc-50 text-zinc-950',
                  )}
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium opacity-80">
                    <span>{message.sender.username}</span>
                    <span>•</span>
                    <span>{formatChatTime(message.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                </div>
              </article>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-16 text-center text-sm leading-6 text-zinc-500">
            {t('messages.emptyState')}
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="border-t border-zinc-200 px-6 py-5 md:px-8">
        {rootError ? (
          <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {rootError}
          </div>
        ) : null}

        <form
          className="flex flex-col gap-3 md:flex-row md:items-end"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input {...register('roomId')} type="hidden" value={roomId} />
          <label className="flex-1 space-y-2">
            <span className="text-sm font-medium text-zinc-700">
              {t('messages.composer.label')}
            </span>
            <textarea
              {...register('content')}
              rows={3}
              className={cn(
                'w-full resize-none rounded-3xl border bg-white px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition focus:border-zinc-950',
                errors.content ? 'border-rose-300' : 'border-zinc-200',
              )}
              placeholder={t('messages.composer.placeholder')}
            />
            {errors.content ? (
              <span className="text-xs text-rose-600">{errors.content.message}</span>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-3xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? t('messages.composer.submitting') : t('messages.composer.submit')}
          </button>
        </form>
      </div>
    </section>
  );
};
