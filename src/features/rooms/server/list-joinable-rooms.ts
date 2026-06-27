import type { AvailableRoom } from '@/features/rooms/types/available-room';
import { prisma } from '@/server/db/prisma';

export const listJoinableRooms = async (userId: string): Promise<AvailableRoom[]> => {
  const rooms = await prisma.room.findMany({
    where: {
      NOT: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    memberCount: room._count.members,
  }));
};
