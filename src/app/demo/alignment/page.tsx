"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Types aligned to export format
interface DialogueMetadata {
  id: string;
  title: string;
  date: string;
  status: "converged" | "in_progress" | "abandoned";
  domain: string;
  question: string;
}

interface ConvergenceData {
  achieved: boolean;
  rounds: number;
  total_alignment: number;
  breakdown: { wisdom: number; consistency: number; truth: number; relationships: number };
  final_velocity: number;
  final_convergence_percent: number;
  experts_converged: number;
  experts_total: number;
}

interface PanelExpert {
  name: string;
  role: string;
  tier: "Core" | "Adjacent" | "Wildcard";
  total_score: number;
  round_scores?: number[];
}

interface ResolvedTension {
  id: string;
  label: string;
  resolution: string;
  round_resolved: number;
}

interface RoundSummary {
  round: number;
  score: number;
  breakdown?: { wisdom: number; consistency: number; truth: number; relationships: number };
  open_tensions: number;
  new_perspectives: number;
  velocity: number;
  convergence_percent: number;
  summary: string;
}

interface Verdict {
  type: string;
  recommendation: string;
  description: string;
  confidence: string;
  grounds: string[];
  conditional_recommendation?: {
    trigger: string;
    funding_source: string;
    valuation_discipline: string;
    position_sizing: string;
    implementation: string;
  };
  default_action: string;
}

interface KeyPerspective {
  id: string;
  agent: string;
  label: string;
  content: string;
  round: number;
}

interface DialogueExport {
  dialogue: DialogueMetadata;
  convergence: ConvergenceData;
  panel: PanelExpert[];
  tensions_resolved: ResolvedTension[];
  rounds: RoundSummary[];
  verdict: Verdict;
  key_perspectives: KeyPerspective[];
  data_directory: string;
}

interface CandidateData {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  marketCap: string;
  peRatio: number;
  forwardPE: number;
  dividendYield: number;
  esgRating: string;
  portfolio: {
    name: string;
    totalValue: number;
    cashPosition: number;
    cashWeight: number;
    lastUpdated: string;
    holdings: Array<{
      ticker: string;
      name: string;
      sector: string;
      shares: number;
      costBasis: number;
      purchaseDate: string;
      currentPrice: number;
      value: number;
      weight: number;
      gain: number;
      esgRating: string;
    }>;
  };
  financials: {
    revenue: { ttm: string; growth: string };
    netIncome: { ttm: string; margin: string };
  };
}

// Pastry emoji map
const PASTRY_EMOJI: Record<string, string> = {
  muffin: "🧁", cupcake: "🧁", scone: "🥮", eclair: "🥖",
  donut: "🍩", brioche: "🥐", croissant: "🥐", macaron: "🍪",
};

