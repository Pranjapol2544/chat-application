import { RoomSidebar } from '@/features/rooms/components/room-sidebar';
import { listJoinableRooms } from '@/features/rooms/server/list-joinable-rooms';
import { listUserRooms } from '@/features/rooms/server/list-user-rooms';
import { getRequiredSession } from '@/server/auth/session';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getRequiredSession();
  const [userRooms, availableRooms] = await Promise.all([
    listUserRooms(session.user.id),
    listJoinableRooms(session.user.id),
  ]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <RoomSidebar
          availableRooms={availableRooms}
          userRooms={userRooms}
          username={session.user.username}
        />
        <main className="min-h-[70vh]">{children}</main>
      </div>
    </div>
  );
}
