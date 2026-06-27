import { t } from '@/locales';

export default async function RoomsPage() {
  return (
    <section className="flex min-h-[calc(100dvh-1.5rem)] items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-white px-5 py-12 text-center shadow-sm shadow-zinc-950/5 sm:min-h-[70vh] sm:px-8 sm:py-16">
      <div className="max-w-md space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {t('rooms.page.eyebrow')}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          {t('rooms.page.emptyTitle')}
        </h1>
        <p className="text-sm leading-7 text-zinc-600">{t('rooms.page.emptyDescription')}</p>
        <p className="text-sm font-medium text-zinc-500">{t('rooms.page.emptyAction')}</p>
      </div>
    </section>
  );
}
