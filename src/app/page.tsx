import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center gradient-bg overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6 flex flex-col items-center">
            <Image
              src="/images/sv-icon.png"
              alt="Superviber"
              width={240}
              height={240}
              className="h-40 md:h-52 w-auto"
              priority
            />
            <Image
              src="/images/title.svg"
              alt="Superviber"
              width={320}
              height={64}
              className="h-12 md:h-14 w-auto mt-2"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Multiple Perspectives.
            <br />
            <span className="gradient-text">One Decision.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            We orchestrate AI agents that deliberate in parallel to achieve convergent
            consensus on complex decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors text-lg"
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/30 rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Complex Decisions Deserve <span className="gradient-text">Multiple Minds</span>
          </h2>
          <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto">
            A single analyst sees one part of the elephant. Our N+1 architecture coordinates
            multiple expert agents that deliberate simultaneously, then converge on recommendations
            backed by transparent reasoning.
          </p>

          {/* Mini architecture visual */}
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-32 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-center text-sm font-semibold mb-6">
                Judge
              </div>
              <div className="grid grid-cols-4 gap-3 w-full">
                {['Expert 1', 'Expert 2', 'Expert 3', 'Expert N'].map((expert) => (
                  <div
                    key={expert}
                    className="py-2 px-2 rounded-lg bg-zinc-800 border border-zinc-700 text-center text-xs"
                  >
                    {expert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why <span className="gradient-text">Superviber</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Parallel Deliberation</h3>
              <p className="text-zinc-400">
                All expert agents analyze simultaneously. No first-mover bias, no anchoring effects.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-fuchsia-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparent Reasoning</h3>
              <p className="text-zinc-400">
                Full audit trail of every perspective, tension, and resolution. Know exactly why.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-pink-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Convergent Consensus</h3>
              <p className="text-zinc-400">
                Velocity-based convergence detection. The system knows when alignment is achieved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Published Research */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="gradient-text">Open Research</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            The N+1 Alignment Dialogue Architecture is published under CC0 Public Domain.
            We believe foundational AI orchestration patterns should remain open.
          </p>
          <a
            href="https://zenodo.org/records/18434186"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700 transition-colors text-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            Read on Zenodo
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to <span className="gradient-text">align your decisions</span>?
          </h2>
          <p className="text-xl text-zinc-400 mb-10">
            Whether it&apos;s portfolio management, software architecture, or strategic planning,
            we can help you make better decisions with multi-agent deliberation.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-10 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all text-lg glow"
          >
            Talk to Us
          </Link>
        </div>
      </section>
    </div>
  );
}
