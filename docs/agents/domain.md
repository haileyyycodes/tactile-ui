# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout: multi-context

This is a multi-context repo. `CONTEXT-MAP.md` at the root points to per-context `CONTEXT.md` files. Read each one relevant to the topic you're working on.

```
/
├── CONTEXT-MAP.md                         ← start here; maps contexts to their CONTEXT.md
├── docs/adr/                              ← system-wide architectural decisions
└── src/
    ├── <context-a>/
    │   ├── CONTEXT.md                     ← context-specific domain language
    │   └── docs/adr/                      ← context-specific decisions
    └── <context-b>/
        ├── CONTEXT.md
        └── docs/adr/
```

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root — read it first to find which contexts are relevant.
- **The relevant `CONTEXT.md`** files — each context's domain language and glossary.
- **`docs/adr/`** at the root — system-wide decisions; also check `src/<context>/docs/adr/` for context-scoped decisions.

If any of these files don't exist yet, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill creates them lazily when terms or decisions actually get resolved.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the relevant `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
