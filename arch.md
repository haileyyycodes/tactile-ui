# Tactile UI — Architecture

A reference to build against. The guiding principle: **match complexity to the problem, and make every choice defensible in a code review.** That restraint is the senior signal — not exotic tooling.

---

## The core decision

Build the components **once as Web Components (Lit)**, ship **thin wrappers** for React and Angular, and showcase them in a **custom Next.js docs site**. Everything lives in a **Turborepo** deployed on Vercel.

Why this over the alternatives:

- **vs. building in React only** — you'd lose the cross-framework reach (and the chance to turn your Angular depth into a visible asset). Keep this as your *fallback* only if time gets tight.
- **vs. a headless logic core + per-framework rendering** (the Radix/Headless-UI pattern) — that pattern is right when the product is *behavior* and consumers bring their own styles. Yours is the opposite: the rendered **feel** (motion + sound) *is* the product. A headless core would make you re-implement the feel per framework. More work, weaker showcase.
- **Web Components win here** because the feel is rendering-coupled — write the motion/sound engine once, run it everywhere. React 19's full custom-element support makes the React wrapper trivial; Angular's custom-element interop makes the Angular wrapper nearly free.

**The fork, stated plainly:** if Weeks 2–3 get tight, drop to React-first and ship fewer components polished. Don't go Angular-only.

---

## Stack at a glance

| Layer | Choice | Why |
|---|---|---|
| Component core | **Lit** (Web Components) | Tiny (~5kb), reactive props, scoped styles, runs in any framework |
| Language | **TypeScript**, everywhere | Table stakes for a senior signal in 2026 |
| Animation | **Web Animations API** (`element.animate`) | Framework-agnostic, no heavy dep in the core |
| Sound | **Web Audio API** (`AudioContext`) | Real control over the click/feedback engine |
| Styling/theming | Shadow DOM + **CSS custom properties** + `::part()` | Encapsulated by default, themeable by design |
| Monorepo | **pnpm workspaces + Turborepo** | Vercel-native; the natural shape for "library + docs site" |
| Versioning | **Changesets** | Standard for monorepo publishing + changelogs |
| Build (core) | **Vite library mode** + `vite-plugin-dts` | Clean tree-shakeable ESM + type declarations |
| Docs site | **Next.js** on Vercel | Doubles as your design-engineering portfolio piece |

The monorepo isn't a flex here — a published package *plus* a site that consumes it is exactly the multi-package case monorepos exist for. (If you want less overhead early, you can collapse to one package + the docs app and add wrappers later.)

---

## Repo structure

