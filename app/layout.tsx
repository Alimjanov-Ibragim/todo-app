import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import { ClientProviders } from '@/app/ClientProviders';
import './globals.css';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin', 'cyrillic'],
  weight: ['100', '300', '400', '500', '700', '900']
});

export const metadata: Metadata = {
  title: 'Todo app',
  description: 'Todo app description'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased bg-slate-100`}>
        <ClientProviders>
          <main className="max-w-3xl mx-auto py-[40px]">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
