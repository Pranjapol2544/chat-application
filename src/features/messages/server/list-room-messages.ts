import type { RoomMessage } from '@/features/messages/types/room-message';
import { prisma } from '@/server/db/prisma';

export const listRoomMessages = async (roomId: string, limit = 50): Promise<RoomMessage[]> => {
  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: 'asc' },
    take: limit,
    include: {
      sender: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return messages.map((message) => ({
    id: message.id,
    roomId: message.roomId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    sender: {
      id: message.sender.id,
      username: message.sender.username,
    },
  }));
};
