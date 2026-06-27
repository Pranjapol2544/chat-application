import { createServer } from 'node:http';

import next from 'next';
import { PrismaClient } from '@prisma/client';
import { decode, getToken } from 'next-auth/jwt';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const isSocketDebugEnabled = process.env.CHAT_SOCKET_DEBUG === 'true';

const app = next({
  dev,
  hostname,
  port,
  webpack: true,
});
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

const getRoomChannel = (roomId) => `room:${roomId}`;
const SOCKET_TOKEN_SALT = 'chat-app-socket';
const logSocket = (...args) => {
  if (dev && isSocketDebugEnabled) {
    console.log('[socket]', ...args);
  }
};

const verifySocketToken = async (token) => {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is required to verify socket tokens.');
  }

  return decode({
    token,
    secret: process.env.NEXTAUTH_SECRET,
    salt: SOCKET_TOKEN_SALT,
  });
};

await app.prepare();

const httpServer = createServer((req, res) => {
  handle(req, res);
});

const io = new Server(httpServer, {
  path: '/api/socket/io',
  cors: {
    origin: process.env.NEXTAUTH_URL ?? true,
    credentials: true,
  },
});

globalThis.__CHAT_IO__ = io;
let isShuttingDown = false;

io.on('connection', async (socket) => {
  const handshakeToken =
    socket.handshake.auth &&
    typeof socket.handshake.auth.token === 'string' &&
    socket.handshake.auth.token.length > 0
      ? socket.handshake.auth.token
      : null;
  const token = handshakeToken
    ? await verifySocketToken(handshakeToken)
    : await getToken({
        req: socket.request,
        secret: process.env.NEXTAUTH_SECRET,
      });

  const userId =
    typeof token?.sub === 'string' ? token.sub : typeof token?.id === 'string' ? token.id : null;

  if (!userId) {
    logSocket('disconnect unauthenticated socket', socket.id);
    socket.disconnect(true);
    return;
  }

  socket.data.userId = userId;
  logSocket('connected', { socketId: socket.id, userId });

  socket.on('room:join', async (payload, ack) => {
    const roomId = payload && typeof payload.roomId === 'string' ? payload.roomId : null;

    if (!roomId) {
      logSocket('join rejected invalid payload', { socketId: socket.id, userId, payload });
      ack?.({ ok: false, message: 'Invalid room request.' });
      return;
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    if (!membership) {
      logSocket('join rejected missing membership', { socketId: socket.id, userId, roomId });
      ack?.({ ok: false, message: 'You are not a member of this room.' });
      return;
    }

    socket.join(getRoomChannel(roomId));
    const roomSize = io.sockets.adapter.rooms.get(getRoomChannel(roomId))?.size ?? 0;
    logSocket('joined room', { socketId: socket.id, userId, roomId, roomSize });
    ack?.({ ok: true });
  });

  socket.on('room:leave', (payload, ack) => {
    const roomId = payload && typeof payload.roomId === 'string' ? payload.roomId : null;

    if (!roomId) {
      logSocket('leave rejected invalid payload', { socketId: socket.id, userId, payload });
      ack?.({ ok: false, message: 'Invalid room request.' });
      return;
    }

    socket.leave(getRoomChannel(roomId));
    const roomSize = io.sockets.adapter.rooms.get(getRoomChannel(roomId))?.size ?? 0;
    logSocket('left room', { socketId: socket.id, userId, roomId, roomSize });
    ack?.({ ok: true });
  });

  socket.on('message:publish', async (payload, ack) => {
    const roomId = payload && typeof payload.roomId === 'string' ? payload.roomId : null;
    const messageId = payload && typeof payload.messageId === 'string' ? payload.messageId : null;

    if (!roomId || !messageId) {
      logSocket('publish rejected invalid payload', { socketId: socket.id, userId, payload });
      ack?.({ ok: false, message: 'Invalid message request.' });
      return;
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    if (!membership) {
      logSocket('publish rejected missing membership', { socketId: socket.id, userId, roomId });
      ack?.({ ok: false, message: 'You are not a member of this room.' });
      return;
    }

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
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

    if (!message || message.roomId !== roomId || message.senderId !== userId) {
      logSocket('publish rejected message mismatch', {
        socketId: socket.id,
        userId,
        roomId,
        messageId,
      });
      ack?.({ ok: false, message: 'Message could not be published.' });
      return;
    }

    const roomSize = io.sockets.adapter.rooms.get(getRoomChannel(roomId))?.size ?? 0;
    logSocket('broadcasting message', {
      socketId: socket.id,
      userId,
      roomId,
      messageId,
      roomSize,
    });

    io.to(getRoomChannel(roomId)).emit('message:created', {
      id: message.id,
      roomId: message.roomId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      sender: {
        id: message.sender.id,
        username: message.sender.username,
      },
    });

    ack?.({ ok: true });
  });

  socket.on('disconnect', (reason) => {
    logSocket('disconnected', { socketId: socket.id, userId, reason });
  });
});

httpServer.listen(port, hostname, () => {
  console.log(`> Ready on http://${hostname}:${port}`);
});

const closeServer = async () => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  await prisma.$disconnect();
  io.close();
  httpServer.close(() => {
    process.exit(0);
  });
};

process.once('SIGINT', closeServer);
process.once('SIGTERM', closeServer);
