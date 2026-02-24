# Emmoni Consulting — Landing Page Build Prompt

---

**Role:** Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer.

**Objective:** Architect a high-fidelity, cinematic "1:1 Pixel Perfect" landing page for **Emmoni Consulting**.

**Aesthetic Identity:** "Dark Precision Theater" / "Luxury Automation Command"

The site should feel like stepping into the control room of a private intelligence agency that happens to run on gold — every surface is deliberate, every animation is weighted, and the darkness isn't empty — it's *loaded*.

---

## 1. CORE DESIGN SYSTEM (STRICT)

### Palette

| Role | Name | Hex |
|------|------|-----|
| Primary | Obsidian | `#0A0A0A` |
| Accent | Aureum (Gold) | `#C8A456` |
| Surface | Gunmetal | `#1A1A2E` |
| Text / Light | Ash | `#E0E0E0` |
| Muted | Graphite | `#6B6B6B` |

**Gradient usage:** The gold accent should never appear as a flat fill on large surfaces. Use it as: thin borders, text highlights, animated gradient strokes, CTA button backgrounds, and subtle radial glows. The gold-to-transparent gradient (`#C8A456` → `transparent`) is the brand's signature light source.

### Typography

- **Headings:** "Space Grotesk" — Bold, tracking tight (-0.02em). Clean geometric authority. All headings uppercase where used for section labels; mixed case for hero statements.
- **Drama / Emphasis:** "Instrument Serif" — *Must use Italic for automation/efficiency concepts.* When the copy references transformation, precision, or obsession, switch to this serif italic to create visual tension against the sans-serif.
- **Data / Monospace:** "JetBrains Mono" for live metrics, process step counters, and any simulated terminal/dashboard UI inside feature cards.

### Visual Texture

- Implement a global CSS noise overlay (SVG turbulence at ~0.04 opacity) across all dark surfaces to eliminate flat digital blacks. This is critical — without it the dark theme will look like a default template.
- Use a `rounded-[0.75rem]` to `rounded-[1.25rem]` radius system for all containers. Sharp enough to feel technical, soft enough to feel premium.
- Add a subtle horizontal scan-line effect (CSS repeating-linear-gradient, 1px lines at 3% opacity) on the hero section only — evoking a command-center monitor aesthetic.
- All section dividers: use a single `1px` line in `#C8A456` at 20% opacity, never a hard border.

---

## 2. COMPONENT ARCHITECTURE & BEHAVIOR

### A. NAVBAR — "The Command Strip"

