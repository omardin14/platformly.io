---
description: Draft the day's build-in-public post — an UNNAMED feature post + LinkedIn promo, rotating across templates. Feature-first, delayed-reveal strategy.
argument-hint: [--reveal] [topic hint]
allowed-tools: ["Bash", "Glob", "Grep", "Read", "Write", "Task"]
---

# Draft today's post

Delegate to the `blog-writer` agent to draft today's content under platformly's **feature-first,
unnamed, delayed-reveal** strategy.

**Args:** "$ARGUMENTS" — pass `--reveal` only for the launch crescendo (the one post that names the
product); otherwise an optional topic hint.

## Workflow
1. Gather the day's work: `git log main..HEAD --oneline`, `git diff --stat`, and any screenshots the
   user references.
2. Read `blog/CALENDAR.md` (rotation log + backlog) and `docs/COMPETITIVE-LANDSCAPE.md`.
3. Launch the **`blog-writer`** agent with that context. It will:
   - Pick the next `NNN` and a format that doesn't repeat yesterday's
     (`problem-solution` / `tutorial` / `showcase`; `reveal` only if `--reveal`).
   - Write `blog/NNN-<slug>.md` + `blog/NNN-<slug>.linkedin.md` from `blog/templates/<format>.md`.
   - Append a row to `blog/CALENDAR.md`.
4. **Pre-reveal guard:** before reporting done, grep the new files for the product name — it must
   appear **nowhere** (unless `--reveal`). If it does, fix and re-check.

## Output
Report the two file paths, the chosen format, and the LinkedIn hook line. Drafting only — the user
publishes to Medium/LinkedIn. (`blog/` is gitignored.)
