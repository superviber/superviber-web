import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - SuperViber",
  description: "AI agents that deliberate to convergent consensus. The N+1 Alignment Dialogue Architecture for complex decision-making.",
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
            Published on Zenodo: DOI 10.5281/zenodo.18434186
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

      {/* The Solution: N+1 Architecture */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">The N+1 Alignment Dialogue</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
            A multi-agent architecture where N expert agents deliberate in parallel,
            orchestrated by a Judge that synthesizes their perspectives into convergent consensus.
          </p>

          {/* Architecture Diagram */}
          <div className="relative mb-16">
            <div className="flex flex-col items-center">
              {/* Judge */}
              <div className="w-40 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-center font-semibold mb-8">
                Judge (Orchestrator)
              </div>

              {/* Connection lines - simplified representation */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-px h-8 bg-gradient-to-b from-fuchsia-500 to-transparent" />
              </div>

              {/* Expert Agents */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                {['Value', 'Growth', 'Risk', 'Ethics'].map((expert, i) => (
                  <div
                    key={expert}
                    className="py-3 px-4 rounded-lg bg-zinc-800 border border-zinc-700 text-center text-sm"
                  >
                    <span className="text-zinc-400">Agent {i + 1}</span>
                    <br />
                    <span className="font-medium">{expert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Innovations */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-violet-400">Parallel Spawning</h3>
              <p className="text-zinc-400 text-sm">
                All agents deliberate simultaneously. No first-mover bias, no anchoring on
                earlier opinions. True independence of perspectives.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-fuchsia-400">Unbounded Scoring</h3>
              <p className="text-zinc-400 text-sm">
                ALIGNMENT = Wisdom + Consistency + Truth + Relationships. No artificial ceilings.
                Exceptional contributions get exceptional scores.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-pink-400">Velocity Convergence</h3>
              <p className="text-zinc-400 text-sm">
                When the rate of new insights approaches zero, consensus is achieved.
                The system knows when to stop deliberating.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Full Audit Trail</h3>
              <p className="text-zinc-400 text-sm">
                Every perspective, tension, concession, and resolution is recorded.
                Complete transparency into how decisions were made.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-violet-400">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Define</h3>
              <p className="text-zinc-400 text-sm">
                Frame the decision and select relevant expert perspectives.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-fuchsia-400">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Deliberate</h3>
              <p className="text-zinc-400 text-sm">
                Agents analyze independently, surface perspectives and tensions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-pink-400">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Converge</h3>
              <p className="text-zinc-400 text-sm">
                Multiple rounds of refinement until velocity approaches zero.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-cyan-400">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Synthesize</h3>
              <p className="text-zinc-400 text-sm">
                Judge produces final recommendation with full reasoning trail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Any Complex Decision</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
            The architecture is domain-agnostic. If a problem benefits from multiple expert
            perspectives, it can be solved with Alignment Dialogue.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/30 transition-colors">
              <h3 className="text-lg font-semibold mb-3">Portfolio Management</h3>
              <p className="text-zinc-400 text-sm">
                Value, growth, macro, risk, and ESG analysts deliberate on investment decisions
                calibrated by your strategy documents.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-fuchsia-500/30 transition-colors">
              <h3 className="text-lg font-semibold mb-3">Software Architecture</h3>
              <p className="text-zinc-400 text-sm">
                Security, performance, maintainability, and cost experts evaluate design
                decisions before code is written.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-pink-500/30 transition-colors">
              <h3 className="text-lg font-semibold mb-3">Policy Analysis</h3>
              <p className="text-zinc-400 text-sm">
                Legal, ethical, economic, and stakeholder perspectives converge on
                policy recommendations with transparent reasoning.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 transition-colors">
              <h3 className="text-lg font-semibold mb-3">Strategic Planning</h3>
              <p className="text-zinc-400 text-sm">
                Market analysis, competitive intelligence, operations, and finance
                perspectives align on strategic initiatives.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors">
              <h3 className="text-lg font-semibold mb-3">Risk Assessment</h3>
              <p className="text-zinc-400 text-sm">
                Technical, operational, regulatory, and reputational risk experts
                surface blind spots before they become incidents.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-amber-500/30 transition-colors">
              <h3 className="text-lg font-semibold mb-3">Your Domain</h3>
              <p className="text-zinc-400 text-sm">
                The architecture adapts to any field. Define your experts, calibrate
                with your documents, and let agents deliberate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Innovation */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Open Innovation</h2>
          <p className="text-lg text-zinc-300 mb-8">
            The core N+1 Alignment Dialogue Architecture is published as a defensive publication
            under CC0 Public Domain. We believe foundational AI orchestration patterns should
            remain open and unencumbered by patents.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a
              href="https://zenodo.org/records/18434186"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
            >
              Read the Publication
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/30 rounded-full hover:bg-white/10 transition-colors"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
