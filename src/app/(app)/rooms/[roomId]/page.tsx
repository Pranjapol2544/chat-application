import { notFound } from 'next/navigation';

import { RoomConversation } from '@/features/messages/components/room-conversation';
import { listRoomMessages } from '@/features/messages/server/list-room-messages';
import { getRoomForUser } from '@/features/rooms/server/get-room-for-user';
import { createSocketToken } from '@/server/auth/socket-token';
import { getRequiredSession } from '@/server/auth/session';

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const session = await getRequiredSession();
  const { roomId } = await params;
  const room = await getRoomForUser(session.user.id, roomId);

  if (!room) {
    notFound();
  }

  const messages = await listRoomMessages(room.id);
  const socketAuthToken = await createSocketToken({
    userId: session.user.id,
    username: session.user.username,
  });

  return (
    <RoomConversation
      currentUserId={session.user.id}
      initialMessages={messages}
      roomId={room.id}
      roomName={room.name}
      socketAuthToken={socketAuthToken}
    />
  );
}