- A fixed, pill-shaped container centered horizontally with `max-w-4xl`, floating 20px from the top.
- **Contents:** Emmoni logomark (the hexagonal "E" icon — use the brand's logo asset) on the left. Navigation links center: "Services", "Process", "Contact". A gold CTA button "Book a Call" on the right with a subtle shimmer animation on idle.
- **Morphing Logic:** Fully transparent with white text and no border at page top. On scroll (past hero), transitions to `rgba(10,10,10,0.85)` with a `backdrop-blur-xl`, a `1px` gold border at 15% opacity, and the pill shrinks width by ~10% with a smooth `cubic-bezier(0.4, 0, 0.2, 1)` transition over 400ms.

---

### B. HERO SECTION — "The Obsession Engine"

- **Visuals:** 100dvh height. Deep black background with a radial gold gradient glow emanating from the center-bottom of the screen (`radial-gradient(ellipse at 50% 120%, rgba(200,164,86,0.08) 0%, transparent 60%)`). Layer a subtle animated particle field (very sparse — 15–20 gold dots drifting slowly upward at varied speeds and opacities, like embers or data points ascending). The particles should be CSS/canvas-based, not a heavy library.
- **Layout:** Content dead center, vertically and horizontally. Tight vertical stack.
- **Typography:**
  - Pre-headline: "EMMONI CONSULTING" in JetBrains Mono, uppercase, tracked ultra-wide (0.3em), `text-sm`, in Graphite (`#6B6B6B`). A thin gold line (40px wide) sits above it, centered.
  - Main headline — two lines of maximum contrast:
    - Line 1: **"We Don't Optimize."** — Space Grotesk, Bold, `text-6xl` (desktop) / `text-4xl` (mobile), in Ash white.
    - Line 2: **"We *Obsess.*"** — "Obsess" in Instrument Serif Italic, `text-7xl` (desktop) / `text-5xl` (mobile), in Aureum gold (`#C8A456`). The period is also gold.
  - Sub-headline: "Custom automation systems that eliminate manual work, reduce overhead, and let your team focus on what actually grows the business." — Space Grotesk, Regular, `text-lg`, in Graphite, `max-w-xl`, centered.
  - CTA cluster: Two buttons side by side.
    - Primary: "Book a Discovery Call" — solid gold background, Obsidian text, `rounded-full`, `px-8 py-4`. Magnetic hover effect (button subtly follows cursor within a 10px radius).
    - Secondary: "See How It Works" — transparent with 1px gold border, gold text. On hover, gold fills from left to right as a sliding background layer.
- **Animation:** GSAP timeline on load:
  1. Gold line scales from `scaleX(0)` to `scaleX(1)` over 600ms.
  2. Pre-headline fades up (20px) at 300ms delay.
  3. Line 1 clips in from bottom (clip-path reveal) at 500ms delay.
  4. Line 2 clips in from bottom at 700ms delay. The word "Obsess" has an additional gold shimmer that sweeps left-to-right once after reveal.
  5. Sub-headline fades up at 900ms.
  6. Buttons fade up with slight stagger at 1100ms.
  7. Particles begin fading in at 1200ms.

---

### C. FEATURES / SERVICES — "The Arsenal"

A section titled with the pre-label "WHAT WE BUILD" (JetBrains Mono, tracked wide, Graphite) and the heading **"Your Manual Work, *Automated.*"** ("Automated" in Instrument Serif Italic, gold).

Replace standard cards with **Interactive Functional Artifacts** — each card should feel like a miniature working interface, not a static layout. Cards are arranged in a 3-column grid on desktop, single stack on mobile. Each card has a dark Gunmetal (`#1A1A2E`) background, `rounded-[1.25rem]`, a `1px` border in `rgba(200,164,86,0.08)`, and on hover the border brightens to `rgba(200,164,86,0.3)` with a subtle gold glow (`box-shadow: 0 0 30px rgba(200,164,86,0.06)`).

#### Card 1 — Custom Apps & Websites: "The Diagnostic Shuffler"

A stack of 3 overlapping mini-cards inside the artifact area, each representing a different app type: "Client Portal," "Internal Dashboard," "Booking System." They cycle vertically using `unshift(pop())` logic every 3 seconds with a spring-bounce transition (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Each mini-card has a different icon (Lucide: `LayoutDashboard`, `Globe`, `CalendarCheck`) and a one-line description. The top card is always full opacity with gold accent; cards beneath are progressively dimmed and scaled down.

**Below the artifact:** "Custom-built applications and websites that replace clunky spreadsheets and disconnected tools with one seamless system your team actually wants to use."

#### Card 2 — AI Employees & Agents: "Telemetry Typewriter"

A simulated terminal/feed area with a dark `#0D0D0D` inner background and a pulsing green "LIVE" dot in the top-right. A monospaced text feed auto-types and cycles through status messages:
- `▸ AI Agent: Invoice processed — $4,200 matched to PO-3847`
- `▸ AI Agent: Lead qualified — score 87/100 — routed to Sarah`
- `▸ AI Agent: Support ticket #412 resolved — avg time: 43s`
- `▸ AI Agent: Weekly report generated — sent to 3 stakeholders`

Each line types out with a blinking gold cursor, pauses 2s, then fades to Graphite as the next line begins. The feed scrolls naturally.

**Below the artifact:** "AI employees that handle intake, qualification, scheduling, reporting, and customer support — running 24/7 without sick days, mistakes, or management overhead."

#### Card 3 — Agentic Workflows: "The Orbit Diagram"

An animated SVG/canvas showing a central gold node labeled "YOUR BUSINESS" with 5 smaller nodes orbiting at different radii and speeds: "CRM," "Invoicing," "Onboarding," "Reporting," "Scheduling." Thin gold connecting lines trace from each orbiting node to the center, pulsing subtly. On hover, the orbits slow and each node slightly enlarges, revealing a one-word status: "Synced."

**Below the artifact:** "End-to-end automated workflows that connect every tool in your stack — so data flows, tasks trigger, and nothing falls through the cracks."

---

### D. PROCESS — "The Protocol Stack"

Section pre-label: "HOW WE WORK" (JetBrains Mono, tracked wide, Graphite). Heading: **"Three Phases. *Zero Guesswork.*"** ("Zero Guesswork" in Instrument Serif Italic, gold).

3 near-full-screen cards stacked vertically. Using GSAP ScrollTrigger, as a new card scrolls into view, the card underneath scales down to `0.92`, applies `filter: blur(8px)`, and fades opacity to `0.4` — creating a physical stacking depth effect. Each card has rounded corners (`rounded-[1.25rem]`), Gunmetal background, and a large step number in JetBrains Mono at `text-9xl` in `rgba(200,164,86,0.06)` positioned top-right as a watermark.

**Card 1 — "Diagnose"**
- Step indicator: `01` in gold monospace.
- Headline: **"We Map Every Manual Bottleneck."**
- Description: "We embed with your team for 1–2 weeks. We watch the workflows. We document the friction. We find the 20% of processes eating 80% of your time — then we build the elimination plan."
- **Micro-animation:** An animated SVG showing a scanning laser-grid (horizontal gold line sweeping top to bottom, repeating) over a simplified flowchart diagram. Nodes in the flowchart pulse red briefly as the scanner passes over them (identifying bottlenecks), then turn gold (diagnosed).

**Card 2 — "Architect"**
- Step indicator: `02` in gold monospace.
- Headline: **"We Design the System Before Writing a Line of Code."**
- Description: "No off-the-shelf templates. We architect a custom automation blueprint — mapping every integration, every trigger, every edge case — so when we build, we build once and we build right."
- **Micro-animation:** Connected nodes forming a network. Starts as 6 scattered dots that, on scroll-enter, animate along paths to connect into a structured hexagonal network pattern (echoing the Emmoni logo shape). Lines draw between nodes progressively with a gold stroke animation.

**Card 3 — "Deploy & Iterate"**
- Step indicator: `03` in gold monospace.
- Headline: **"We Launch, Monitor, and Refine Until It's Bulletproof."**
- Description: "We don't hand off and disappear. Every system we build includes a 30-day optimization window where we monitor performance, squash edge cases, and fine-tune until your automation runs like clockwork."
- **Micro-animation:** A progress bar that fills in three staged bursts (33% → 66% → 100%) with slight overshoot easing on each stage. At 100%, a lock icon at the end animates from "unlocked" to "locked" with a satisfying snap. The bar is gold; the background is dark.

---

### E. CTA / CONTACT — "The Ignition"

Full-width section. Dark background with the same radial gold glow from the hero, but inverted (emanating from center-top). This creates visual bookending.

- Pre-label: "READY?" (JetBrains Mono, tracked wide, gold).
- Headline: **"Stop Managing. *Start Automating.*"** ("Start Automating" in Instrument Serif Italic, gold, `text-5xl`).
- Sub-text: "Book a free 30-minute discovery call. We'll diagnose your biggest bottleneck and show you exactly what automation would look like for your business — no pitch deck, no fluff." — Space Grotesk, Regular, `text-lg`, Graphite, `max-w-2xl`, centered.
- Single CTA button, oversized: **"Book Your Discovery Call"** — solid gold, Obsidian text, `rounded-full`, `px-10 py-5`, `text-lg`. Magnetic hover effect. On hover, a subtle radial gold pulse emanates from the button (single ping, not repeating).
- Below the button, a small trust line: "No contracts. No commitment. Just clarity." in Graphite, `text-sm`.

---

### F. FOOTER — "Ground Control"

- Deep Obsidian (`#0A0A0A`) background with a `rounded-t-[2rem]` top edge, separated from the CTA section by generous padding.
- **Layout:** Three-column grid on desktop.
  - **Column 1:** Emmoni logo (full horizontal version) at comfortable size. Below: a one-liner — "Obsessively engineering the end of manual work." in Graphite, `text-sm`.
  - **Column 2:** Navigation links — Services, Process, Contact, Privacy Policy. In Ash, `text-sm`, with gold hover underline animation (underline slides in from left).
  - **Column 3:** Contact details — email address, location (if applicable). A "System Operational" status indicator with a pulsing green dot and "All Systems Online" text in JetBrains Mono, `text-xs`, Graphite.
- **Bottom bar:** A single `1px` line in `rgba(200,164,86,0.1)` separating the footer content from the copyright line: "© 2025 Emmoni Consulting. All rights reserved." centered, `text-xs`, Graphite.

---

## 3. TECHNICAL REQUIREMENTS

### Tech Stack

- **React 19** (single-page app)
- **Tailwind CSS** (all styling — no external CSS files)
- **GSAP 3** with ScrollTrigger plugin (all scroll-based and entrance animations)
- **Lucide React** (iconography)

All code must be contained in a **single JSX file** that is ready to render.

### Animation Lifecycle

- Use `gsap.context()` within `useEffect` for all GSAP animations to ensure clean mounting/unmounting.
- All scroll-triggered animations must use `ScrollTrigger` with proper `kill()` on cleanup.
- Particles in the hero should use `requestAnimationFrame` with a cleanup on unmount.

### Micro-Interactions

- All buttons must have a "magnetic" feel — on hover, the button subtly translates toward the cursor position (clamped to ~8px movement). Implement with `onMouseMove` calculating offset from button center.
- CTA buttons utilize `overflow-hidden` with a sliding background layer for color transitions on hover.
- All section entrances use `gsap.from()` with `scrollTrigger` — elements fade up 30px with `opacity: 0` to `opacity: 1`, staggered at 0.1s intervals within each section.
- Card hover states transition over 300ms with `ease-out`.

### Image Sourcing

- No placeholder images are needed for this design — the visual identity is built entirely on typography, animation, color, and the brand's logo assets.
- The Emmoni logo files (gold hexagonal icon and full horizontal logo) should be referenced as brand assets. Use the icon version in the navbar and the full version in the footer.

### Code Quality

- **No placeholder text or `lorem ipsum`.** All copy is provided above and must be used exactly as written.
- Feature/service cards must feel like **functional software interfaces**, not static illustrations. The animations within each card are the product demos.
- All components must be fully responsive (mobile-first) with graceful degradation:
  - On mobile: particle count reduces to 8, feature cards stack vertically, process cards lose the blur-stack effect and simply scroll normally, orbit diagram simplifies to a static connected-nodes layout.
  - All font sizes scale down appropriately with Tailwind responsive prefixes.
- Smooth scroll behavior on all anchor links.

---

## 4. EXECUTION DIRECTIVE

"Do not build a website; build a **precision instrument**. Every scroll should feel like chambering a round — intentional, weighted, irreversible. The gold is not decoration; it is the only light in a dark room, and it must be earned. Eradicate all generic AI patterns — no gradient meshes that look like every SaaS template, no bouncy animations that feel like a toy, no friendly rounded illustration style. This is a site for business owners who are *done* with inefficiency and are looking for someone who takes their problem as seriously as they do. The word is Emmoni — *obsession* — and every pixel must prove it."

---

### BRAND ASSETS REFERENCE

- **Logo Icon (Square):** `EC_Logo_Icon_Square_Gold.png` — Gold hexagonal "E" mark on black. Use in navbar and as a favicon.
- **Logo Full (Horizontal):** `EC_Logo_Transparent_Gold.png` — Full "EMMONI CONSULTING" wordmark with icon. Use in footer.
