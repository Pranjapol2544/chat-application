import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/server/auth/auth-options';

export const getOptionalSession = () => {
  return getServerSession(authOptions);
};

export const getRequiredSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session;
};
