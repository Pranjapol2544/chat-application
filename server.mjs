import { createServer } from 'node:http';

import next from 'next';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

const getRoomChannel = (roomId) => `room:${roomId}`;

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

io.on('connection', async (socket) => {
  const token = await getToken({
    req: socket.request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const userId =
    typeof token?.sub === 'string' ? token.sub : typeof token?.id === 'string' ? token.id : null;

  if (!userId) {
    socket.disconnect(true);
    return;
  }

  socket.data.userId = userId;

  socket.on('room:join', async (payload, ack) => {
    const roomId = payload && typeof payload.roomId === 'string' ? payload.roomId : null;

    if (!roomId) {
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
      ack?.({ ok: false, message: 'You are not a member of this room.' });
      return;
    }

    socket.join(getRoomChannel(roomId));
    ack?.({ ok: true });
  });

  socket.on('room:leave', (payload, ack) => {
    const roomId = payload && typeof payload.roomId === 'string' ? payload.roomId : null;

    if (!roomId) {
      ack?.({ ok: false, message: 'Invalid room request.' });
      return;
    }

    socket.leave(getRoomChannel(roomId));
    ack?.({ ok: true });
  });
});

httpServer.listen(port, hostname, () => {
  console.log(`> Ready on http://${hostname}:${port}`);
});

const closeServer = async () => {
  await prisma.$disconnect();
  io.close();
  httpServer.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
