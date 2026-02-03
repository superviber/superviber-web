import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - SuperViber",
  description: "Coordinated intelligence for complex decisions. The Alignment Dialogue Architecture for multi-expert deliberation.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 gradient-bg">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-fuchsia-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI Agents That <span className="gradient-text">Deliberate</span>
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-8">
            Complex problems require multiple perspectives. We orchestrate AI agents
            to achieve convergent consensus on decisions that matter.
          </p>
          <a
            href="https://zenodo.org/records/18434186"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            Technical Paper: DOI 10.5281/zenodo.18434186
          </a>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">The Problem with Single Perspectives</h2>
          <div className="space-y-6 text-lg text-zinc-300 leading-relaxed">
            <p>
              When facing complex decisions, organizations typically rely on a single analyst,
              a single model, or sequential review processes where later reviewers anchor on
              earlier opinions. This creates blind spots, groupthink, and first-mover bias.
            </p>
            <p>
              The classic parable of blind men describing an elephant applies to AI: a single
              agent sees only part of the problem. No matter how capable, one perspective
              cannot capture the full picture.
            </p>
            <p className="text-white font-medium">
              What if you could have hundreds of experts deliberate simultaneously, without any
              one voice dominating, and converge on a decision that integrates all their insights?
            </p>
          </div>
        </div>
      </section>

      {/* Calibrated to Your Domain */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Calibrated to <span className="gradient-text">Your Domain</span></h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
            You define the ethos. You set the principles. The system adapts to your domain.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* ADRs / Principles */}
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Your Operating Principles</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                Your operating principles become constitutional documents that define your
                domain ethos. Before any deliberation begins, all expert agents receive these as
                grounding context.
              </p>
              <div className="space-y-2 text-xs">
                <div className="py-2 px-3 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-between">
                  <span>&ldquo;Security over convenience&rdquo;</span>
                  <span className="text-violet-400 text-[10px] uppercase tracking-wide">Software</span>
                </div>
                <div className="py-2 px-3 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-between">
                  <span>&ldquo;Patient safety above efficiency&rdquo;</span>
                  <span className="text-emerald-400 text-[10px] uppercase tracking-wide">Healthcare</span>
                </div>
                <div className="py-2 px-3 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-between">
                  <span>&ldquo;Accessibility is a requirement&rdquo;</span>
                  <span className="text-fuchsia-400 text-[10px] uppercase tracking-wide">Product</span>
                </div>
                <div className="py-2 px-3 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-between">
                  <span>&ldquo;Precedent awareness required&rdquo;</span>
                  <span className="text-amber-400 text-[10px] uppercase tracking-wide">Legal</span>
                </div>
              </div>
            </div>

            {/* Adaptive Expert Selection */}
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Adaptive Expert Selection</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                Experts are dynamically selected based on the problem domain. Each panel includes
                core experts, adjacent perspectives, and wildcards for fresh thinking.
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wide">Software</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="py-1 px-2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">Security</span>
                    <span className="py-1 px-2 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">Performance</span>
                    <span className="py-1 px-2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">UX</span>
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wide">Healthcare</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="py-1 px-2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Clinical</span>
                    <span className="py-1 px-2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Ethics</span>
                    <span className="py-1 px-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Regulatory</span>
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wide">Legal</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="py-1 px-2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Precedent</span>
                    <span className="py-1 px-2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">Compliance</span>
                    <span className="py-1 px-2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">Stakeholder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-violet-950/30 to-fuchsia-950/30 border border-violet-500/20 text-center">
            <p className="text-zinc-300">
              <span className="font-semibold text-white">Your principles shape every deliberation.</span>
              {' '}Experts don&apos;t just analyze—they reason within the constraints you define,
              ensuring recommendations align with your stated philosophy.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution: Alignment Dialogue */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">The Alignment Dialogue</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
            A multi-agent architecture where expert agents deliberate in parallel,
            orchestrated by a Judge that synthesizes their perspectives into convergent consensus.
          </p>

          {/* Architecture Diagram */}
          <div className="relative mb-16">
            <div className="flex flex-col items-center">
              {/* Problem Statement */}
              <div className="py-4 px-6 rounded-xl bg-zinc-900 border border-zinc-700 text-center max-w-md">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Problem Statement</div>
                <div className="text-sm text-zinc-300">&ldquo;Should we add NVIDIA to the portfolio?&rdquo;</div>
              </div>

              <div className="h-4" />

              {/* Expert Agents */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                <div className="py-3 px-4 rounded-lg bg-violet-500/10 border border-violet-500/30 text-center text-sm">
                  <span className="font-semibold text-violet-300">Value</span>
                  <span className="text-violet-400/70"> Expert</span>
                </div>
                <div className="hidden md:block py-3 px-4 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 text-center text-sm">
                  <span className="font-semibold text-fuchsia-300">Growth</span>
                  <span className="text-fuchsia-400/70"> Expert</span>
                </div>
                <div className="py-3 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center text-sm">
                  <span className="font-semibold text-emerald-300">Risk</span>
                  <span className="text-emerald-400/70"> Expert</span>
                </div>
                <div className="hidden md:block py-3 px-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center text-sm">
                  <span className="font-semibold text-amber-300">Ethics</span>
                  <span className="text-amber-400/70"> Expert</span>
                </div>
              </div>

              {/* Expert Responses with Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mt-3">
                <div className="py-2 px-3 rounded bg-violet-500/5 border border-violet-500/20 text-xs">
                  <div className="text-violet-400/80 text-center">💬 Response</div>
                  <div className="text-center mt-1"><span className="text-violet-300 font-medium">7</span> <span className="text-violet-500">alignment</span></div>
                </div>
                <div className="hidden md:block py-2 px-3 rounded bg-fuchsia-500/5 border border-fuchsia-500/20 text-xs">
                  <div className="text-fuchsia-400/80 text-center">💬 Response</div>
                  <div className="text-center mt-1"><span className="text-fuchsia-300 font-medium">5</span> <span className="text-fuchsia-500">alignment</span></div>
                </div>
                <div className="py-2 px-3 rounded bg-emerald-500/5 border border-emerald-500/20 text-xs">
                  <div className="text-emerald-400/80 text-center">💬 Response</div>
                  <div className="text-center mt-1"><span className="text-emerald-300 font-medium">8</span> <span className="text-emerald-500">alignment</span></div>
                </div>
                <div className="hidden md:block py-2 px-3 rounded bg-amber-500/5 border border-amber-500/20 text-xs">
                  <div className="text-amber-400/80 text-center">💬 Response</div>
                  <div className="text-center mt-1"><span className="text-amber-300 font-medium">4</span> <span className="text-amber-500">alignment</span></div>
                </div>
              </div>

              <div className="h-4" />

              {/* Synthesis Round 1 */}
              <div className="py-4 px-6 rounded-xl bg-gradient-to-r from-blue-950/50 to-violet-950/50 border border-blue-500/30 text-center max-w-md">
                <div className="text-[10px] uppercase tracking-wider text-blue-400 mb-1">Round 1 Synthesis</div>
                <div className="flex justify-center gap-6 text-xs mb-3">
                  <div>
                    <span className="text-pink-400 font-medium">3</span>
                    <span className="text-zinc-500"> tensions</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-medium">8</span>
                    <span className="text-zinc-500"> perspectives</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-medium">24</span>
                    <span className="text-zinc-500"> alignment</span>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 italic">&ldquo;What metrics support the valuation thesis?&rdquo;</div>
              </div>

              <div className="h-4" />

              {/* Round 2 Label */}
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Round 2 — New experts based on guiding questions</div>

              {/* Round 2 Experts - 2 same, 2 new */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                <div className="py-3 px-4 rounded-lg bg-violet-500/10 border border-violet-500/30 text-center text-sm">
                  <span className="font-semibold text-violet-300">Value</span>
                  <span className="text-violet-400/70"> Expert</span>
                </div>
                <div className="hidden md:block py-3 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center text-sm">
                  <span className="font-semibold text-emerald-300">Risk</span>
                  <span className="text-emerald-400/70"> Expert</span>
                </div>
                <div className="py-3 px-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center text-sm">
                  <span className="font-semibold text-cyan-300">Quant</span>
                  <span className="text-cyan-400/70"> Expert</span>
                  <div className="text-[9px] text-cyan-500 mt-0.5">NEW</div>
                </div>
                <div className="hidden md:block py-3 px-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-center text-sm">
                  <span className="font-semibold text-rose-300">Macro</span>
                  <span className="text-rose-400/70"> Expert</span>
                  <div className="text-[9px] text-rose-500 mt-0.5">NEW</div>
                </div>
              </div>

              {/* Round 2 Responses */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mt-3">
                <div className="py-2 px-3 rounded bg-violet-500/5 border border-violet-500/20 text-xs">
                  <div className="text-violet-400/80 text-center">💬 Refined</div>
                  <div className="text-center mt-1"><span className="text-violet-300 font-medium">3</span> <span className="text-violet-500">alignment</span></div>
                </div>
                <div className="hidden md:block py-2 px-3 rounded bg-emerald-500/5 border border-emerald-500/20 text-xs">
                  <div className="text-emerald-400/80 text-center">💬 Refined</div>
                  <div className="text-center mt-1"><span className="text-emerald-300 font-medium">2</span> <span className="text-emerald-500">alignment</span></div>
                </div>
                <div className="py-2 px-3 rounded bg-cyan-500/5 border border-cyan-500/20 text-xs">
                  <div className="text-cyan-400/80 text-center">💬 Response</div>
                  <div className="text-center mt-1"><span className="text-cyan-300 font-medium">4</span> <span className="text-cyan-500">alignment</span></div>
                </div>
                <div className="hidden md:block py-2 px-3 rounded bg-rose-500/5 border border-rose-500/20 text-xs">
                  <div className="text-rose-400/80 text-center">💬 Response</div>
                  <div className="text-center mt-1"><span className="text-rose-300 font-medium">3</span> <span className="text-rose-500">alignment</span></div>
                </div>
              </div>

              <div className="h-4" />

              {/* Round 2 Synthesis */}
              <div className="py-4 px-6 rounded-xl bg-gradient-to-r from-blue-950/50 to-violet-950/50 border border-blue-500/30 text-center max-w-md">
                <div className="text-[10px] uppercase tracking-wider text-blue-400 mb-1">Round 2 Synthesis</div>
                <div className="flex justify-center gap-6 text-xs mb-3">
                  <div>
                    <span className="text-pink-400 font-medium">1</span>
                    <span className="text-zinc-500"> tension</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-medium">11</span>
                    <span className="text-zinc-500"> perspectives</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-medium">36</span>
                    <span className="text-zinc-500"> alignment</span>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 italic">&ldquo;What position size balances valuation opportunity with volatility?&rdquo;</div>
              </div>

              {/* Ellipsis indicating more rounds */}
              <div className="py-4 text-center">
                <div className="text-zinc-600 text-2xl tracking-widest">•••</div>
                <div className="text-[10px] text-zinc-500 mt-1">rounds continue until convergence</div>
              </div>

              {/* See Demo CTA */}
              <Link
                href="/demo/alignment"
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full hover:bg-violet-500/30 transition-colors text-sm text-violet-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See a real dialogue in action
              </Link>

              {/* Final Synthesis - Convergence */}
              <div className="py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-950/50 to-cyan-950/50 border border-emerald-500/30 text-center max-w-md">
                <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1">Convergence Detected</div>
                <div className="flex justify-center gap-6 text-xs">
                  <div>
                    <span className="text-pink-400 font-medium">0</span>
                    <span className="text-zinc-500"> tensions</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-medium">12</span>
                    <span className="text-zinc-500"> perspectives</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-medium">38</span>
                    <span className="text-zinc-500"> total</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-zinc-400">Velocity → 0 • Consensus achieved</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Zero Knowledge Zero Trust Architecture */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Zero Knowledge. Zero Trust.</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
            Your data never leaves your infrastructure. Superviber orchestrates—you execute.
            The architecture enforces this—it&apos;s not just a promise.
          </p>

          {/* Hybrid Architecture Diagram */}
          <div className="relative mb-12">
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Superviber Cloud */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50 border border-violet-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  <span className="text-sm font-semibold text-violet-300">Superviber Cloud</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="py-2 px-3 rounded bg-zinc-900/50 text-zinc-400 flex items-center gap-2">
                    <svg className="w-3 h-3 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Orchestration
                  </div>
                  <div className="py-2 px-3 rounded bg-zinc-900/50 text-zinc-400 flex items-center gap-2">
                    <svg className="w-3 h-3 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Billing & Telemetry
                  </div>
                  <div className="py-2 px-3 rounded bg-zinc-900/50 text-zinc-400 flex items-center gap-2">
                    <svg className="w-3 h-3 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Updates
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-zinc-500">
                    Sees only: session counts, response times, error rates
                  </p>
                </div>
              </div>

              {/* Client Infrastructure */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-300">Your Infrastructure</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="py-2 px-3 rounded bg-zinc-900/50 text-zinc-400 flex items-center gap-2">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    Dialogue Agents
                  </div>
                  <div className="py-2 px-3 rounded bg-zinc-900/50 text-zinc-400 flex items-center gap-2">
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Encrypted Data
                  </div>
                  <div className="py-2 px-3 rounded bg-zinc-900/50 text-zinc-400 flex items-center gap-2">
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                    Your KMS Keys
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-zinc-500">
                    Your data. Your keys. Your control.
                  </p>
                </div>
              </div>
            </div>

                      </div>

          {/* Zero Trust Guarantees */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/5 text-center">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xs font-semibold">Data Never Leaves</h4>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/5 text-center">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h4 className="text-xs font-semibold">You Own The Keys</h4>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/5 text-center">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h4 className="text-xs font-semibold">Instant Revocation</h4>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/5 text-center">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h4 className="text-xs font-semibold">Full Audit Trail</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Any Complex Decision</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
            The architecture is domain-agnostic. If a problem benefits from multiple expert
            perspectives, it can be solved with Alignment Dialogue.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Portfolio Management</h3>
              </div>
              <p className="text-zinc-400 text-sm">
                Value, growth, macro, risk, and ESG analysts deliberate on investment decisions
                calibrated by your strategy documents.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-fuchsia-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Software Architecture</h3>
              </div>
              <p className="text-zinc-400 text-sm">
                Security, performance, maintainability, and cost experts evaluate design
                decisions before code is written.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-pink-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Policy Analysis</h3>
              </div>
              <p className="text-zinc-400 text-sm">
                Legal, ethical, economic, and stakeholder perspectives converge on
                policy recommendations with transparent reasoning.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Strategic Planning</h3>
              </div>
              <p className="text-zinc-400 text-sm">
                Market analysis, competitive intelligence, operations, and finance
                perspectives align on strategic initiatives.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Risk Assessment</h3>
              </div>
              <p className="text-zinc-400 text-sm">
                Technical, operational, regulatory, and reputational risk experts
                surface blind spots before they become incidents.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Your Domain</h3>
              </div>
              <p className="text-zinc-400 text-sm">
                The architecture adapts to any field. Define your experts, calibrate
                with your documents, and let agents deliberate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for <span className="gradient-text">Your Domain</span>?</h2>
          <p className="text-lg text-zinc-300 mb-4">
            We&apos;ll analyze your decision-making challenges and show you exactly how
            Alignment Dialogue can help—tailored to your domain, your principles, your experts.
          </p>
          <p className="text-zinc-400 mb-8">
            Contact us for a <span className="text-white font-medium">proposal</span> specific to your use case.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all"
            >
              Get a Proposal
            </Link>
            <a
              href="https://zenodo.org/records/18434186"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/30 rounded-full hover:bg-white/10 transition-colors"
            >
              Read the Technical Paper
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
