import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Alignment Dialogues | Multi-Expert Deliberation for Complex Decisions",
  description: "Watch N experts deliberate, disagree, and converge. Structured multi-perspective analysis for investment, policy, and technical decisions.",
  keywords: ["multi-agent deliberation", "AI decision support", "structured disagreement", "expert panel", "convergence detection", "ALIGNMENT scoring"],
  openGraph: {
    title: "Alignment Dialogues",
    description: "Multi-expert deliberation with structured disagreement and convergence tracking",
    type: "website",
    url: "https://superviber.com/alignment",
  },
  alternates: {
    canonical: "https://superviber.com/alignment"
  }
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Alignment Dialogues",
      "applicationCategory": "Decision Support System",
      "operatingSystem": "Web",
      "description": "Multi-expert deliberation system for complex decisions using structured disagreement and convergence tracking",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Person",
        "name": "Eric Garcia",
        "url": "https://muffinlabs.ai/about"
      }
    },
    {
      "@type": "HowTo",
      "name": "How Alignment Dialogues Work",
      "description": "A structured process for multi-expert deliberation on complex decisions",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Design Expert Pool",
          "text": "Create domain-appropriate experts with tiers (Core, Adjacent, Wildcard) and relevance scores"
        },
        {
          "@type": "HowToStep",
          "name": "Run Parallel Deliberation",
          "text": "N experts deliberate independently, surfacing perspectives and tensions"
        },
        {
          "@type": "HowToStep",
          "name": "Track Tensions",
          "text": "Judge synthesizes perspectives, tracks tension lifecycle across rounds"
        },
        {
          "@type": "HowToStep",
          "name": "Detect Convergence",
          "text": "Monitor ALIGNMENT velocity until gain approaches zero, signaling consensus"
        }
      ]
    }
  ]
};

