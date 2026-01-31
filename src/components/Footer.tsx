import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/images/sv-icon.png"
                alt="Superviber"
                width={32}
                height={32}
                className="h-7 w-auto"
              />
              <Image
                src="/images/title.svg"
                alt="Superviber"
                width={100}
                height={24}
                className="h-4 w-auto"
              />
            </Link>
            <p className="text-zinc-500 text-sm mt-2">AI agents that deliberate to consensus.</p>
          </div>
          <div className="flex gap-8 text-sm text-zinc-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-zinc-600 text-sm">
          &copy; {new Date().getFullYear()} SuperViber. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