export default function AlignmentDemoPage() {
  const [dialogueExport, setDialogueExport] = useState<DialogueExport | null>(null);
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [expertContent, setExpertContent] = useState<Record<number, Record<string, string>>>({});
  const [contentLoaded, setContentLoaded] = useState(false);
  const [expandedContext, setExpandedContext] = useState(false);
  const [viewMode, setViewMode] = useState<"summary" | "raw">("raw");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [roundSummaries, setRoundSummaries] = useState<Record<number, string>>({});
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [canScrollMore, setCanScrollMore] = useState(false);
  const summaryScrollRef = useRef<HTMLDivElement>(null);

  // Load dialogue export and preload all content
  useEffect(() => {
    const loadAll = async () => {
      // Load export JSON
      const exportRes = await fetch("/demo/nvidia-dialogue-export.json");
      const exportData: DialogueExport = await exportRes.json();
      setDialogueExport(exportData);

      // Load candidate data
      const candidateRes = await fetch("/demo/nvidia-candidate.json");
      const candidateData = await candidateRes.json();
      setCandidate(candidateData);

      // Preload all raw markdown content
      const rawBase = `/demo/${exportData.data_directory}`;
      const content: Record<number, Record<string, string>> = {};

      for (let round = 0; round < exportData.convergence.rounds; round++) {
        content[round] = {};
        const promises = exportData.panel.map(async (expert) => {
          const name = expert.name.toLowerCase();
          try {
            const res = await fetch(`${rawBase}/round-${round}/${name}.md`);
            if (res.ok) {
              content[round][name] = await res.text();
            }
          } catch {
            content[round][name] = "";
          }
        });
        await Promise.all(promises);
      }

      setExpertContent(content);

      // Preload round summary markdown files
      const summaries: Record<number, string> = {};
      for (let round = 0; round < exportData.convergence.rounds; round++) {
        try {
          const res = await fetch(`${rawBase}/round-${round}.summary.md`);
          if (res.ok) {
            summaries[round] = await res.text();
          }
        } catch {
          summaries[round] = "";
        }
      }
      setRoundSummaries(summaries);

      setContentLoaded(true);
    };

    loadAll();
  }, []);

  // Check if summary can scroll more
  useEffect(() => {
    const checkScroll = () => {
      const el = summaryScrollRef.current;
      if (el) {
        const canScroll = el.scrollHeight > el.clientHeight;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
        setCanScrollMore(canScroll && !atBottom);
      }
    };
    checkScroll();
    // Recheck after a brief delay for content to render
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [currentRound, summaryExpanded, roundSummaries]);

  // Get expert content for current round
  const getExpertContent = (round: number, expertName: string): string => {
    return expertContent[round]?.[expertName.toLowerCase()] || "";
  };

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Core": return "violet";
      case "Adjacent": return "cyan";
      case "Wildcard": return "amber";
      default: return "zinc";
    }
  };

  // Render inline formatting (bold, [MOVE:CONVERGE], etc.)
  const renderInlineFormatting = (text: string): React.ReactNode[] => {
    // First split on [MOVE:CONVERGE]
    const convergePattern = /(\[MOVE:CONVERGE\])/g;
    const convergeParts = text.split(convergePattern);

    return convergeParts.flatMap((segment, segIdx) => {
      if (segment === "[MOVE:CONVERGE]") {
        return (
          <span key={`converge-${segIdx}`} className="inline-flex items-center px-1.5 py-0.5 mx-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium align-middle">
            CONVERGE
          </span>
        );
      }
      // Then handle bold within non-converge segments
      const boldParts = segment.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={`${segIdx}-bold-${i}`} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    });
  };

  // Render expert content with formatting
  const renderExpertContent = (content: string, compact = false) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      // [FINAL POSITION]
      if (line.includes("[FINAL POSITION]")) {
        return (
          <div key={i} className={`${compact ? "mt-2 mb-1" : "mt-4 mb-2"} ${compact ? "text-xs" : "text-sm"} font-bold text-white border-b border-zinc-700 pb-1`}>
            Final Position
          </div>
        );
      }
      // [PERSPECTIVE ...]
      if (line.startsWith("[PERSPECTIVE")) {
        let match = line.match(/\[PERSPECTIVE ([^:]+): ([^\]]+)\]/);
        let pId = match?.[1];
        let description = match?.[2];
        if (!match) {
          match = line.match(/\[PERSPECTIVE[:\s]+([^\]]+)\]/);
          pId = undefined;
          description = match?.[1];
        }
        if (description) {
          let status = "";
          if (description.includes("- PARTIALLY RESOLVED")) {
            status = "PARTIALLY RESOLVED";
            description = description.replace("- PARTIALLY RESOLVED", "").trim();
          } else if (description.includes("- MAINTAINED")) {
            status = "MAINTAINED";
            description = description.replace("- MAINTAINED", "").trim();
          } else if (description.includes("- REFINED")) {
            status = "REFINED";
            description = description.replace("- REFINED", "").trim();
          }
          const tagText = status ? `${status}${pId ? ` ${pId}` : ""}` : pId ? pId : "PERSPECTIVE";
          return (
            <div key={i} className={`flex items-start gap-2 ${compact ? "mb-2" : "mb-3"}`}>
              <span className={`shrink-0 px-1.5 py-0.5 ${compact ? "text-[10px]" : "text-xs"} rounded ${status ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-violet-500/20 text-violet-300 border-violet-500/30"} border`}>
                {tagText}
              </span>
              <span className={`${compact ? "text-[10px]" : "text-sm"} font-semibold ${status ? "text-cyan-300" : "text-violet-300"}`}>{description}</span>
            </div>
          );
        }
      }
      // [TENSION ...]
      if (line.startsWith("[TENSION")) {
        const match = line.match(/\[TENSION ([^:]+): ([^\]]+)\]/);
        if (match) {
          return (
            <div key={i} className={`flex items-start gap-2 ${compact ? "mb-2" : "mb-3"}`}>
              <span className={`shrink-0 px-1.5 py-0.5 ${compact ? "text-[10px]" : "text-xs"} rounded bg-amber-500/20 text-amber-300 border border-amber-500/30`}>
                {match[1]}
              </span>
              <span className={`${compact ? "text-[10px]" : "text-sm"} font-semibold text-amber-300`}>{match[2]}</span>
            </div>
          );
        }
      }
      // [CONCESSION ...]
      if (line.startsWith("[CONCESSION")) {
        const match = line.match(/\[CONCESSION\s*([^:\]]*)?[:\s]*([^\]]*)\]/);
        const concId = match?.[1]?.trim();
        const description = match?.[2]?.trim();
        return (
          <div key={i} className={`flex items-start gap-2 ${compact ? "mb-2" : "mb-3"}`}>
            <span className={`shrink-0 px-1.5 py-0.5 ${compact ? "text-[10px]" : "text-xs"} rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30`}>
              CONCESSION{concId ? ` ${concId}` : ""}
            </span>
            {description && <span className={`${compact ? "text-[10px]" : "text-sm"} font-semibold text-cyan-300`}>{description}</span>}
          </div>
        );
      }
      // [CONVERGENCE ...]
      if (line.startsWith("[CONVERGENCE")) {
        return (
          <div key={i} className={`flex items-center gap-2 ${compact ? "mb-2" : "mb-3"}`}>
            <span className={`px-1.5 py-0.5 ${compact ? "text-[10px]" : "text-xs"} rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30`}>
              CONFIRMED
            </span>
          </div>
        );
      }
      // [REFINEMENT ...]
      if (line.startsWith("[REFINEMENT")) {
        const match = line.match(/\[REFINEMENT\s*([^:\]]*)?[:\s]*([^\]]*)\]/);
        const refId = match?.[1]?.trim();
        const description = match?.[2]?.trim();
        return (
          <div key={i} className={`flex items-start gap-2 ${compact ? "mb-2" : "mb-3"}`}>
            <span className={`shrink-0 px-1.5 py-0.5 ${compact ? "text-[10px]" : "text-xs"} rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30`}>
              REFINEMENT{refId ? ` ${refId}` : ""}
            </span>
            {description && <span className={`${compact ? "text-[10px]" : "text-sm"} font-semibold text-fuchsia-300`}>{description}</span>}
          </div>
        );
      }
      // [RESOLVED ...]
      if (line.startsWith("[RESOLVED")) {
        const resolvedMatch = line.match(/\[RESOLVED\s*([^\]]*)\]\s*(.*)/);
        const tensionId = resolvedMatch?.[1]?.trim();
        const description = resolvedMatch?.[2]?.trim();
        return (
          <div key={i} className={`flex items-start gap-2 ${compact ? "mb-2" : "mb-3"}`}>
            <span className={`shrink-0 px-1.5 py-0.5 ${compact ? "text-[10px]" : "text-xs"} rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30`}>
              RESOLVED{tensionId ? ` ${tensionId}` : ""}
            </span>
            {description && <span className={`${compact ? "text-[10px]" : "text-sm"} font-semibold text-emerald-300`}>{description}</span>}
          </div>
        );
      }
      // Dividers
      if (line.startsWith("---") || line.match(/^\|[-:]+\|/)) return compact ? null : <hr key={i} className="my-3 border-zinc-800" />;
      if (line.match(/^\|[-:\s|]+\|$/)) return null;
      // Table rows
      if (line.startsWith("|") && line.endsWith("|")) {
        const cells = line.split("|").filter(c => c.trim());
        const isHeader = lines[i + 1]?.match(/^\|[-:\s|]+\|$/);
        return (
          <div key={i} className={`grid gap-2 ${compact ? "text-[10px] mb-1" : "text-xs mb-1.5"}`} style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
            {cells.map((cell, ci) => (
              <span key={ci} className={`px-2 py-1 ${isHeader ? "font-semibold text-zinc-300 bg-zinc-800/50" : "text-zinc-400 bg-zinc-900/50"} rounded`}>
                {cell.trim()}
              </span>
            ))}
          </div>
        );
      }
      // Bullet points
      if (line.match(/^[-*]\s/)) {
        const text = line.replace(/^[-*]\s+/, "");
        return (
          <div key={i} className={`flex items-start gap-2 ${compact ? "mb-1" : "mb-2"}`}>
            <span className={`text-violet-400 ${compact ? "text-[10px]" : "text-sm"}`}>-</span>
            <span className={`text-zinc-300 ${compact ? "text-[10px]" : "text-sm"}`}>{renderInlineFormatting(text)}</span>
          </div>
        );
      }
      // Numbered lists
      if (line.match(/^\d+\.\s/)) {
        const match = line.match(/^(\d+)\.\s+(.*)/);
        if (match) {
          return (
            <div key={i} className={`flex items-start gap-2 ${compact ? "mb-1" : "mb-2"}`}>
              <span className={`text-violet-400 font-medium ${compact ? "text-[10px] min-w-[14px]" : "text-sm min-w-[18px]"}`}>{match[1]}.</span>
              <span className={`text-zinc-300 ${compact ? "text-[10px]" : "text-sm"}`}>{renderInlineFormatting(match[2])}</span>
            </div>
          );
        }
      }
      // Regular text
      if (line.trim() && !line.startsWith("#") && !line.startsWith("FILE_WRITTEN") && !line.startsWith("Status:") && !line.startsWith("Claim:")) {
        return (
          <p key={i} className={`text-zinc-300 ${compact ? "text-[11px] leading-relaxed mb-1.5" : "text-sm leading-relaxed mb-3"}`}>
            {renderInlineFormatting(line)}
          </p>
        );
      }
      return null;
    });
  };

  if (!dialogueExport || !contentLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-zinc-400 mb-2">Loading dialogue...</div>
          <div className="text-xs text-zinc-600">Preloading expert content</div>
        </div>
      </div>
    );
  }

  const { dialogue, convergence, panel, tensions_resolved, rounds, verdict } = dialogueExport;
  const currentRoundData = rounds[currentRound];
  const isConvergenceRound = currentRound === convergence.rounds - 1;

  // Calculate cumulative score up to current round
  const cumulativeScore = rounds.slice(0, currentRound + 1).reduce((sum, r) => sum + r.score, 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-12 px-6 gradient-bg">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-fuchsia-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to About
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {dialogue.title}
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            {dialogue.question}
          </p>
        </div>
      </section>

      {/* Context Panel */}
      <section className="py-4 px-6 bg-zinc-950 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Question at Hand - always visible */}
          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <div className="text-xs text-violet-400 uppercase tracking-wider mb-1">Question at Hand</div>
            <div className="text-sm text-white font-medium">{dialogue.question}</div>
          </div>

          <button
            onClick={() => setExpandedContext(!expandedContext)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Portfolio Context</div>
                  <div className="text-xs text-zinc-400">{candidate?.portfolio?.name || "Acme Trust"} | ${(candidate?.portfolio?.totalValue || 1000000).toLocaleString()}</div>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-zinc-400 transition-transform ${expandedContext ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {expandedContext && candidate && (
            <div className="mt-4 p-6 rounded-xl bg-zinc-900/30 border border-white/5">
              {/* Summary Row */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-3">Portfolio Summary</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">Total Value</span>
                      <span className="text-zinc-300">${candidate.portfolio.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">Cash Position</span>
                      <span className="text-zinc-300">${candidate.portfolio.cashPosition.toLocaleString()} ({(candidate.portfolio.cashWeight * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">Tech Exposure</span>
                      <span className="text-amber-400">17.2%</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-zinc-500">Last Updated</span>
                      <span className="text-zinc-300">{candidate.portfolio.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-3">Candidate: {candidate.ticker}</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">Current Price</span>
                      <span className="text-zinc-300">${candidate.currentPrice}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">P/E Ratio</span>
                      <span className="text-amber-400">{candidate.peRatio}x</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">Revenue Growth</span>
                      <span className="text-emerald-400">{candidate.financials?.revenue?.growth || "+122%"}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-zinc-500">ESG Rating</span>
                      <span className="text-emerald-400">{candidate.esgRating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Holdings Table */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-3">Current Holdings</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 px-2 text-zinc-500 font-medium">Ticker</th>
                        <th className="text-left py-2 px-2 text-zinc-500 font-medium">Name</th>
                        <th className="text-left py-2 px-2 text-zinc-500 font-medium">Sector</th>
                        <th className="text-right py-2 px-2 text-zinc-500 font-medium">Value</th>
                        <th className="text-right py-2 px-2 text-zinc-500 font-medium">Weight</th>
                        <th className="text-right py-2 px-2 text-zinc-500 font-medium">Gain</th>
                        <th className="text-center py-2 px-2 text-zinc-500 font-medium">ESG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidate.portfolio.holdings.map((holding) => (
                        <tr key={holding.ticker} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                          <td className="py-2 px-2 font-medium text-violet-300">{holding.ticker}</td>
                          <td className="py-2 px-2 text-zinc-300">{holding.name}</td>
                          <td className="py-2 px-2 text-zinc-400">{holding.sector}</td>
                          <td className="py-2 px-2 text-right text-zinc-300">${holding.value.toLocaleString()}</td>
                          <td className="py-2 px-2 text-right text-zinc-400">{(holding.weight * 100).toFixed(1)}%</td>
                          <td className={`py-2 px-2 text-right ${holding.gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {holding.gain >= 0 ? "+" : ""}{holding.gain.toFixed(1)}%
                          </td>
                          <td className={`py-2 px-2 text-center ${
                            holding.esgRating.startsWith("A") ? "text-emerald-400" :
                            holding.esgRating.startsWith("B") ? "text-cyan-400" :
                            holding.esgRating.startsWith("C") ? "text-amber-400" :
                            "text-red-400"
                          }`}>{holding.esgRating}</td>
                        </tr>
                      ))}
                      {/* Cash row */}
                      <tr className="border-b border-zinc-800/50 bg-zinc-800/20">
                        <td className="py-2 px-2 font-medium text-zinc-400">CASH</td>
                        <td className="py-2 px-2 text-zinc-400">Cash & Equivalents</td>
                        <td className="py-2 px-2 text-zinc-500">—</td>
                        <td className="py-2 px-2 text-right text-zinc-300">${candidate.portfolio.cashPosition.toLocaleString()}</td>
                        <td className="py-2 px-2 text-right text-zinc-400">{(candidate.portfolio.cashWeight * 100).toFixed(1)}%</td>
                        <td className="py-2 px-2 text-right text-zinc-500">—</td>
                        <td className="py-2 px-2 text-center text-zinc-500">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scoreboard Header */}
      <section className="py-6 px-6 bg-zinc-950 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="p-6 rounded-xl bg-gradient-to-r from-violet-950/40 to-fuchsia-950/40 border border-violet-500/20">
            {/* Top row: Round selector pills */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {rounds.map((r, idx) => (
                <button
                  key={r.round}
                  onClick={() => setCurrentRound(idx)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    currentRound === idx
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                      : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  <span className="sm:hidden">R{r.round}</span>
                  <span className="hidden sm:inline">Round {r.round}</span>
                  {idx === convergence.rounds - 1 && r.convergence_percent === 100 && (
                    <span className="ml-1 text-emerald-400">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Score and WCTR breakdown */}
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              {/* Left: Round info */}
              <div className="text-center md:text-left">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Round {currentRoundData.round} Score</div>
                <div className="text-4xl font-bold text-emerald-400">+{currentRoundData.score}</div>
                {currentRoundData.velocity > 0 && (
                  <div
                    className="relative inline-flex items-center justify-center md:justify-start gap-1 mt-1 cursor-pointer"
                    onClick={() => setActiveTooltip(activeTooltip === "velocity" ? null : "velocity")}
                  >
                    <span className="text-emerald-400 text-sm">+{currentRoundData.velocity}</span>
                    <span className="text-zinc-500 text-sm">velocity</span>
                    {/* Popup */}
                    {activeTooltip === "velocity" && (
                      <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 w-56 z-50 shadow-xl">
                        <div className="font-semibold text-emerald-300 mb-1">Velocity</div>
                        <div className="text-zinc-400">New perspectives + open tensions this round. When velocity approaches zero, the dialogue is converging.</div>
                        <div className="absolute top-full left-6 border-4 border-transparent border-t-zinc-800" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Center: WCTR breakdown */}
              {currentRoundData.breakdown && (
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {[
                    { key: "wisdom", label: "Wisdom", short: "W", color: "violet", tooltip: "How many perspectives were integrated? How well synthesized into unity?" },
                    { key: "consistency", label: "Consistency", short: "C", color: "cyan", tooltip: "Does it follow established patterns? Internally consistent?" },
                    { key: "truth", label: "Truth", short: "T", color: "amber", tooltip: "Grounded in reality? Single source of truth? No contradictions?" },
                    { key: "relationships", label: "Relationships", short: "R", color: "emerald", tooltip: "How does it connect to other artifacts? Graph completeness?" },
                  ].map(({ key, label, short, color, tooltip }) => (
                    <div
                      key={key}
                      className="relative text-center cursor-pointer"
                      onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
                    >
                      <div className={`w-14 h-14 sm:w-20 sm:h-16 rounded-lg bg-${color}-500/20 border border-${color}-500/30 flex flex-col items-center justify-center transition-all ${activeTooltip === key ? `ring-2 ring-${color}-500/50` : ""}`}>
                        <span className={`text-lg sm:text-xl font-bold text-${color}-300`}>
                          {currentRoundData.breakdown![key as keyof typeof currentRoundData.breakdown]}
                        </span>
                        <span className={`text-[8px] sm:text-[9px] text-${color}-400/70`}>
                          <span className="sm:hidden">{short}</span>
                          <span className="hidden sm:inline">{label}</span>
                        </span>
                      </div>
                      {/* Popup */}
                      {activeTooltip === key && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 w-48 z-50 shadow-xl">
                          <div className={`font-semibold text-${color}-300 mb-1`}>{label}</div>
                          <div className="text-zinc-400">{tooltip}</div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Right: Cumulative and convergence */}
              <div className="text-center md:text-right">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Cumulative</div>
                <div className="text-2xl font-semibold text-zinc-300">
                  {cumulativeScore} <span className="text-zinc-600">/ {convergence.total_alignment}</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-center md:justify-end gap-2">
                    <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.round((cumulativeScore / convergence.total_alignment) * 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${cumulativeScore === convergence.total_alignment ? "text-emerald-400" : "text-zinc-400"}`}>
                      {Math.round((cumulativeScore / convergence.total_alignment) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Round summary */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-sm text-zinc-400">
                {currentRoundData.summary.split(/(\[MOVE:CONVERGE\])/).map((part, i) =>
                  part === "[MOVE:CONVERGE]" ? (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 mx-1 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      CONVERGE
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* Tensions */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-4">Tensions ({tensions_resolved.length})</h3>
                <div className="space-y-3">
                  {tensions_resolved.map((tension) => {
                    const isResolvedByNow = tension.round_resolved <= currentRound;
                    return (
                      <div key={tension.id} className="text-xs">
                        <div className="flex items-start gap-2 mb-1">
                          <span className={`mt-0.5 ${isResolvedByNow ? "text-emerald-400" : "text-amber-400"}`}>
                            {isResolvedByNow ? "✓" : "○"}
                          </span>
                          <div>
                            <span className="text-zinc-500">{tension.id}:</span>{" "}
                            <span className={isResolvedByNow ? "text-zinc-500" : "text-zinc-300"}>
                              {tension.label}
                            </span>
                          </div>
                        </div>
                        {isResolvedByNow && (
                          <div className="ml-5 text-[10px] text-emerald-400/70 italic">
                            R{tension.round_resolved}: {tension.resolution}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verdict (shown on convergence round) */}
              {isConvergenceRound && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 border border-emerald-500/30">
                  <h3 className="text-xs uppercase tracking-wider text-emerald-400 mb-3">Final Verdict</h3>
                  <div className="text-lg font-bold text-white mb-2">{verdict.recommendation}</div>
                  <div className="text-xs text-zinc-400 mb-3">{verdict.description}</div>
                  <div className="space-y-1.5">
                    {verdict.grounds.map((ground, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px]">
                        <span className="text-emerald-400">-</span>
                        <span className="text-zinc-300">{ground}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
              {/* Round Summary */}
              {roundSummaries[currentRound] && (
                <div className="rounded-xl bg-zinc-900/50 border border-blue-500/20 overflow-hidden">
                  <button
                    onClick={() => setSummaryExpanded(!summaryExpanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💙</span>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-blue-300">Judge Synthesis</div>
                        <div className="text-xs text-zinc-500">Round {currentRound} Summary</div>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-zinc-400 transition-transform ${summaryExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {summaryExpanded && (
                    <div className="px-4 pb-4 prose prose-sm prose-invert max-w-none relative">
                      <div
                        ref={summaryScrollRef}
                        className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-500/50 [&::-webkit-scrollbar-thumb]:rounded-full"
                        onScroll={(e) => {
                          const el = e.currentTarget;
                          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
                          setCanScrollMore(!atBottom);
                        }}
                      >
                        {renderExpertContent(roundSummaries[currentRound])}
                      </div>
                      {/* Scroll down indicator */}
                      {canScrollMore && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                          <span className="text-xs text-blue-400 mb-1">Scroll for more</span>
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Expert Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-zinc-300">Expert Panel ({panel.length})</h3>
                  <div className="flex items-center gap-2">
                    {(["Core", "Adjacent", "Wildcard"] as const).map((tier) => {
                      const count = panel.filter(e => e.tier === tier).length;
                      const color = getTierColor(tier);
                      return (
                        <span key={tier} className={`px-2 py-0.5 text-[10px] rounded bg-${color}-500/20 text-${color}-400`}>
                          {count} {tier}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {/* Mobile: Stack with inline detail */}
                <div className="sm:hidden space-y-3">
                  {panel.map((expert) => {
                    const isSelected = selectedExpert === expert.name.toLowerCase();
                    const tierColor = getTierColor(expert.tier);
                    const emoji = PASTRY_EMOJI[expert.name.toLowerCase()] || "🧁";
                    const roundScore = expert.round_scores?.[currentRound];

                    return (
                      <div key={expert.name}>
                        <button
                          onClick={() => setSelectedExpert(isSelected ? null : expert.name.toLowerCase())}
                          className={`w-full p-4 rounded-xl text-left transition-all ${
                            isSelected
                              ? "bg-violet-500/20 border-2 border-violet-500/50"
                              : "bg-zinc-900/50 border border-white/5"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{emoji}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white truncate">{expert.name}</span>
                                <span className={`px-1 py-0.5 text-[8px] rounded bg-${tierColor}-500/20 text-${tierColor}-300`}>
                                  {expert.tier[0]}
                                </span>
                              </div>
                              <div className="text-[11px] text-zinc-500 truncate">{expert.role}</div>
                              <div className="mt-2 flex items-center gap-2">
                                {roundScore !== undefined && (
                                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/30 text-emerald-300 rounded">
                                    R{currentRound}: +{roundScore}
                                  </span>
                                )}
                                <span className="text-[10px] text-zinc-500">
                                  Total: {expert.round_scores?.slice(0, currentRound + 1).reduce((sum, s) => sum + s, 0) || 0}
                                </span>
                              </div>
                            </div>
                            <svg className={`w-5 h-5 text-zinc-400 transition-transform ${isSelected ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        {/* Inline detail for mobile */}
                        {isSelected && (
                          <div className="mt-2 p-4 rounded-xl bg-zinc-900/50 border border-violet-500/20">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <div className="flex items-center bg-zinc-800 rounded-lg p-0.5">
                                <button
                                  onClick={() => setViewMode("raw")}
                                  className={`px-2 py-1 text-xs rounded-md ${viewMode === "raw" ? "bg-violet-500 text-white" : "text-zinc-400"}`}
                                >
                                  Raw
                                </button>
                                <button
                                  onClick={() => setViewMode("summary")}
                                  className={`px-2 py-1 text-xs rounded-md ${viewMode === "summary" ? "bg-violet-500 text-white" : "text-zinc-400"}`}
                                >
                                  Summary
                                </button>
                              </div>
                              <div className="flex items-center gap-1 flex-wrap">
                                {expert.round_scores?.map((score, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setCurrentRound(idx)}
                                    className={`px-2 py-1 text-[10px] rounded ${idx === currentRound ? "bg-emerald-500/30 text-emerald-300" : "bg-zinc-800 text-zinc-500"}`}
                                  >
                                    R{idx}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="prose prose-sm prose-invert max-w-none max-h-[300px] overflow-y-auto">
                              {viewMode === "raw" ? (
                                getExpertContent(currentRound, expert.name.toLowerCase()) ? (
                                  renderExpertContent(getExpertContent(currentRound, expert.name.toLowerCase()), true)
                                ) : (
                                  <div className="text-zinc-500 italic text-xs">No content for this round.</div>
                                )
                              ) : (
                                <div className="space-y-2">
                                  {dialogueExport.key_perspectives
                                    .filter(p => p.agent.toLowerCase() === expert.name.toLowerCase() && p.round === currentRound)
                                    .map(p => (
                                      <div key={p.id} className="p-2 rounded-lg bg-zinc-800/50 text-xs">
                                        <div className="text-violet-400 mb-1">{p.id}: {p.label}</div>
                                        <div className="text-zinc-300">{p.content}</div>
                                      </div>
                                    ))}
                                  {dialogueExport.key_perspectives.filter(p => p.agent.toLowerCase() === expert.name.toLowerCase() && p.round === currentRound).length === 0 && (
                                    <div className="text-zinc-500 italic text-xs">No key perspectives. View Raw for full contribution.</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: Grid with detail below */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {panel.map((expert) => {
                    const isSelected = selectedExpert === expert.name.toLowerCase();
                    const tierColor = getTierColor(expert.tier);
                    const emoji = PASTRY_EMOJI[expert.name.toLowerCase()] || "🧁";
                    const roundScore = expert.round_scores?.[currentRound];

                    return (
                      <button
                        key={expert.name}
                        onClick={() => setSelectedExpert(isSelected ? null : expert.name.toLowerCase())}
                        className={`p-4 rounded-xl text-left transition-all ${
                          isSelected
                            ? "bg-violet-500/20 border-2 border-violet-500/50 ring-2 ring-violet-500/20"
                            : "bg-zinc-900/50 border border-white/5 hover:border-violet-500/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white truncate">{expert.name}</span>
                              <span className={`px-1 py-0.5 text-[8px] rounded bg-${tierColor}-500/20 text-${tierColor}-300`}>
                                {expert.tier[0]}
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-500 truncate">{expert.role}</div>
                            <div className="mt-2 flex items-center gap-2">
                              {roundScore !== undefined && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/30 text-emerald-300 rounded">
                                  R{currentRound}: +{roundScore}
                                </span>
                              )}
                              <span className="text-[10px] text-zinc-500">
                                Total: {expert.round_scores?.slice(0, currentRound + 1).reduce((sum, s) => sum + s, 0) || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expert Detail - Desktop only */}
              {selectedExpert && (
                <div className="hidden sm:block p-6 rounded-xl bg-zinc-900/50 border border-violet-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {PASTRY_EMOJI[selectedExpert] || "🧁"}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white capitalize">
                          {selectedExpert}
                        </div>
                        <div className="text-sm text-zinc-400">
                          {panel.find(e => e.name.toLowerCase() === selectedExpert)?.role} | Round {currentRound}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* View mode toggle */}
                      <div className="flex items-center bg-zinc-800 rounded-lg p-0.5">
                        <button
                          onClick={() => setViewMode("raw")}
                          className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                            viewMode === "raw" ? "bg-violet-500 text-white" : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          Raw Output
                        </button>
                        <button
                          onClick={() => setViewMode("summary")}
                          className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                            viewMode === "summary" ? "bg-violet-500 text-white" : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          Summary
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedExpert(null)}
                        className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Round scores */}
                  <div className="flex items-center gap-1 mb-4 pb-4 border-b border-zinc-800">
                    {panel.find(e => e.name.toLowerCase() === selectedExpert)?.round_scores?.map((score, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentRound(idx)}
                        className={`px-2 py-1 text-xs rounded ${
                          idx === currentRound
                            ? "bg-emerald-500/30 text-emerald-300 font-medium"
                            : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                        }`}
                      >
                        R{idx}: +{score}
                      </button>
                    ))}
                    <span className="ml-2 text-xs text-zinc-500">
                      Total: <span className="text-emerald-400 font-medium">{panel.find(e => e.name.toLowerCase() === selectedExpert)?.round_scores?.slice(0, currentRound + 1).reduce((sum, s) => sum + s, 0) || 0}</span>
                    </span>
                  </div>

                  {/* Content */}
                  <div className="prose prose-sm prose-invert max-w-none max-h-[500px] overflow-y-auto pr-2">
                    {viewMode === "raw" ? (
                      getExpertContent(currentRound, selectedExpert) ? (
                        renderExpertContent(getExpertContent(currentRound, selectedExpert))
                      ) : (
                        <div className="text-zinc-500 italic">No content for this round.</div>
                      )
                    ) : (
                      <div className="space-y-3">
                        {dialogueExport.key_perspectives
                          .filter(p => p.agent.toLowerCase() === selectedExpert && p.round === currentRound)
                          .map(p => (
                            <div key={p.id} className="p-3 rounded-lg bg-zinc-800/50">
                              <div className="text-xs text-violet-400 mb-1">{p.id}: {p.label}</div>
                              <div className="text-sm text-zinc-300">{p.content}</div>
                            </div>
                          ))}
                        {dialogueExport.key_perspectives.filter(p => p.agent.toLowerCase() === selectedExpert && p.round === currentRound).length === 0 && (
                          <div className="text-zinc-500 italic">No key perspectives recorded for this round. View Raw Output for full contribution.</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Round navigation */}
                  <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <button
                      onClick={() => currentRound > 0 && setCurrentRound(currentRound - 1)}
                      disabled={currentRound === 0}
                      className={`flex items-center gap-1 text-sm ${currentRound === 0 ? "text-zinc-600 cursor-not-allowed" : "text-zinc-400 hover:text-white"}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous Round
                    </button>
                    <button
                      onClick={() => currentRound < convergence.rounds - 1 && setCurrentRound(currentRound + 1)}
                      disabled={currentRound === convergence.rounds - 1}
                      className={`flex items-center gap-1 text-sm ${currentRound === convergence.rounds - 1 ? "text-zinc-600 cursor-not-allowed" : "text-zinc-400 hover:text-white"}`}
                    >
                      Next Round
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Prompt to select expert */}
              {!selectedExpert && (
                <div className="hidden sm:flex flex-col items-center p-8 rounded-xl bg-gradient-to-b from-violet-500/5 to-transparent border border-dashed border-violet-500/30 text-center">
                  <svg className="w-8 h-8 text-violet-400 mb-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <div className="text-violet-300 font-medium">Select an expert above</div>
                  <div className="text-zinc-500 text-sm mt-1">View their contribution for Round {currentRound}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-zinc-950 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready for <span className="gradient-text">Your Domain</span>?
          </h2>
          <p className="text-zinc-400 mb-6">
            This demo shows investment deliberation, but the architecture adapts to any complex, multi-faceted decision.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all"
            >
              Get in Touch
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
