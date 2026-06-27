import { redirect } from 'next/navigation';

import { listUserRooms } from '@/features/rooms/server/list-user-rooms';
import { t } from '@/locales';
import { getRequiredSession } from '@/server/auth/session';

export default async function RoomsPage() {
  const session = await getRequiredSession();
  const userRooms = await listUserRooms(session.user.id);

  if (userRooms[0]) {
    redirect(`/rooms/${userRooms[0].id}`);
  }

  return (
    <section className="flex h-full min-h-[70vh] items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-white px-8 py-16 text-center shadow-sm shadow-zinc-950/5">
      <div className="max-w-md space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {t('rooms.page.eyebrow')}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {t('rooms.page.emptyTitle')}
        </h1>
        <p className="text-sm leading-7 text-zinc-600">{t('rooms.page.emptyDescription')}</p>
      </div>
    </section>
  );
}
