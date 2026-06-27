import { AppShell } from '@/features/rooms/components/app-shell';
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
    <AppShell
      availableRooms={availableRooms}
      userRooms={userRooms}
      username={session.user.username}
    >
      {children}
    </AppShell>
  );
}
