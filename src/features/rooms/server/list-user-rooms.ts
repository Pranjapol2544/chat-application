import type { RoomSummary } from "@/features/rooms/types/room-summary";
import { prisma } from "@/server/db/prisma";

export const listUserRooms = async (userId: string): Promise<RoomSummary[]> => {
  const rooms = await prisma.room.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    orderBy: [
      { lastMessageAt: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      _count: {
        select: {
          members: true,
          messages: true,
        },
      },
    },
  });

  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    memberCount: room._count.members,
    messageCount: room._count.messages,
    lastMessageAt: room.lastMessageAt?.toISOString() ?? null,
  }));
};
