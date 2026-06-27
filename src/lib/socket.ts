'use client';

import { io, type Socket } from 'socket.io-client';

import type { ClientToServerEvents, ServerToClientEvents } from '@/server/sockets/socket-types';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;

export const getSocket = (authToken?: string) => {
  if (!socket) {
    socket = io({
      path: '/api/socket/io',
      autoConnect: false,
      withCredentials: true,
      auth: authToken
        ? {
            token: authToken,
          }
        : undefined,
    });
  } else if (authToken) {
    socket.auth = {
      token: authToken,
    };
  }

  return socket;
};
