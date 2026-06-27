"use server";

import { revalidatePath } from "next/cache";

import {
  sendMessageSchema,
  type SendMessageInput,
} from "@/features/messages/schemas/send-message.schema";
import type { RoomMessage } from "@/features/messages/types/room-message";
import { getRequiredSession } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { emitMessageCreated } from "@/server/sockets/socket-server";

export interface SendMessageResult {
  status: "error" | "success";
  message?: string;
  payload?: RoomMessage;
}

export const sendMessage = async (
  input: SendMessageInput,
): Promise<SendMessageResult> => {
  const session = await getRequiredSession();
  const result = sendMessageSchema.safeParse(input);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues[0]?.message ?? "Invalid message payload.",
    };
  }

  const membership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId: result.data.roomId,
        userId: session.user.id,
      },
    },
  });

  if (!membership) {
    return {
      status: "error",
      message: "You are not a member of this room.",
    };
  }

  const message = await prisma.$transaction(async (transaction) => {
    const createdMessage = await transaction.message.create({
      data: {
        roomId: result.data.roomId,
        senderId: session.user.id,
        content: result.data.content,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    await transaction.room.update({
      where: {
        id: result.data.roomId,
      },
      data: {
        lastMessageAt: createdMessage.createdAt,
      },
    });

    return createdMessage;
  });

  const payload: RoomMessage = {
    id: message.id,
    roomId: message.roomId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    sender: {
      id: message.sender.id,
      username: message.sender.username,
    },
  };

  emitMessageCreated(result.data.roomId, payload);
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${result.data.roomId}`);

  return {
    status: "success",
    payload,
  };
};
