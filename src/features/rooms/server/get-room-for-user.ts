import { prisma } from "@/server/db/prisma";

export const getRoomForUser = async (userId: string, roomId: string) => {
  return prisma.room.findFirst({
    where: {
      id: roomId,
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
};
