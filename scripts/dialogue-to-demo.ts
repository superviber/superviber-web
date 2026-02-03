#!/usr/bin/env npx tsx

/**
 * Alignment Dialogue to Demo Asset Generator
 *
 * RFC 0010: Transforms raw dialogue files from /tmp/blue-dialogue/{slug}/
 * into demo-ready JSON assets for /public/demo/dialogues/{slug}/
 *
 * Usage: npx tsx scripts/dialogue-to-demo.ts --slug <slug>
 *
 * Features:
 * - Validation with structured warnings
 * - Idempotent output (deterministic P/T IDs)
 * - Global P/T numbering across rounds
 * - Tiered visibility (admin vs public)
 */

import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Types
// =============================================================================

interface Expert {
  id: string;
  name: string;
  emoji: string;
  role: string;
  tier: string;
  relevance: number;
  focus: string;
  color: string;
  selected: boolean;
  score: number | null;
  roundScores: number[] | null;
}

interface ExpertPool {
  domain: string;
  dialogueId: string;
  panelSize: number;
  poolSize: number;
  tierDistribution: Record<string, number>;
  experts: Expert[];
}

interface Perspective {
  id: string;
  expert: string;
  label: string;
  content: string;
  round: number;
}

interface Tension {
  id: string;
  label: string;
  status: string;
  raisedBy: string;
  resolution?: string;
  round: number;
}

interface PerspectiveWithStatus {
  id: string;
  expert: string;
  label: string;
  content: string;
  status: 'open' | 'refined' | 'resolved' | 'conceded';
  resolution?: string;
  resolvedInRound?: number;
}

interface RoundData {
  round: number;
  title: string;
  score: number;
  velocity: number | null;
  summary: string;
  perspectives: PerspectiveWithStatus[];
}

interface DialogueOutput {
  id: string;
  title: string;
  question: string;
  date: string;
  status: string;
  rounds: number;
  totalAlignment: number;
  verdict: {
    recommendation: string;
    vote: string;
    confidence: string;
  };
  experts: { id: string; name: string; emoji: string; role: string; tier: string; score: number; color: string }[];
  rounds_data: RoundData[];
  tensions: { id: string; label: string; status: string; resolution?: string }[];
  keyInsights: { title: string; expert: string; emoji: string; description: string }[];
}

interface Warning {
  type: 'missing_file' | 'parse_error' | 'validation_error';
  file: string;
  message: string;
}

// =============================================================================
// Constants
// =============================================================================

const PASTRY_NAMES = [
  'muffin', 'cupcake', 'scone', 'eclair', 'donut', 'brioche', 'croissant',
  'macaron', 'cannoli', 'strudel', 'beignet', 'churro', 'profiterole',
  'tartlet', 'galette', 'palmier', 'kouign', 'sfogliatella', 'financier', 'religieuse'
];

const EXPERT_COLORS = [
  '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#6366F1',
  '#EC4899', '#14B8A6', '#F97316', '#0EA5E9', '#84CC16', '#A855F7',
  '#64748B', '#78716C', '#71717A', '#737373', '#6B7280', '#9CA3AF',
  '#A1A1AA', '#A3A3A3'
];

const ROUND_TITLES = ['Opening Arguments', 'Framework Development', 'Convergence', 'Final Resolution'];

// =============================================================================
// Parsing Functions
// =============================================================================

