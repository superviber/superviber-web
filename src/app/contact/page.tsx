import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact - SuperViber",
  description: "Get in touch with the SuperViber team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 gradient-bg">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Email Us</h2>
            <p className="text-zinc-400 mb-2">
              Interested in Alignment Dialogue for your domain?
            </p>
            <p className="text-zinc-300 font-medium mb-6">
              Contact us for a <span className="text-violet-400">proposal</span> tailored to your use case.
            </p>
            <a
              href="mailto:hello@superviber.com"
              className="inline-flex items-center gap-2 text-xl font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              hello@superviber.com
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-black border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-zinc-400 mb-6">
            Learn more about our multi-agent deliberation architecture.
          </p>
          <Link
            href="/about"
            className="inline-flex px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all"
          >
            How It Works
          </Link>
        </div>
      </section>
    </div>
  );
}
