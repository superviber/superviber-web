# Spike: Mcp Tool Enforcement Cross Repo

| | |
|---|---|
| **Status** | In Progress |
| **Date** | 2026-02-01 |
| **Time Box** | 1 hour |

---

## Question

How can we ensure Claude uses Blue MCP tools (blue_rfc_create, etc.) instead of raw Write/Edit for document creation across all repos with .blue directories?

---

## Findings

### Current Architecture

1. **Global MCP config** (`~/.claude/.mcp.json`) defines the Blue MCP server
2. **SessionStart hook** (`~/.claude/settings.json`) injects knowledge files from `blue/knowledge/` into every session
3. **Project workflow** can be injected via `.blue/workflow.md` if it exists
4. **MCP server instructions** (in `server.rs:286-300`) provide general guidance

### The Gap

The instructions are **soft guidance**, not **hard constraints**:
- MCP instructions say "use blue_status to see what's happening"
- Knowledge files mention `blue_rfc_create` but don't prohibit alternatives
- No explicit rule: "NEVER use Write/Edit for .blue/docs/ files"

Claude sees both Write tool and blue_rfc_create as valid options for creating RFC files. Without explicit prohibition, it may choose Write for simplicity.

### Evidence

superviber-web has:
- `.blue/` directory with SQLite database
- 7 unindexed RFCs (created via Write, not blue_rfc_create)
- No `CLAUDE.md` or `.claude/` directory
- No `.blue/workflow.md`

---

## Solution Options

### Option 1: Strengthen MCP Server Instructions (Recommended)

Update `blue-mcp/src/server.rs` instructions to include:

```rust
"IMPORTANT: When working in repos with .blue/ directories:\n",
"- NEVER use Write/Edit to create files in .blue/docs/\n",
"- ALWAYS use blue_rfc_create for RFCs\n",
"- ALWAYS use blue_adr_create for ADRs\n",
"- ALWAYS use blue_spike_create for spikes\n",
"These tools maintain the index database. Direct file creation causes drift.\n\n",
```

**Pros**: Single source of truth, applies to all repos
**Cons**: Requires recompiling blue binary

### Option 2: Add PreToolUse Hook to Block Write

Add a hook in `~/.claude/settings.json`:

```json
{
  "matcher": "Write",
  "hooks": [{
    "type": "command",
    "command": "blue guard-write"
  }]
}
```

The `blue guard-write` command would:
1. Check if the file path matches `.blue/docs/**/*.md`
2. If yes, output a blocking message: "Use blue_rfc_create instead"
3. If no, allow the write

**Pros**: Hard enforcement, can't be bypassed
**Cons**: Requires new CLI command, slightly slower writes

### Option 3: Repo-Level CLAUDE.md Template

Create a template that gets copied to each repo:

```markdown
# Project Instructions

## Blue Integration

This project uses Blue for document management.

**NEVER** use Write/Edit to create files in `.blue/docs/`.
**ALWAYS** use the Blue MCP tools:
- `blue_rfc_create` for RFCs
- `blue_adr_create` for ADRs
- `blue_spike_create` for spikes
```

**Pros**: Visible in repo, can be customized per project
**Cons**: Must be added to every repo, can drift from source

### Option 4: Hybrid Approach (Best)

Combine Options 1 + 2:
1. Update MCP instructions (soft guidance in every session)
2. Add guard hook (hard enforcement for `.blue/docs/` paths)

This provides defense in depth.

---

## Recommendation

**Implement Option 4 (Hybrid)** with:

1. **MCP instruction update** - Add explicit prohibitions to server.rs
2. **Guard hook** - `blue guard-write <path>` that fails if path is in `.blue/docs/`
3. **Sync command enhancement** - `blue_sync` already exists to fix drift; make it more visible in status

### Implementation Tasks

1. [ ] Update `server.rs` instructions with explicit tool requirements
2. [ ] Add `blue guard-write` CLI command
3. [ ] Add PreToolUse hook for Write tool
4. [ ] Test in superviber-web to verify enforcement
5. [ ] Run `blue_sync` in superviber-web to fix existing drift

---

## Answer

Claude bypasses Blue MCP tools because:
1. No explicit prohibition exists - instructions are permissive guidance
2. Write/Edit tools are always available and simpler to invoke
3. Repos without CLAUDE.md get no project-specific reinforcement

Fix with: MCP instruction update + PreToolUse guard hook for Write operations in `.blue/docs/` paths.
