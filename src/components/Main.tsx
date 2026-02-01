'use client';

import { usePathname } from 'next/navigation';

export default function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlayer = pathname?.startsWith('/player');

  if (isPlayer) {
    return (
      <main className="pt-16 h-dvh overflow-hidden">
        {children}
      </main>
    );
  }

  return (
    <main className="pt-16 min-h-screen">
      {children}
    </main>
  );
}
