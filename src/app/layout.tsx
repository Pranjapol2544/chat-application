import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'Room Chat MVP',
  description: 'A Next.js room chat MVP with Prisma, Auth.js, and Socket.IO.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-950">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
