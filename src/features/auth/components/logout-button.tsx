'use client';

import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="rounded-2xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
    >
      Sign out
    </button>
  );
};
