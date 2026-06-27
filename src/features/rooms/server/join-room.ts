'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getRequiredSession } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

export interface JoinRoomInput {
  roomId: string;
}

export interface JoinRoomResult {
  status: 'error';
  message: string;
}

export const joinRoom = async ({ roomId }: JoinRoomInput): Promise<JoinRoomResult | never> => {
  const session = await getRequiredSession();

  if (!roomId) {
    return {
      status: 'error',
      message: 'Select a valid room.',
    };
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    return {
      status: 'error',
      message: 'Room not found.',
    };
  }

  const existingMembership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId: session.user.id,
      },
    },
  });

  if (!existingMembership) {
    await prisma.roomMember.create({
      data: {
        roomId,
        userId: session.user.id,
      },
    });
  }

  revalidatePath('/rooms');
  redirect(`/rooms/${roomId}`);
};
