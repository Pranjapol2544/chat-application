'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogoutButton } from '@/features/auth/components/logout-button';
import { CreateRoomForm } from '@/features/rooms/components/create-room-form';
import { JoinRoomButton } from '@/features/rooms/components/join-room-button';
import type { AvailableRoom } from '@/features/rooms/types/available-room';
import type { RoomSummary } from '@/features/rooms/types/room-summary';
import { cn } from '@/lib/cn';
import { formatMemberCount, formatMessageCount } from '@/locales/formatters';
import { t } from '@/locales';

interface RoomSidebarProps {
  availableRooms: AvailableRoom[];
  userRooms: RoomSummary[];
  username: string;
}

export const RoomSidebar = (props: RoomSidebarProps) => {
  const { availableRooms, userRooms, username } = props;
  const pathname = usePathname();

  return (
    <aside className="flex min-h-[calc(100dvh-1.5rem)] w-full flex-col gap-6 rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 sm:min-h-[calc(100dvh-2rem)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t('rooms.sidebar.signedInAs')}
          </p>
          <h2 className="mt-2 truncate text-xl font-semibold tracking-tight text-zinc-950">
            {username}
          </h2>
        </div>
        <LogoutButton />
      </div>

      <CreateRoomForm />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">{t('rooms.sidebar.yourRooms')}</h3>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
            {userRooms.length}
          </span>
        </div>

        <div className="space-y-2">
          {userRooms.length ? (
            userRooms.map((room) => (
              <Link
                key={room.id}
                href={`/rooms/${room.id}`}
                aria-current={pathname === `/rooms/${room.id}` ? 'page' : undefined}
                className={cn(
                  'block rounded-2xl border px-4 py-3 transition',
                  pathname === `/rooms/${room.id}`
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      'min-w-0 break-words text-sm font-medium sm:text-base',
                      pathname === `/rooms/${room.id}` ? 'text-white' : 'text-zinc-900',
                    )}
                  >
                    {room.name}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-xs',
                      pathname === `/rooms/${room.id}` ? 'text-zinc-200' : 'text-zinc-500',
                    )}
                  >
                    {formatMessageCount(room.messageCount)}
                  </span>
                </div>
                <p
                  className={cn(
                    'mt-1 text-xs',
                    pathname === `/rooms/${room.id}` ? 'text-zinc-300' : 'text-zinc-500',
                  )}
                >
                  {formatMemberCount(room.memberCount)}
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-500">
              {t('rooms.sidebar.emptyUserRooms')}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">
            {t('rooms.sidebar.availableRooms')}
          </h3>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {availableRooms.length}
          </span>
        </div>

        <div className="space-y-3">
          {availableRooms.length ? (
            availableRooms.map((room) => (
              <div key={room.id} className="rounded-2xl border border-zinc-200 px-4 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="break-words font-medium text-zinc-900">{room.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatMemberCount(room.memberCount)}
                    </p>
                  </div>
                  <JoinRoomButton roomId={room.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-500">
              {t('rooms.sidebar.emptyAvailableRooms')}
            </div>
          )}
        </div>
      </section>
    </aside>
  );
};
