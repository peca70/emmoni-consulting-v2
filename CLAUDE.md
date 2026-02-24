# CLAUDE.md — Frontend Website Build Rules

> This file governs **how Claude builds** the website (tooling, workflow, quality checks).
> It works alongside `landing-page-prompt-generator.md`, which governs **what Claude builds** (design decisions, aesthetics, animations).
> If both files are present, this file controls process; the prompt controls creative direction.

---

## 0. SKILL LOADING (Always First)

- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- If `landing-page-prompt-generator.md` is present in the project, read it before starting any design-from-scratch work — it contains the design system, component architecture, and animation specs.

---

## 1. TWO MODES: REFERENCE vs. GENERATED PROMPT

Claude operates in one of two modes per project. Identify which mode applies before writing any code.

### Mode A — Reference Match (pixel-perfect clone)
**Trigger:** A reference image or screenshot is provided.
- Match layout, spacing, typography, and color exactly.
- Swap in placeholder content (images via `https://placehold.co/`, generic copy) only where real assets aren't available.
- **Do not** improve, add to, or reinterpret the design.
- **Do not** apply the Anti-Generic Guardrails below — the reference IS the design system.
- Do at least 2 screenshot comparison rounds. Stop only when no visible differences remain or the user says so.

### Mode B — Design from Scratch (prompt-driven)
**Trigger:** No reference image, OR a generated prompt from `landing-page-prompt-generator.md` is provided.
- The generated prompt is the single source of truth for all creative decisions: palette, typography, layout, animations, section structure.
- Apply **all** Anti-Generic Guardrails below — they reinforce (not override) the prompt's design system.
- If the prompt specifies a color palette, use those exact values. The guardrail "never use default Tailwind palette" still applies as a fallback safety net.
- If the prompt specifies fonts, use those. The guardrail "never use the same font for headings and body" still applies as a safety net.
- Screenshot your output and self-review for craft quality. Do at least 1 screenshot pass.

---

## 2. BRAND ASSETS (Check Before Anything Else)

- Always check the `brand_assets/` folder before designing.
- If assets exist (logos, color guides, style guides, images), **they override both the prompt's placeholder suggestions AND the defaults below.**
- Priority order: `brand_assets/` → generated prompt values → guardrail defaults.
- If a logo is present, use it. If a color palette is defined, use those exact values.
- **Image sourcing hierarchy:**
  1. `brand_assets/` folder (real brand images)
  2. Real Unsplash URLs specified in the prompt
  3. `https://placehold.co/WIDTHxHEIGHT` as last resort

> **Note:** The generated prompt says "No placeholders — use real Unsplash URLs." This CLAUDE.md relaxes that to: use Unsplash when available, but `placehold.co` is acceptable if network access is limited or for rapid prototyping. The user can swap in real images later.

---

## 3. LOCAL SERVER & SCREENSHOT WORKFLOW

### Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`).
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

### Screenshots
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots save to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → `screenshot-N-label.png`
- After screenshotting, read the PNG with the Read tool — Claude can see and analyze the image directly.

### Comparison Checklist
When comparing screenshots (to reference or to prompt spec), check:
- Spacing/padding consistency
- Font size, weight, line-height
- Colors (exact hex match to prompt palette)
- Alignment and grid structure
- Border-radius (matches prompt's radius system)
- Shadows and depth layering
- Image sizing and overlay treatments
- Animation states (if capturable)

---

## 4. OUTPUT DEFAULTS

- Single `index.html` file, all styles inline, unless user says otherwise.
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Mobile-first responsive.
- **If the prompt specifies a tech stack** (e.g., React + GSAP + Tailwind), follow it. The prompt's tech stack overrides this default.
- **If the prompt specifies GSAP or other libraries**, include them via CDN:
  - GSAP: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>`
  - ScrollTrigger: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>`
  - Lucide: `<script src="https://unpkg.com/lucide@latest"></script>`
- Google Fonts: load via `<link>` tag in `<head>` for any fonts specified in the prompt.

---

## 5. ANTI-GENERIC GUARDRAILS

These are **always active** in Mode B (design from scratch). They are **disabled** in Mode A (reference match).

They act as a safety net — the generated prompt should already satisfy all of these, but if a detail is unspecified, these guardrails fill the gap.

| Category | Rule | Relationship to Prompt |
|---|---|---|
| **Colors** | Never use default Tailwind palette (indigo-500, blue-600, etc.). Use custom brand colors. | Prompt provides the palette. This catches any missed spots. |
| **Shadows** | Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity. | Prompt's "depth layering system" implies this. |
| **Typography** | Never use the same font for headings and body. Pair a display/serif with a clean sans. Tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body. | Prompt specifies Heading + Drama + Mono fonts. This ensures the pairing is enforced. |
| **Gradients** | Layer multiple radial gradients. Add grain/texture via SVG noise filter. | Prompt's "Visual Texture" section covers this. Guardrail ensures it's not skipped. |
| **Animations** | Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing. | Prompt specifies animation details per section. This constrains *how* they're implemented. |
| **Interactive states** | Every clickable element needs `hover`, `focus-visible`, and `active` states. | Prompt's "Micro-Interactions" section aligns. This makes it non-negotiable. |
| **Images** | Add gradient overlay (`bg-gradient-to-t from-black/60`) and color treatment with `mix-blend-multiply`. | Prompt often specifies overlays per section. This is the default if unspecified. |
| **Spacing** | Use intentional, consistent spacing tokens — not random Tailwind steps. | Prompt's radius system implies a spacing system too. |
| **Depth** | Surfaces need a layering system (base → elevated → floating). | Prompt's stacking cards and glassmorphic nav require this. |

---

## 6. HARD RULES (Always Apply, Both Modes)

- Do not add sections, features, or content not specified (in reference OR prompt).
- Do not "improve" a reference design — match it (Mode A).
- Do not ignore prompt specifications to "simplify" — build what's specified (Mode B).
- Do not stop after one screenshot pass.
- Do not use `transition-all`.
- Do not use default Tailwind blue/indigo as primary color.
- Do not use `lorem ipsum` — use real or contextually appropriate copy.

---

## 7. QUICK-REFERENCE: FILE ROLES

| File | Controls | When to Read |
|---|---|---|
| `CLAUDE.md` (this file) | Build process, tooling, quality standards, guardrails | Always — first thing every session |
| `landing-page-prompt-generator.md` | Design system, creative direction, component specs, animations | When designing from scratch (Mode B) |
| `brand_assets/` folder | Real logos, colors, images, style guides | Always — check before any design work |
| Reference image (if provided) | Exact visual target | Mode A only — overrides everything else visually |
