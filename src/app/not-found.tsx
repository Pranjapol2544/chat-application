import Link from 'next/link';

import { t } from '@/locales';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm shadow-zinc-950/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {t('common.app.name')}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          {t('rooms.notFound.title')}
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">{t('rooms.notFound.description')}</p>
        <Link
          href="/rooms"
          className="mt-6 inline-flex rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          {t('rooms.notFound.backToRooms')}
        </Link>
      </div>
    </div>
  );
}
