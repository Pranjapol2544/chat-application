"use client";

import { io, type Socket } from "socket.io-client";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/server/sockets/socket-types";

let socket:
  | Socket<ServerToClientEvents, ClientToServerEvents>
  | undefined;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      path: "/api/socket/io",
      autoConnect: false,
    });
  }

  return socket;
};
