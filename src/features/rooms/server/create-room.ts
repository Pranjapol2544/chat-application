'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  createRoomSchema,
  type CreateRoomInput,
} from '@/features/rooms/schemas/create-room.schema';
import { getRequiredSession } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

export interface RoomActionResult {
  status: 'error';
  message: string;
}

export const createRoom = async (input: CreateRoomInput): Promise<RoomActionResult | never> => {
  const session = await getRequiredSession();
  const result = createRoomSchema.safeParse(input);

  if (!result.success) {
    return {
      status: 'error',
      message: result.error.issues[0]?.message ?? 'Invalid room details.',
    };
  }

  const existingRoom = await prisma.room.findUnique({
    where: {
      name: result.data.name,
    },
  });

  if (existingRoom) {
    return {
      status: 'error',
      message: 'A room with that name already exists.',
    };
  }

  const room = await prisma.room.create({
    data: {
      name: result.data.name,
      createdById: session.user.id,
      members: {
        create: {
          userId: session.user.id,
        },
      },
    },
  });

  revalidatePath('/rooms');
  redirect(`/rooms/${room.id}`);
};
