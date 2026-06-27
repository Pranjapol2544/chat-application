import type { RoomMessage } from '@/features/messages/types/room-message';

export interface SocketAck {
  ok: boolean;
  message?: string;
}

export interface RoomSocketPayload {
  roomId: string;
}

export interface PublishMessageSocketPayload {
  messageId: string;
  roomId: string;
}

export interface ServerToClientEvents {
  'message:created': (message: RoomMessage) => void;
}

export interface ClientToServerEvents {
  'room:join': (payload: RoomSocketPayload, ack?: (response: SocketAck) => void) => void;
  'room:leave': (payload: RoomSocketPayload, ack?: (response: SocketAck) => void) => void;
  'message:publish': (
    payload: PublishMessageSocketPayload,
    ack?: (response: SocketAck) => void,
  ) => void;
}

export const getRoomChannel = (roomId: string) => {
  return `room:${roomId}`;
};
