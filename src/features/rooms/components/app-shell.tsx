'use client';

import { usePathname } from 'next/navigation';

import { RoomSidebar } from '@/features/rooms/components/room-sidebar';
import type { AvailableRoom } from '@/features/rooms/types/available-room';
import type { RoomSummary } from '@/features/rooms/types/room-summary';
import { cn } from '@/lib/cn';

interface AppShellProps {
  availableRooms: AvailableRoom[];
  children: React.ReactNode;
  userRooms: RoomSummary[];
  username: string;
}

export const AppShell = (props: AppShellProps) => {
  const { availableRooms, children, userRooms, username } = props;
  const pathname = usePathname();
  const isRoomRoute = pathname.startsWith('/rooms/');

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-7xl flex-col gap-3 sm:min-h-[calc(100dvh-2rem)] sm:gap-4 lg:grid lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className={cn(isRoomRoute ? 'hidden lg:block' : 'block')}>
          <RoomSidebar availableRooms={availableRooms} userRooms={userRooms} username={username} />
        </div>
        <main className={cn('min-w-0', isRoomRoute ? 'block' : 'hidden lg:block')}>{children}</main>
      </div>
    </div>
  );
};