export default function AlignmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 px-6 gradient-bg overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-fuchsia-500/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm text-violet-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              Multi-Agent Deliberation Architecture
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Alignment Dialogues</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 mb-4">
              N experts. Structured disagreement. Emergent truth.
            </p>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-10">
              Watch multiple AI experts deliberate on complex decisions, surface tensions,
              and converge on consensus through structured multi-perspective analysis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/alignment/demo"
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
              >
                See It In Action
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-6 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Complex decisions require <span className="text-violet-400">diverse perspectives</span>
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Single-model outputs miss nuance. Committee meetings suffer from groupthink.
                Analysis paralysis stalls progress. Hidden assumptions go unchallenged.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                  title: "Groupthink",
                  description: "Single perspectives dominate, alternatives suppressed"
                },
                {
                  icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  title: "Analysis Paralysis",
                  description: "Too many options, no framework for convergence"
                },
                {
                  icon: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
                  title: "Hidden Assumptions",
                  description: "Blind spots remain unexposed until it's too late"
                }
              ].map((problem, i) => (
                <div key={i} className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={problem.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
                  <p className="text-sm text-zinc-400">{problem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-6 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How <span className="gradient-text">Alignment Dialogues</span> Work
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                A structured four-phase process that transforms diverse expert opinions into convergent consensus.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Design Expert Pool",
                  description: "Create domain-appropriate experts with tiers (Core, Adjacent, Wildcard) and relevance weights.",
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  color: "violet"
                },
                {
                  step: "02",
                  title: "Parallel Deliberation",
                  description: "N experts deliberate independently, each surfacing unique perspectives and potential tensions.",
                  icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                  color: "cyan"
                },
                {
                  step: "03",
                  title: "Track Tensions",
                  description: "The Judge synthesizes perspectives, assigns global IDs, and tracks tension lifecycle across rounds.",
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  color: "amber"
                },
                {
                  step: "04",
                  title: "Detect Convergence",
                  description: "Monitor ALIGNMENT velocity. When gain approaches zero, the dialogue has reached consensus.",
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  color: "emerald"
                }
              ].map((step, i) => (
                <div key={i} className="relative p-6 rounded-xl bg-zinc-900/50 border border-white/5">
                  <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-${step.color}-500/20 border border-${step.color}-500/30 flex items-center justify-center text-xs font-bold text-${step.color}-300`}>
                    {step.step}
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-${step.color}-500/10 flex items-center justify-center mb-4 mt-2`}>
                    <svg className={`w-6 h-6 text-${step.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ALIGNMENT Scoring Section */}
        <section className="py-20 px-6 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  The <span className="text-emerald-400">ALIGNMENT</span> Score
                </h2>
                <p className="text-zinc-400 mb-6">
                  Each round is scored across four unbounded dimensions. The score can always go higher -
                  there&apos;s always another perspective, another edge case, another context.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Wisdom", short: "W", color: "violet", desc: "Perspectives integrated and synthesized" },
                    { label: "Consistency", short: "C", color: "cyan", desc: "Follows patterns, internally consistent" },
                    { label: "Truth", short: "T", color: "amber", desc: "Grounded in reality, no contradictions" },
                    { label: "Relationships", short: "R", color: "emerald", desc: "Connections to other artifacts" },
                  ].map((dim, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-${dim.color}-500/20 border border-${dim.color}-500/30 flex items-center justify-center text-lg font-bold text-${dim.color}-300`}>
                        {dim.short}
                      </div>
                      <div>
                        <div className={`font-semibold text-${dim.color}-300`}>{dim.label}</div>
                        <div className="text-sm text-zinc-500">{dim.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50 border border-violet-500/20">
                <div className="text-center mb-6">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Sample Dialogue Result</div>
                  <div className="text-5xl font-bold text-emerald-400">418</div>
                  <div className="text-sm text-zinc-400 mt-1">Total ALIGNMENT Score</div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[
                    { label: "W", value: 112, color: "violet" },
                    { label: "C", value: 104, color: "cyan" },
                    { label: "T", value: 102, color: "amber" },
                    { label: "R", value: 100, color: "emerald" },
                  ].map((d, i) => (
                    <div key={i} className={`p-3 rounded-lg bg-${d.color}-500/10 border border-${d.color}-500/20 text-center`}>
                      <div className={`text-2xl font-bold text-${d.color}-300`}>{d.value}</div>
                      <div className={`text-xs text-${d.color}-400/70`}>{d.label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Rounds to Convergence</span>
                    <span className="text-white font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tensions Resolved</span>
                    <span className="text-emerald-400 font-medium">8/8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Expert Consensus</span>
                    <span className="text-emerald-400 font-medium">8/8 (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 px-6 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Use Cases
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Any domain where multiple perspectives matter and stakes are high.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Investment Analysis",
                  description: "Portfolio managers deliberate on position sizing, risk exposure, and timing with Value, Growth, Risk, and Income perspectives.",
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  available: true
                },
                {
                  title: "Technical Architecture Review",
                  description: "Platform, Security, SRE, and Cost perspectives evaluate system design decisions before implementation.",
                  icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
                  available: false
                },
                {
                  title: "Policy Deliberation",
                  description: "Legal, Compliance, Ethics, and Business perspectives align on policy decisions with documented reasoning.",
                  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  available: false
                },
                {
                  title: "Risk Assessment",
                  description: "Multiple risk perspectives (operational, financial, reputational, technical) converge on mitigation strategies.",
                  icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                  available: false
                }
              ].map((useCase, i) => (
                <div key={i} className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={useCase.icon} />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{useCase.title}</h3>
                        {useCase.available ? (
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Demo Available
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-zinc-500/20 text-zinc-400 border border-zinc-500/30">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">{useCase.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-zinc-950 to-black">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See Multi-Expert Deliberation <span className="gradient-text">In Action</span>
            </h2>
            <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
              Watch 8 investment experts deliberate on an NVIDIA position decision,
              moving from initial perspectives through 4 rounds to convergent consensus.
            </p>
            <Link
              href="/alignment/demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
            >
              Explore the Demo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
