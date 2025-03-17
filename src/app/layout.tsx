import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import TopBar from '@/components/Header/TopBar';
import { TRPCReactProvider } from '@/server/trpc/client';
import { NuqsAdapter } from 'nuqs/adapters/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Expo Tickets',
  description: 'Tus tickets, en un solo lugar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NuqsAdapter>
            <div>
              <TopBar />
              {children}
            </div>
          </NuqsAdapter>
        </body>
      </html>
    </TRPCReactProvider>
  );
}
