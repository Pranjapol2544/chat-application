import Link from 'next/link';

import { LogoutButton } from '@/features/auth/components/logout-button';
import { CreateRoomForm } from '@/features/rooms/components/create-room-form';
import { JoinRoomButton } from '@/features/rooms/components/join-room-button';
import type { AvailableRoom } from '@/features/rooms/types/available-room';
import type { RoomSummary } from '@/features/rooms/types/room-summary';
import { formatMemberCount, formatMessageCount } from '@/locales/formatters';
import { t } from '@/locales';

interface RoomSidebarProps {
  availableRooms: AvailableRoom[];
  userRooms: RoomSummary[];
  username: string;
}

export const RoomSidebar = (props: RoomSidebarProps) => {
  const { availableRooms, userRooms, username } = props;
  return (
    <aside className="flex h-full w-full flex-col gap-6 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-950/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t('rooms.sidebar.signedInAs')}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">{username}</h2>
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
                className="block rounded-2xl border border-zinc-200 px-4 py-3 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-zinc-900">{room.name}</span>
                  <span className="text-xs text-zinc-500">
                    {formatMessageCount(room.messageCount)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{formatMemberCount(room.memberCount)}</p>
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
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-zinc-900">{room.name}</p>
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
