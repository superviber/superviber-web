'use client';

import { Inter } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin has its own minimal layout - no nav/footer
  return (
    <div className={`${inter.variable} font-sans antialiased bg-zinc-950 text-white min-h-screen`}>
      {children}
    </div>
  );
}
