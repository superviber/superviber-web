import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - SuperViber",
  description: "Learn about SuperViber and our mission to enhance the music listening experience.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 gradient-bg">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">SuperViber</span>
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Where music meets meaning.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <div className="space-y-6 text-lg text-zinc-300 leading-relaxed">
            <p>
              SuperViber was born from a simple observation: music hits different when you understand every word.
              Whether it&apos;s catching a clever wordplay you&apos;ve missed for years, or finally understanding
              what that mumbled verse actually says, lyrics transform how we connect with songs.
            </p>
            <p>
              We built SuperViber to bridge the gap between listening and understanding. By synchronizing
              lyrics to the exact moment they&apos;re sung, we create an immersive experience that lets you
              feel every word as it happens.
            </p>
            <p>
              No more pausing to look up lyrics. No more guessing. Just pure, synced vibes.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-violet-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Pick a Song</h3>
              <p className="text-zinc-400">
                Browse our curated playlist of hand-synced tracks.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-fuchsia-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Watch & Listen</h3>
              <p className="text-zinc-400">
                The video plays while lyrics appear in perfect sync.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-pink-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Feel the Vibe</h3>
              <p className="text-zinc-400">
                Experience the music with deeper understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Believe</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                <span className="text-2xl">🎵</span> Music is Universal
              </h3>
              <p className="text-zinc-400">
                Great songs transcend language and culture. We help everyone connect with the words behind the melody.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                <span className="text-2xl">✨</span> Details Matter
              </h3>
              <p className="text-zinc-400">
                Every lyric is synced by hand to the millisecond. No auto-generated approximations here.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                <span className="text-2xl">🎯</span> Simplicity First
              </h3>
              <p className="text-zinc-400">
                No accounts, no ads, no complexity. Just press play and vibe.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                <span className="text-2xl">💜</span> Made with Love
              </h3>
              <p className="text-zinc-400">
                Every playlist is curated, every lyric is verified. We care about getting it right.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
