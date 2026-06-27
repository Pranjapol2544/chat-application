import { decode, encode } from 'next-auth/jwt';

const SOCKET_TOKEN_SALT = 'chat-app-socket';

interface CreateSocketTokenInput {
  userId: string;
  username: string;
}

export const createSocketToken = async (input: CreateSocketTokenInput) => {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is required to create socket tokens.');
  }

  return encode({
    secret,
    salt: SOCKET_TOKEN_SALT,
    token: {
      sub: input.userId,
      id: input.userId,
      username: input.username,
    },
    maxAge: 60 * 60,
  });
};

export const verifySocketToken = async (token: string) => {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is required to verify socket tokens.');
  }

  return decode({
    token,
    secret,
    salt: SOCKET_TOKEN_SALT,
  });
};
