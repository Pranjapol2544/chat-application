import { redirect } from 'next/navigation';

import { LoginForm } from '@/features/auth/components/login-form';
import { getOptionalSession } from '@/server/auth/session';

interface LoginPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getOptionalSession();

  if (session?.user?.id) {
    redirect('/rooms');
  }

  const params = searchParams ? await searchParams : {};
  const registered = params.registered === '1';

  return <LoginForm registered={registered} />;
}
