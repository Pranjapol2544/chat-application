import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { DEFAULT_LOCALE, t } from '@/locales';

import './globals.css';

export const metadata: Metadata = {
  title: t('common.metadata.title'),
  description: t('common.metadata.description'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LOCALE} className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-950">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
