import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const USERS = [
  {
    email: 'alice@example.com',
    username: 'alice',
    password: 'password123',
  },
  {
    email: 'bob@example.com',
    username: 'bob',
    password: 'password123',
  },
  {
    email: 'charlie@example.com',
    username: 'charlie',
    password: 'password123',
  },
];

const ROOMS = [
  {
    name: 'General',
    members: ['alice', 'bob', 'charlie'],
    messages: [
      { sender: 'alice', content: 'Welcome to the general room.' },
      { sender: 'bob', content: 'Glad to be here.' },
    ],
  },
  {
    name: 'Frontend',
    members: ['alice', 'charlie'],
    messages: [{ sender: 'charlie', content: "Let's build the chat UI next." }],
  },
];

const main = async () => {
  const usersByUsername = new Map();

  for (const user of USERS) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    const savedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        username: user.username,
        name: user.username,
        passwordHash,
      },
      create: {
        email: user.email,
        username: user.username,
        name: user.username,
        passwordHash,
      },
    });

    usersByUsername.set(user.username, savedUser);
  }

  for (const room of ROOMS) {
    const creator = usersByUsername.get(room.members[0]);

    const savedRoom = await prisma.room.upsert({
      where: { name: room.name },
      update: {
        createdById: creator.id,
      },
      create: {
        name: room.name,
        createdById: creator.id,
      },
    });

    for (const username of room.members) {
      const member = usersByUsername.get(username);

      await prisma.roomMember.upsert({
        where: {
          roomId_userId: {
            roomId: savedRoom.id,
            userId: member.id,
          },
        },
        update: {},
        create: {
          roomId: savedRoom.id,
          userId: member.id,
        },
      });
    }

    const existingMessages = await prisma.message.count({
      where: { roomId: savedRoom.id },
    });

    if (existingMessages === 0) {
      for (const message of room.messages) {
        const sender = usersByUsername.get(message.sender);

        await prisma.message.create({
          data: {
            roomId: savedRoom.id,
            senderId: sender.id,
            content: message.content,
          },
        });
      }

      const lastMessage = await prisma.message.findFirst({
        where: { roomId: savedRoom.id },
        orderBy: { createdAt: 'desc' },
      });

      await prisma.room.update({
        where: { id: savedRoom.id },
        data: {
          lastMessageAt: lastMessage?.createdAt ?? null,
        },
      });
    }
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
