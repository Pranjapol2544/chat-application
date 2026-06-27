import type { Server as HttpServer } from 'node:http';

import type { Server as SocketIOServer } from 'socket.io';

import type { ClientToServerEvents, ServerToClientEvents } from '@/server/sockets/socket-types';
import { getRoomChannel } from '@/server/sockets/socket-types';
import type { RoomMessage } from '@/features/messages/types/room-message';

type ChatSocketServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

declare global {
  var __CHAT_HTTP_SERVER__: HttpServer | undefined;
  var __CHAT_IO__: ChatSocketServer | undefined;
}

export const emitMessageCreated = (roomId: string, message: RoomMessage) => {
  globalThis.__CHAT_IO__?.to(getRoomChannel(roomId)).emit('message:created', message);
};
