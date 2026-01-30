import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              SuperViber
            </Link>
            <p className="text-zinc-500 text-sm mt-2">Feel the music. See the words.</p>
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