function parseExpertPool(inputDir: string, warnings: Warning[]): ExpertPool | null {
  const poolPath = path.join(inputDir, 'expert-pool.json');

  if (!fs.existsSync(poolPath)) {
    warnings.push({ type: 'missing_file', file: poolPath, message: 'Expert pool file not found' });
    return null;
  }

  try {
    const content = fs.readFileSync(poolPath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    warnings.push({ type: 'parse_error', file: poolPath, message: `Failed to parse: ${e}` });
    return null;
  }
}

function parseScoreboard(inputDir: string, warnings: Warning[]): {
  totalAlignment: number;
  roundScores: { round: number; score: number; velocity: number | null }[];
  expertScores: Record<string, { total: number; roundScores: number[]; role?: string; tier?: string }>;
} {
  const scoreboardPath = path.join(inputDir, 'scoreboard.md');

  const result = {
    totalAlignment: 0,
    roundScores: [] as { round: number; score: number; velocity: number | null }[],
    expertScores: {} as Record<string, { total: number; roundScores: number[]; role?: string; tier?: string }>
  };

  if (!fs.existsSync(scoreboardPath)) {
    warnings.push({ type: 'missing_file', file: scoreboardPath, message: 'Scoreboard file not found' });
    return result;
  }

  try {
    const content = fs.readFileSync(scoreboardPath, 'utf-8');

    // Parse total alignment
    const totalMatch = content.match(/\*\*Total ALIGNMENT\*\*:\s*(\d+)/i) ||
                       content.match(/Total ALIGNMENT:\s*(\d+)/i);
    if (totalMatch) {
      result.totalAlignment = parseInt(totalMatch[1], 10);
    }

    // Parse round summary table
    const roundTableMatch = content.match(/\|\s*Round\s*\|.*?\n\|[-|\s]+\n((?:\|.*?\n)+)/i);
    if (roundTableMatch) {
      const rows = roundTableMatch[1].trim().split('\n');
      for (const row of rows) {
        const cells = row.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 3) {
          const round = parseInt(cells[0], 10);
          const score = parseInt(cells[1], 10);
          const velocityStr = cells[2];
          const velocity = velocityStr === '—' || velocityStr === '-' ? null : parseInt(velocityStr, 10);
          if (!isNaN(round) && !isNaN(score)) {
            result.roundScores.push({ round, score, velocity });
          }
        }
      }
    }

    // Parse agent scores table
    const agentTableMatch = content.match(/\|\s*Agent\s*\|.*?\n\|[-|\s]+\n((?:\|.*?\n)+)/i);
    if (agentTableMatch) {
      const rows = agentTableMatch[1].trim().split('\n');
      for (const row of rows) {
        const cells = row.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 4) {
          // Extract expert name (remove emoji)
          const nameMatch = cells[0].match(/🧁?\s*(\w+)/);
          if (nameMatch) {
            const name = nameMatch[1].toLowerCase();
            const role = cells[1] || 'Expert';
            const roundScores: number[] = [];

            // Parse round scores (columns after Role and Tier, before Total)
            for (let i = 3; i < cells.length - 1; i++) {
              const score = parseInt(cells[i], 10);
              if (!isNaN(score)) {
                roundScores.push(score);
              }
            }

            // Total is last column
            const totalStr = cells[cells.length - 1].replace(/\*\*/g, '');
            const total = parseInt(totalStr, 10);

            // Get tier from column 2 (index 2)
            const tier = cells[2] || 'Core';

            if (!isNaN(total)) {
              result.expertScores[name] = { total, roundScores, role, tier };
            }
          }
        }
      }
    }
  } catch (e) {
    warnings.push({ type: 'parse_error', file: scoreboardPath, message: `Failed to parse: ${e}` });
  }

  return result;
}

function parseTensions(inputDir: string, warnings: Warning[]): Tension[] {
  const tensionsPath = path.join(inputDir, 'tensions.md');
  const tensions: Tension[] = [];

  if (!fs.existsSync(tensionsPath)) {
    warnings.push({ type: 'missing_file', file: tensionsPath, message: 'Tensions file not found' });
    return tensions;
  }

  try {
    const content = fs.readFileSync(tensionsPath, 'utf-8');

    // Parse tensions table - handle both 4 and 5 column formats
    // Format 1: | ID | Tension | Status | Resolution |
    // Format 2: | ID | Tension | Status | Raised By | Resolution |
    const tableMatch = content.match(/\|\s*ID\s*\|[^\n]+\n\|[-|\s]+\n((?:\|[^\n]+\n?)+)/i);
    if (tableMatch) {
      const rows = tableMatch[1].trim().split('\n');
      for (const row of rows) {
        const cells = row.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 3) {
          const id = cells[0]; // T01, T02, etc.
          const label = cells[1];
          const statusRaw = cells[2].replace(/\*\*/g, '').toLowerCase();

          // Check if 4th column is "Raised By" or "Resolution"
          let raisedBy = '';
          let resolution: string | undefined;

          if (cells.length === 4) {
            // Could be either format - check if it looks like a name
            const col3 = cells[3];
            if (col3.includes('🧁') || PASTRY_NAMES.some(n => col3.toLowerCase().includes(n))) {
              raisedBy = col3;
            } else {
              resolution = col3;
            }
          } else if (cells.length >= 5) {
            raisedBy = cells[3];
            resolution = cells[4];
          }

          if (id.match(/T\d+/)) {
            tensions.push({
              id,
              label,
              status: statusRaw.includes('resolved') ? 'resolved' :
                      statusRaw.includes('accepted') ? 'accepted' : 'open',
              raisedBy,
              resolution,
              round: 0
            });
          }
        }
      }
    }
  } catch (e) {
    warnings.push({ type: 'parse_error', file: tensionsPath, message: `Failed to parse: ${e}` });
  }

  return tensions;
}