```
tactile-ui/
├── packages/
│   ├── core/                      # the library — published to npm
│   │   ├── src/
│   │   │   ├── feel/              # ← the heart: shared interaction layer
│   │   │   │   ├── motion.ts      # press physics, spring/easing tokens (WAAPI)
│   │   │   │   ├── sound.ts       # AudioContext engine: load, decode, play
│   │   │   │   ├── ripple.ts      # pointer-origin ripple
│   │   │   │   └── tokens.css     # design tokens as CSS custom properties
│   │   │   ├── components/
│   │   │   │   ├── tactile-button/
│   │   │   │   ├── tactile-toggle/
│   │   │   │   ├── tactile-menu/
│   │   │   │   └── tactile-calendar/
│   │   │   └── index.ts
│   │   └── package.json
│   ├── react/                     # thin React wrappers (re-export + typed props)
│   └── angular/                   # optional: Angular wrappers — your differentiator
├── apps/
│   └── docs/                      # Next.js demo + docs site (the portfolio piece)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

The thing to notice: **`feel/` is a layer, not a folder of helpers.** Every component composes the same motion, sound, and ripple primitives. That's what makes this a *system* rather than four nice components — and it's the architecture story you tell.

---

## Current implementation skeleton

This repository now includes a monorepo skeleton with:

- `apps/site` — a new Next.js App Router site scaffold
- `packages/ui` — a shared UI package placeholder
- root workspace config for `apps/*` and `packages/*`
- shared TypeScript config in `tsconfig.base.json`

The site is ready to run after `npm install`, and the shared package can be built via `npm run build --workspace packages/ui`.

---

## The feel layer (the part that matters)

This is your differentiator, so engineer it like it's the product — because it is.

**Motion** — drive everything off a small set of easing/duration tokens via the Web Animations API, so the "press" feels consistent across components and you carry no animation dependency in the core. Honor `prefers-reduced-motion` globally: when set, transforms collapse to instant state changes, no springs.

**Sound** — the detail most people get wrong, which makes it a great talking point:
- An `AudioContext` is **suspended until a user gesture** — initialize/resume it on first interaction, or the first click is silent. Demonstrating you know this reads as real platform depth.
- Decode each sample **once** into a buffer and reuse it; don't re-fetch per click.
- Ship a **sound on/off control** and default to respecting the user — audio feedback is an enhancement, never required for function.

**Theming** — expose the look through CSS custom properties (your tokens) and `::part()` for power users, so the encapsulation of Shadow DOM doesn't fight people who want to restyle.

---

## Components + accessibility

A11y is *your* edge — it's exactly where design judgment meets code, and it's what most devs skip. Make it the thing reviewers notice.

- **tactile-button** — real focus ring (`:focus-visible`), keyboard activation, `aria-pressed` when used as a toggle-button. The simplest, build it first to lock the feel layer.
- **tactile-toggle** — `role="switch"` + `aria-checked`, space/enter to toggle, label association. Make it a **form-associated custom element** (`ElementInternals`) so it participates in native forms — the detail that makes it "real," not a div that looks like a switch.
- **tactile-menu** — full keyboard model: arrow nav, Home/End, type-ahead, Escape to close, roving `tabindex`, `aria-expanded`, click-outside. This is where most component libraries quietly cut corners.
- **tactile-calendar** — your a11y showcase and the time sink. Use the `role="grid"` date-picker pattern: arrow-key navigation across days, labeled dates, month navigation, and screen-reader announcements on change. Budget the most time here.

---

## Build & publish

- **Core build:** Vite library mode → ESM output + `.d.ts` via `vite-plugin-dts`. Ship a proper `exports` map and mark `sideEffects` for tree-shaking. ESM-only is fine for a modern library.
- **Versioning/release:** Changesets — `changeset` per change, then `version` + `publish`. Gives you a clean changelog for free, which looks deliberate.
- **Docs site:** a custom Next.js site is the stronger portfolio artifact than stock Storybook (it shows *your* design taste, which is half your pitch). If time is tight, Storybook is the faster, industry-standard fallback.

---

## Mapping to your 3 weeks

- **Week 1** — scaffold the Turborepo (pnpm + Turbo), build the `feel/` layer (motion + sound + tokens), ship **button + toggle**, deploy the docs site skeleton to Vercel. *Lock the feel on the two easy components first.*
- **Week 2** — build **menu**; start the **calendar** (structure + grid navigation).
- **Week 3** — finish the calendar, polish the feel across the whole set, write the docs/README, publish to npm via Changesets. Add the Angular wrapper here only if you're ahead.

---

## Interview talking points (pre-loaded)

These are the "why" answers a senior interviewer is actually probing for:

- *"Why Web Components?"* → The interaction and motion layer is the product; I wanted one implementation that runs in any framework. React 19's custom-element support made the wrapper thin.
- *"Why a monorepo?"* → A published package plus a site that consumes it is the textbook multi-package case — not complexity for its own sake.
- *"Where's the interesting engineering?"* → The shared feel layer: a reduced-motion-aware WAAPI motion system and an AudioContext engine that respects the browser's gesture-gated autoplay policy.
- *"What did you skip on purpose?"* → No animation library in the core, no microservices, no over-abstraction — restraint matched to a component library.
- *"How do you handle accessibility?"* → Form-associated elements, full keyboard models, the grid pattern for the calendar, reduced-motion throughout.