interface GlobalPerspective {
  id: string;
  expert: string;
  label: string;
  round: number;
}

interface RoundResolutions {
  resolvedPerspectives: { id: string; resolution: string }[];
  concessions: { expert: string; description: string }[];
  refinements: { expert: string; description: string }[];
}

function parseRoundSummary(inputDir: string, round: number, warnings: Warning[]): {
  summary: string;
  perspectives: GlobalPerspective[];
  resolutions: RoundResolutions;
} {
  const summaryPath = path.join(inputDir, `round-${round}.summary.md`);
  const result = {
    summary: '',
    perspectives: [] as GlobalPerspective[],
    resolutions: {
      resolvedPerspectives: [] as { id: string; resolution: string }[],
      concessions: [] as { expert: string; description: string }[],
      refinements: [] as { expert: string; description: string }[]
    } as RoundResolutions
  };

  if (!fs.existsSync(summaryPath)) {
    warnings.push({ type: 'missing_file', file: summaryPath, message: `Round ${round} summary not found` });
    return result;
  }

  try {
    const content = fs.readFileSync(summaryPath, 'utf-8');

    // Extract summary from Panel Position or Key Development
    const panelMatch = content.match(/##\s*Panel Position[:\s]*([^\n]+)/i);
    if (panelMatch) {
      result.summary = panelMatch[1].trim();
    } else {
      const developmentMatch = content.match(/Key Development[:\s]*\n+(.+?)(?:\n\n|\n#|$)/i);
      if (developmentMatch) {
        result.summary = developmentMatch[1].trim();
      } else {
        // Fallback: first substantial paragraph
        const paragraphs = content.split(/\n\n+/).filter(p => p.trim() && !p.startsWith('#'));
        if (paragraphs.length > 0) {
          result.summary = paragraphs[0].replace(/\n/g, ' ').trim().slice(0, 200);
        }
      }
    }

    // Parse Perspectives Inventory table
    // Format: | ID | Agent | Perspective |
    const perspectivesMatch = content.match(/##\s*Perspectives Inventory[^\n]*\n+\|[^\n]+\n\|[-|\s]+\n((?:\|[^\n]+\n?)+)/i);
    if (perspectivesMatch) {
      const rows = perspectivesMatch[1].trim().split('\n');
      for (const row of rows) {
        const cells = row.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 3) {
          const id = cells[0]; // P01, P02, etc.
          const expertRaw = cells[1]; // "Muffin" or "🧁 Muffin"
          const label = cells[2];

          // Extract expert name (remove emoji if present)
          const expertMatch = expertRaw.match(/🧁?\s*(\w+)/);
          const expert = expertMatch ? expertMatch[1].toLowerCase() : expertRaw.toLowerCase();

          if (id.match(/P\d+/)) {
            result.perspectives.push({ id, expert, label, round });
          }
        }
      }
    }

    // Parse Concessions Made table
    // Format: | Agent | Concession |
    const concessionsMatch = content.match(/##\s*Concessions Made[^\n]*\n+\|[^\n]+\n\|[-|\s]+\n((?:\|[^\n]+\n?)+)/i);
    if (concessionsMatch) {
      const rows = concessionsMatch[1].trim().split('\n');
      for (const row of rows) {
        const cells = row.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 2) {
          const expertRaw = cells[0];
          const description = cells[1];
          const expertMatch = expertRaw.match(/🧁?\s*(\w+)/);
          const expert = expertMatch ? expertMatch[1].toLowerCase() : expertRaw.toLowerCase();
          result.resolutions.concessions.push({ expert, description });
        }
      }
    }

    // Parse "Tensions Resolved" section for perspective resolutions
    // Format: - **T03, T04, T07**: Description
    // or: - **P01**: Description
    const resolvedMatch = content.match(/##\s*Tensions Resolved[^\n]*\n+((?:[-*]\s+\*\*[^\n]+\n?)+)/i);
    if (resolvedMatch) {
      const lines = resolvedMatch[1].trim().split('\n');
      for (const line of lines) {
        const match = line.match(/[-*]\s+\*\*([^*]+)\*\*[:\s]*(.+)/);
        if (match) {
          const ids = match[1].split(/[,\s]+/).filter(id => id.match(/[PT]\d+/));
          const resolution = match[2].trim();
          for (const id of ids) {
            if (id.startsWith('P')) {
              result.resolutions.resolvedPerspectives.push({ id, resolution });
            }
          }
        }
      }
    }

    return result;
  } catch (e) {
    warnings.push({ type: 'parse_error', file: summaryPath, message: `Failed to parse: ${e}` });
    return result;
  }
}

interface ParsedExpertContent {
  perspectives: { id: string; label: string; content: string }[];
  tensions: { id: string; label: string }[];
  refinements: { target: string; content: string; perspectiveId?: string }[];
  concessions: { target: string; content: string; perspectiveId?: string }[];
  resolved: string[];
  rawContent: string;
}

function parseExpertContent(content: string): ParsedExpertContent {
  const result: ParsedExpertContent = {
    perspectives: [],
    tensions: [],
    refinements: [],
    concessions: [],
    resolved: [],
    rawContent: content
  };

  // Parse perspectives: [PERSPECTIVE P01: label] or [PERSPECTIVE: label]
  const perspectiveMatches = content.matchAll(/\[PERSPECTIVE\s*(P\d+)?[:\s]+([^\]]+)\]\s*\n?([\s\S]*?)(?=\n\[|---|\n\n\[|$)/gi);
  for (const match of perspectiveMatches) {
    const id = match[1] || '';
    const label = match[2].trim();
    const contentText = match[3]?.trim() || '';
    result.perspectives.push({ id, label, content: contentText });
  }

  // Parse tensions: [TENSION T01: description]
  const tensionMatches = content.matchAll(/\[TENSION\s*(T\d+)?[:\s]+([^\]]+)\]/gi);
  for (const match of tensionMatches) {
    const id = match[1] || '';
    const label = match[2].trim();
    result.tensions.push({ id, label });
  }

  // Parse refinements: [REFINEMENT: description] or [REFINEMENT P01: description]
  const refinementMatches = content.matchAll(/\[REFINEMENT\s*(P\d+)?[:\s]+([^\]]+)\]\s*\n?([\s\S]*?)(?=\n\[|---|\n\n\[|$)/gi);
  for (const match of refinementMatches) {
    const perspectiveId = match[1] || '';
    const description = match[2].trim();
    const contentText = match[3]?.trim() || '';
    result.refinements.push({ target: description, content: contentText, perspectiveId });
  }

  // Parse concessions: [CONCESSION: description] or [CONCESSION P01: description]
  const concessionMatches = content.matchAll(/\[CONCESSION\s*(P\d+)?[:\s]+([^\]]+)\]\s*\n?([\s\S]*?)(?=\n\[|---|\n\n\[|$)/gi);
  for (const match of concessionMatches) {
    const perspectiveId = match[1] || '';
    const description = match[2].trim();
    const contentText = match[3]?.trim() || '';
    result.concessions.push({ target: description, content: contentText, perspectiveId });
  }

  // Parse resolved: [RESOLVED T01] or [RESOLVED T01, T02, T03, T04]
  const resolvedMatches = content.matchAll(/\[RESOLVED\s+([^\]]+)\]/gi);
  for (const match of resolvedMatches) {
    const ids = match[1].split(/[,\s]+/).filter(id => id.match(/T\d+/));
    result.resolved.push(...ids);
  }

  return result;
}

function parseRoundContent(inputDir: string, round: number, warnings: Warning[]): Map<string, string> {
  const roundDir = path.join(inputDir, `round-${round}`);
  const content = new Map<string, string>();

  if (!fs.existsSync(roundDir)) {
    warnings.push({ type: 'missing_file', file: roundDir, message: `Round ${round} directory not found` });
    return content;
  }

  try {
    const files = fs.readdirSync(roundDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const expertName = path.basename(file, '.md').toLowerCase();
      const filePath = path.join(roundDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      content.set(expertName, fileContent);
    }
  } catch (e) {
    warnings.push({ type: 'parse_error', file: roundDir, message: `Failed to read: ${e}` });
  }

  return content;
}

function getRoundCount(inputDir: string): number {
  let round = 0;
  while (fs.existsSync(path.join(inputDir, `round-${round}`))) {
    round++;
  }
  return round;
}

// =============================================================================
// Generation Functions
// =============================================================================

function generateExpertPool(
  pool: ExpertPool | null,
  scoreData: ReturnType<typeof parseScoreboard>,
  selectedExperts: Set<string>,
  slug: string,
  expertRoles: Map<string, string>
): ExpertPool {
  // Check if pool has full expert objects with ids
  const poolHasIds = pool?.experts.some(e => 'id' in e && e.id);

  if (pool && poolHasIds) {
    // Enrich existing pool with scores
    return {
      ...pool,
      dialogueId: slug,
      experts: pool.experts.map(expert => ({
        ...expert,
        selected: selectedExperts.has(expert.id),
        score: scoreData.expertScores[expert.id]?.total ?? null,
        roundScores: scoreData.expertScores[expert.id]?.roundScores ?? null
      }))
    };
  }

  // Generate pool from selected experts (pool file may have roles only, or not exist)
  const experts: Expert[] = [];
  let colorIndex = 0;

  // Get role list from pool if available
  const poolRoles = pool?.experts.map(e => ({
    role: (e as any).role || 'Expert',
    tier: ((e as any).tier || 'Core') as string,
    relevance: (e as any).relevance || 0.8
  })) || [];

  const sortedExperts = Array.from(selectedExperts).sort();
  for (const name of sortedExperts) {
    const scores = scoreData.expertScores[name];
    const roleInfo = poolRoles[colorIndex] || { role: 'Expert', tier: 'Core', relevance: 0.8 };
    const detectedRole = expertRoles.get(name) || scores?.role || roleInfo.role;
    // Prefer tier from scoreboard, then pool
    const detectedTier = scores?.tier || roleInfo.tier;
    const normalizedTier = detectedTier.charAt(0).toUpperCase() + detectedTier.slice(1).toLowerCase();

    experts.push({
      id: name,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      emoji: '🧁',
      role: detectedRole,
      tier: normalizedTier,
      relevance: roleInfo.relevance,
      focus: '',
      color: EXPERT_COLORS[colorIndex % EXPERT_COLORS.length],
      selected: true,
      score: scores?.total ?? null,
      roundScores: scores?.roundScores ?? null
    });
    colorIndex++;
  }

  const tierCounts: Record<string, number> = {};
  for (const e of experts) {
    tierCounts[e.tier] = (tierCounts[e.tier] || 0) + 1;
  }

  return {
    domain: pool?.domain || 'General',
    dialogueId: slug,
    panelSize: experts.length,
    poolSize: pool?.experts.length || experts.length,
    tierDistribution: tierCounts,
    experts
  };
}

function generateDialogue(
  slug: string,
  expertPool: ExpertPool,
  scoreData: ReturnType<typeof parseScoreboard>,
  tensions: Tension[],
  roundsData: RoundData[],
  verdict: string,
  question: string
): DialogueOutput {
  const selectedExperts = expertPool.experts.filter(e => e.selected);
  const expertCount = selectedExperts.length || expertPool.panelSize;

  return {
    id: slug,
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    question,
    date: new Date().toISOString().split('T')[0],
    status: 'converged',
    rounds: roundsData.length,
    totalAlignment: scoreData.totalAlignment,
    verdict: {
      recommendation: verdict,
      vote: `${expertCount}-0`,
      confidence: 'unanimous'
    },
    experts: selectedExperts.map(e => ({
      id: e.id,
      name: e.name,
      emoji: e.emoji,
      role: e.role,
      tier: e.tier,
      score: e.score ?? 0,
      color: e.color
    })),
    rounds_data: roundsData,
    tensions: tensions.map(t => ({
      id: t.id,
      label: t.label,
      status: t.status,
      resolution: t.resolution
    })),
    keyInsights: [] // Could be extracted from convergence round
  };
}

function generateContent(
  roundsContent: Map<number, Map<string, string>>,
  globalPerspectivesByRound: Map<number, GlobalPerspective[]>,
  globalTensions: Tension[]
): { rounds: Record<string, Record<string, string>> } {
  const rounds: Record<string, Record<string, string>> = {};

  // Build tension ID mapping (local T## in expert content -> global T## from tensions.md)
  // This is tricky since expert content may use arbitrary T## numbers
  // For now, we'll keep tension IDs as-is since they should already be global

  for (const [roundNum, expertContent] of roundsContent) {
    rounds[roundNum.toString()] = {};

    // Build perspective renumbering map for this round: expert -> [local index -> global ID]
    const globalPersp = globalPerspectivesByRound.get(roundNum) || [];
    const expertGlobalIds = new Map<string, string[]>();

    for (const gp of globalPersp) {
      if (!expertGlobalIds.has(gp.expert)) {
        expertGlobalIds.set(gp.expert, []);
      }
      expertGlobalIds.get(gp.expert)!.push(gp.id);
    }

    for (const [expert, content] of expertContent) {
      let renumberedContent = content;

      // Get global IDs for this expert in order
      const globalIds = expertGlobalIds.get(expert) || [];

      if (globalIds.length > 0) {
        // Find all [PERSPECTIVE P##: ...] patterns and renumber them
        let perspIndex = 0;
        renumberedContent = renumberedContent.replace(
          /\[PERSPECTIVE\s+P\d+:/gi,
          (match) => {
            if (perspIndex < globalIds.length) {
              const globalId = globalIds[perspIndex];
              perspIndex++;
              return `[PERSPECTIVE ${globalId}:`;
            }
            return match;
          }
        );
      }

      rounds[roundNum.toString()][expert] = renumberedContent;
    }
  }

  return { rounds };
}

// =============================================================================
// Main Function
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf('--slug');

  if (slugIndex === -1 || !args[slugIndex + 1]) {
    console.error('Usage: npx tsx scripts/dialogue-to-demo.ts --slug <slug>');
    console.error('');
    console.error('Options:');
    console.error('  --slug <name>    Dialogue slug (required)');
    console.error('  --input <dir>    Input directory (default: /tmp/blue-dialogue/{slug})');
    console.error('  --output <dir>   Output directory (default: public/demo/dialogues/{slug})');
    console.error('  --dry-run        Show what would be generated without writing');
    process.exit(1);
  }

  const slug = args[slugIndex + 1];
  const inputIndex = args.indexOf('--input');
  const outputIndex = args.indexOf('--output');
  const dryRun = args.includes('--dry-run');

  const inputDir = inputIndex !== -1 && args[inputIndex + 1]
    ? args[inputIndex + 1]
    : `/tmp/blue-dialogue/${slug}`;

  const outputDir = outputIndex !== -1 && args[outputIndex + 1]
    ? args[outputIndex + 1]
    : path.join(process.cwd(), 'public', 'demo', 'dialogues', slug);

  console.log(`\n📁 Input:  ${inputDir}`);
  console.log(`📁 Output: ${outputDir}`);
  console.log('');

  // Validate input directory exists
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Input directory not found: ${inputDir}`);
    process.exit(1);
  }

  const warnings: Warning[] = [];

  // Parse all input files
  console.log('📖 Parsing dialogue files...');

  const pool = parseExpertPool(inputDir, warnings);
  const scoreData = parseScoreboard(inputDir, warnings);
  const tensions = parseTensions(inputDir, warnings);
  const roundCount = getRoundCount(inputDir);

  console.log(`   Found ${roundCount} rounds`);

  // Parse all round content and summaries
  const roundsContent = new Map<number, Map<string, string>>();
  const selectedExperts = new Set<string>();
  const roundsData: RoundData[] = [];
  const allGlobalPerspectives: GlobalPerspective[] = [];
  const globalPerspectivesByRound = new Map<number, GlobalPerspective[]>();
  const perspectiveResolutions = new Map<string, { round: number; resolution: string; status: 'resolved' | 'refined' | 'conceded' }>();

  for (let round = 0; round < roundCount; round++) {
    const content = parseRoundContent(inputDir, round, warnings);
    roundsContent.set(round, content);

    // Track selected experts
    for (const expert of content.keys()) {
      selectedExperts.add(expert);
    }

    // Parse summary and global perspectives from judge's round summary
    const { summary, perspectives: globalPerspectives, resolutions } = parseRoundSummary(inputDir, round, warnings);
    allGlobalPerspectives.push(...globalPerspectives);
    globalPerspectivesByRound.set(round, globalPerspectives);

    // Track concessions and resolutions from judge's summary
    for (const resolved of resolutions.resolvedPerspectives) {
      perspectiveResolutions.set(resolved.id, { round, resolution: resolved.resolution, status: 'resolved' as const });
    }

    // Track refinements and concessions from expert content
    for (const [expert, rawContent] of content) {
      const parsed = parseExpertContent(rawContent);
      for (const ref of parsed.refinements) {
        if (ref.perspectiveId) {
          perspectiveResolutions.set(ref.perspectiveId, { round, resolution: ref.target, status: 'refined' as const });
        }
      }
      for (const con of parsed.concessions) {
        if (con.perspectiveId) {
          perspectiveResolutions.set(con.perspectiveId, { round, resolution: con.target, status: 'conceded' as const });
        }
      }
    }

    // Use global perspectives if available, otherwise fall back to parsing expert content
    let perspectives: PerspectiveWithStatus[] = [];

    if (globalPerspectives.length > 0) {
      // Build a map of expert -> their perspectives in order from their file
      const expertPerspectivesMap = new Map<string, { label: string; content: string }[]>();
      for (const [expert, rawContent] of content) {
        const parsed = parseExpertContent(rawContent);
        expertPerspectivesMap.set(expert, parsed.perspectives.map(p => ({
          label: p.label,
          content: p.content
        })));
      }

      // Track how many perspectives we've used per expert (for order-based matching)
      const expertPerspectiveIndex = new Map<string, number>();

      // Use judge's global numbering, match by expert + order
      for (const gp of globalPerspectives) {
        const expertPersp = expertPerspectivesMap.get(gp.expert) || [];
        const idx = expertPerspectiveIndex.get(gp.expert) || 0;
        const matchingP = expertPersp[idx];

        perspectives.push({
          id: gp.id,
          expert: gp.expert,
          label: gp.label, // Use judge's label (authoritative)
          content: matchingP?.content || '',
          status: 'open', // Will be updated after all rounds are parsed
          resolution: undefined,
          resolvedInRound: undefined
        });

        expertPerspectiveIndex.set(gp.expert, idx + 1);
      }
    } else {
      // Fallback: extract from expert content with auto-generated IDs
      let autoId = 1;
      for (const [expert, rawContent] of content) {
        const parsed = parseExpertContent(rawContent);
        for (const p of parsed.perspectives) {
          perspectives.push({
            id: `P${String(autoId++).padStart(2, '0')}`,
            expert,
            label: p.label,
            content: p.content,
            status: 'open',
            resolution: undefined,
            resolvedInRound: undefined
          });
        }
      }
    }

    // Get round score
    const roundScore = scoreData.roundScores.find(r => r.round === round);

    roundsData.push({
      round,
      title: ROUND_TITLES[round] || `Round ${round}`,
      score: roundScore?.score ?? 0,
      velocity: roundScore?.velocity ?? null,
      summary,
      perspectives // Include ALL perspectives
    });
  }

  // Second pass: Update perspective status based on resolutions from later rounds
  for (const roundData of roundsData) {
    for (const perspective of roundData.perspectives) {
      const resolution = perspectiveResolutions.get(perspective.id);
      if (resolution && resolution.round > roundData.round) {
        perspective.status = resolution.status;
        perspective.resolution = resolution.resolution;
        perspective.resolvedInRound = resolution.round;
      }
    }
  }

  // Generate output files
  console.log('');
  console.log('🔧 Generating output files...');

  // Extract expert roles from scoreboard
  const expertRoles = new Map<string, string>();
  for (const [name, data] of Object.entries(scoreData.expertScores)) {
    if (data.role) {
      expertRoles.set(name, data.role);
    }
  }

  const expertPool = generateExpertPool(pool, scoreData, selectedExperts, slug, expertRoles);
  const contentOutput = generateContent(roundsContent, globalPerspectivesByRound, tensions);

  // Extract verdict from scoreboard (## Recommendation section) or final round summary
  const scoreboardPath = path.join(inputDir, 'scoreboard.md');
  let verdict = '';
  if (fs.existsSync(scoreboardPath)) {
    const scoreboardContent = fs.readFileSync(scoreboardPath, 'utf-8');
    // Look for ## Recommendation section
    const recMatch = scoreboardContent.match(/##\s*Recommendation\s*\n+\*\*([^*]+)\*\*/i);
    if (recMatch) {
      verdict = recMatch[1].trim();
    }
  }
  if (!verdict) {
    const finalSummaryPath = path.join(inputDir, `round-${roundCount - 1}.summary.md`);
    if (fs.existsSync(finalSummaryPath)) {
      const finalContent = fs.readFileSync(finalSummaryPath, 'utf-8');
      // Look for RECOMMENDATION: line
      const recMatch = finalContent.match(/RECOMMENDATION:\s*([^\n]+)/i);
      if (recMatch) {
        verdict = recMatch[1].trim();
      }
    }
  }
  if (!verdict) {
    verdict = 'Convergence achieved';
  }

  // Get question from pool if available
  const question = (pool as any)?.question || '';

  const dialogue = generateDialogue(slug, expertPool, scoreData, tensions, roundsData, verdict, question);

  // Output warnings
  if (warnings.length > 0) {
    console.log('');
    console.log('⚠️  Warnings:');
    for (const w of warnings) {
      console.log(`   ${w.type}: ${w.file}`);
      console.log(`      ${w.message}`);
    }
  }

  // Write output files
  if (dryRun) {
    console.log('');
    console.log('🔍 Dry run - would generate:');
    console.log(`   ${outputDir}/dialogue.json`);
    console.log(`   ${outputDir}/expert-pool.json`);
    console.log(`   ${outputDir}/content.json`);
    console.log('');
    console.log('dialogue.json preview:');
    console.log(JSON.stringify(dialogue, null, 2).slice(0, 500) + '...');
  } else {
    // Create output directory
    fs.mkdirSync(outputDir, { recursive: true });

    // Write files
    const dialoguePath = path.join(outputDir, 'dialogue.json');
    const poolPath = path.join(outputDir, 'expert-pool.json');
    const contentPath = path.join(outputDir, 'content.json');

    fs.writeFileSync(dialoguePath, JSON.stringify(dialogue, null, 2));
    fs.writeFileSync(poolPath, JSON.stringify(expertPool, null, 2));
    fs.writeFileSync(contentPath, JSON.stringify(contentOutput, null, 2));

    console.log(`   ✅ ${dialoguePath}`);
    console.log(`   ✅ ${poolPath}`);
    console.log(`   ✅ ${contentPath}`);
  }

  console.log('');
  console.log(`✨ Done! Generated ${roundCount} rounds with ${selectedExperts.size} experts.`);
  console.log(`   Total ALIGNMENT: ${scoreData.totalAlignment}`);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
