# Design System — Dark Mode Adaptation
*Based on ElevenLabs' restrained elegance, inverted for an immersive, cinematic scrollytelling experience for a global sound/localization/artist-management studio.*

## 1. Visual Theme & Atmosphere

The site is a pitch-black stage — `#000000` canvas on which typography, glowing waveforms, and volumetric shadows orchestrate the narrative. Where ElevenLabs whispers through light, this adaptation whispers through dark: the same near-weightless type, the same sub-0.1-opacity shadow craft, but inverted so every luminous element feels like a sound wave resolving out of silence.

Typography keeps its defining duality: a condensed, light-weight display face (Inter Variable weight 100–300, or Neue Haas Grotesk Display as a premium fallback) for ethereal, whisper-thin headlines that read like waveforms rendered in type. Inter Variable handles all body/UI text with a slight positive letter-spacing (0.14–0.18px) that keeps copy airy against the black void. A bold condensed cut (Inter weight 700 + uppercase) replaces WaldenburgFH for signature CTAs.

Depth is produced by **luminous rims** instead of cast shadows — translucent white inset borders (`rgba(255,255,255,0.06)` inset) and warm off-white glows (`rgba(255,248,235,0.04)`) that barely exist, yet give every surface a sculpted edge. Pill buttons become floating obsidian tablets; featured CTAs glow with a warm-off-white halo.

**Key Characteristics:**
- Pure black canvas (`#000000`) with warm-tinted secondary surfaces (`#0a0908`, `#14110d`)
- Display face at weight 100–300 — whisper-thin, translucent, ethereal
- Inter Variable with +0.14–0.18px letter-spacing for body — airy legibility on black
- Multi-layered rim lights at sub-0.1 opacity — edges defined by light, not shadow
- Pill buttons (9999px) with obsidian and warm-off-white variants
- Warm off-white accent (`#f5f2ef`) reserved for signature CTAs and highlights
- Luminous shadow tints: `rgba(255, 248, 235, 0.04)` — shadows glow, not darken
- Audio-waveform motif integrated as a structural ornament across the system

## 2. Color Palette & Roles

### Primary
- **Pure Black** (`#000000`): Primary background, hero canvas, scrollytelling stage
- **Obsidian** (`#0a0908`): Secondary surface, subtle section differentiation
- **Warm Ink** (`#14110d`): Tertiary surface — card backgrounds with warm undertone
- **Pure White** (`#ffffff`): Primary text, display headings, primary CTA labels

### Neutral Scale (Light-on-Dark)
- **Soft White** (`rgba(255, 255, 255, 0.78)`): Secondary text, descriptions
- **Muted White** (`rgba(255, 255, 255, 0.50)`): Tertiary text, captions, metadata
- **Whisper White** (`rgba(255, 255, 255, 0.28)`): Decorative lines, disabled states
- **Warm Off-White** (`#f5f2ef`): Accent surface — featured CTA, highlights

### Interactive
- **Waveform Cyan** (`#7fffff` at 22% opacity): Grid column overlay, waveform glow
- **Ring Focus** (`rgba(147, 197, 253, 0.55)`): Keyboard focus ring
- **Border Light** (`rgba(255, 255, 255, 0.08)`): Explicit hairline borders
- **Border Subtle** (`rgba(255, 255, 255, 0.04)`): Ultra-subtle separators

### Luminous Shadows (Rim Lights)
- **Inset Rim** (`rgba(255,255,255,0.06) 0px 0px 0px 0.5px inset`): Internal edge glow
- **Inset Strong** (`rgba(255,255,255,0.10) 0px 0px 0px 0.5px inset`): Pronounced inner edge
- **Outline Glow** (`rgba(255,255,255,0.05) 0px 0px 0px 1px`): Glow-as-border
- **Soft Halo** (`rgba(255,255,255,0.04) 0px 4px 18px`): Gentle volumetric lift
- **Card Halo** (`rgba(0,0,0,0.8) 0px 1px 2px, rgba(255,255,255,0.04) 0px 8px 24px`): Elevated card
- **Warm Halo** (`rgba(255,248,235,0.05) 0px 8px 28px`): Featured CTA warm glow
- **Edge Highlight** (`rgba(255,255,255,0.08) 0px 0px 0px 0.5px`): Subtle edge definition
- **Inset Hairline** (`rgba(255,255,255,0.10) 0px 0px 0px 1px inset`): Strong inset border

## 3. Typography Rules

### Font Families
- **Display**: `Inter`, `variable 100–300` — fallback: `"Neue Haas Grotesk Display"`, `Helvetica Neue`, `system-ui`
- **Display Bold**: `Inter` weight 700 + `text-transform: uppercase` — the signature loud label
- **Body / UI**: `Inter Variable` — weights 400, 500, 600
- **Monospace**: `"Geist Mono"`, `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Mega | Inter | clamp(64px, 10vw, 180px) | 100–200 | 0.95 (ultra-tight) | -0.04em | Hero — near-invisible strokes |
| Display Hero | Inter | clamp(48px, 6vw, 96px) | 200–300 | 1.02 (tight) | -0.03em | Scrolltelling key frames |
| Section Heading | Inter | clamp(36px, 4vw, 64px) | 300 | 1.10 (tight) | -0.02em | Section opener |
| Card Heading | Inter | 32px (2.00rem) | 300 | 1.13 (tight) | -0.01em | Card titles |
| Body Large | Inter | 20px (1.25rem) | 400 | 1.40 | 0.18px | Lead paragraphs |
| Body | Inter | 18px (1.13rem) | 400 | 1.55 | 0.18px | Standard reading text |
| Body Standard | Inter | 16px (1.00rem) | 400 | 1.55 | 0.16px | UI text |
| Body Medium | Inter | 16px (1.00rem) | 500 | 1.50 | 0.16px | Emphasized body |
| Nav / UI | Inter | 15px (0.94rem) | 500 | 1.33–1.47 | 0.15px | Navigation links |
| Button | Inter | 15px (0.94rem) | 500 | 1.47 | 0.02em | Button labels |
| Button Uppercase | Inter | 13px (0.81rem) | 700 | 1.10 (tight) | 0.14em | `text-transform: uppercase` |
| Caption | Inter | 14px (0.88rem) | 400–500 | 1.50 | 0.14px | Metadata |
| Small | Inter | 13px (0.81rem) | 500 | 1.38 | 0.04em | Tags, badges |
| Code | Geist Mono | 13px (0.81rem) | 400 | 1.85 (relaxed) | normal | Code/meta blocks |
| Micro | Inter | 12px (0.75rem) | 500 | 1.33 | 0.08em | Tiny labels, waveform counters |
| Tiny | Inter | 10px (0.63rem) | 400 | 1.60 (relaxed) | 0.12em | Fine print |

### Principles
- **Light as the hero weight**: Display runs at weight 100–300. The thinness IS the brand — strokes that feel like audio waveforms, intrigue through restraint.
- **Positive letter-spacing on body**: Inter body uses +0.14–0.18px tracking, producing airy legibility against the black canvas.
- **Uppercase for emphasis**: Bold (700) uppercase cut appears only in signature CTA labels and section numbering with 0.14em letter-spacing — the one place where the system gets loud.
- **Monospace as ambient**: Geist Mono at relaxed line-height (1.85) for timecodes, waveform readouts, and technical meta.

## 4. Component Stylings

### Buttons

**Primary White Pill**
- Background: `#ffffff`
- Text: `#000000`
- Padding: 12px 20px
- Radius: 9999px
- Use: Primary CTA — a luminous tablet against the black

**Obsidian Pill (Rim-bordered)**
- Background: `#0a0908`
- Text: `#ffffff`
- Radius: 9999px
- Shadow: `rgba(255,255,255,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.6) 0px 4px 16px`
- Use: Secondary CTA — tactile obsidian

**Warm Off-White Pill (Signature)**
- Background: `rgba(245, 242, 239, 0.92)` (warm off-white)
- Text: `#000000`
- Padding: 12px 20px 12px 14px (asymmetric)
- Radius: 30px
- Shadow: `rgba(255, 248, 235, 0.06) 0px 8px 28px` (warm glow halo)
- Use: Featured CTA, hero action — the signature warm tablet

**Uppercase Condensed Button**
- Font: Inter 13px weight 700
- Text-transform: uppercase
- Letter-spacing: 0.14em
- Use: Signature loud labels, section numbers

### Cards & Containers
- Background: `#0a0908` (obsidian) or `#14110d` (warm ink)
- Border: `1px solid rgba(255,255,255,0.06)` or rim-light shadow
- Radius: 16px–24px
- Shadow: multi-layer stack (inset rim + outline glow + soft halo)
- Content: video thumbnails, waveform previews, portfolio stills

### Inputs & Forms
- Textarea: `bg-[#0a0908]`, border `rgba(255,255,255,0.08)`, padding 12px 20px
- Select: obsidian background, light border
- Focus: blue ring at `rgba(147, 197, 253, 0.55)` with 2px offset
- Placeholder: `rgba(255,255,255,0.35)`

### Navigation
- Minimal transparent sticky header (`backdrop-blur-md` over black at 60% opacity)
- Inter 15px weight 500 for nav links, `rgba(255,255,255,0.78)` baseline → `#ffffff` on hover
- Pill CTAs right-aligned (white primary, obsidian secondary)
- Mobile: hamburger collapse at 1024px, slides in from right

### Image & Video Treatment
- Video backgrounds: fullscreen `autoplay muted loop playsInline`, WebM → MP4 fallback
- Poster images on mobile (`<video poster="…">`), reducedMotion fallback
- Warm-tinted gradient overlays on portfolio thumbnails
- 20px–24px radius on image containers
- Full-bleed sections alternating pure black and warm ink

### Distinctive Components

**Audio Waveform Ornaments**
- SVG or Canvas waveform drawn in `#ffffff` at 0.5–0.8 opacity
- Used as hero ornament, section dividers, and loading states
- Animated amplitudes driven by `requestAnimationFrame` or GSAP timeline
- Mobile: simplified 32-bar static SVG

**Particle Field (Three.js)**
- BufferGeometry, 2000–4000 points, additive blending
- Color: `#ffffff` with varying alpha (0.1–0.9)
- Mouse-reactive drift, slow rotation (<0.002 rad/frame)
- Mobile fallback: Canvas 2D static starfield

**Scrolltelling Stage**
- Pin container at 100vh, GSAP ScrollTrigger driven
- Text + image + 3D object state changes on scroll progress
- Warm ink background with subtle waveform watermark

**Warm Off-White CTA Block**
- `rgba(245,242,239,0.92)` background with warm glow halo
- Asymmetric padding (more right padding)
- Creates a tactile, luminous signature moment in the dark

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px, 192px

### Grid & Container
- Fullbleed-first — most sections are 100vw × 100vh
- Centered max-width `clamp(1040px, 72vw, 1440px)` for readable content sections
- Single-column hero, expanding to 2–12 column grids for portfolio
- Full-width gradient sections for product/service showcases

### Whitespace Philosophy
- **Cinematic generosity**: massive vertical rhythm (`py-[128px]` to `py-[192px]`) between sections creates a premium, unhurried pace. Each section is an exhibit.
- **Volumetric darkness**: the black space isn't empty — warm undertones, subtle noise/grain, and slow particle drift give the void a tactile, physical presence.
- **Typography-led rhythm**: light-weight display headlines create visual "whispers" that draw the eye through deep, cinematic blackness.

### Border Radius Scale
- Minimal (2px): Inline elements
- Subtle (4px): Nav items, tab panels, tags
- Standard (8px): Small containers
- Comfortable (10px–12px): Dropdowns, popovers
- Card (16px): Standard cards, articles
- Large (18px–20px): Featured cards
- Section (24px): Large panels
- Warm Button (30px): Warm off-white CTA
- Pill (9999px): Primary buttons, nav pills

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, text blocks |
| Inset Rim (Level 0.5) | `rgba(255,255,255,0.06) 0px 0px 0px 0.5px inset` | Internal edge definition |
| Outline Glow (Level 1) | `rgba(255,255,255,0.05) 0px 0px 0px 1px` + `rgba(0,0,0,0.5) 0px 2px 6px` | Glow-as-border for cards |
| Card (Level 2) | `rgba(0,0,0,0.8) 0px 1px 2px, rgba(255,255,255,0.04) 0px 8px 24px` | Button elevation, prominent cards |
| Warm Lift (Level 3) | `rgba(255,248,235,0.06) 0px 8px 28px` | Featured CTAs — warm halo |
| Focus (Accessibility) | `rgba(147,197,253,0.55) 0 0 0 2px, #000 0 0 0 4px` | Keyboard focus |

**Shadow Philosophy**: the system inverts ElevenLabs' refined shadow craft — instead of dark shadows on white, luminous rims on black. Every rim light sits at sub-0.1 opacity; many compose inset + outline + halo. The warm off-white halos use actual color (`rgba(255,248,235,...)`) rather than neutral white. Inset half-pixel rim-lights define edges so subtle they're felt rather than seen — surfaces emerge from the dark through the lightest possible touch of light.

## 7. Do's and Don'ts

### Do
- Use Inter variable weight 100–300 for all display headings — the lightness IS the brand
- Apply multi-layer rim lights (inset + outline + halo) at sub-0.1 opacity
- Use warm off-white (`#f5f2ef`) for featured CTAs to contrast the achromatic darkness
- Apply positive letter-spacing (+0.14px to +0.18px) on Inter body text
- Use 9999px radius for primary buttons — pill shape is standard
- Use warm-tinted halos (`rgba(255,248,235,0.06)`) on featured CTAs
- Keep the page predominantly pure black with obsidian/warm-ink section differentiation
- Use bold (700) uppercase Inter ONLY for signature CTA labels and section counters
- Honor `prefers-reduced-motion` by freezing all particle/scroll animations

### Don't
- Don't use bold (700) Inter for display headings — weights 100–300 are non-negotiable
- Don't use heavy shadows (>0.1 opacity) — the ethereal quality requires whisper-level depth
- Don't use cool gray borders — the system is warm-neutral throughout
- Don't skip the inset rim component — half-pixel inset borders define edges
- Don't apply negative letter-spacing to body text — Inter uses positive tracking
- Don't use sharp corners (<8px) on cards — generous radius is structural
- Don't introduce chromatic brand colors — palette is achromatic with warm off-white accent
- Don't make CTAs opaque and heavy — translucent warm off-white is the signature
- Don't autoplay audio — waveforms are visual motif only
- Don't load Three.js eagerly on mobile — always use `dynamic(() => import(…), { ssr: false })` + Suspense

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single column, hamburger nav, poster image → video, Canvas 2D fallback for particles |
| Tablet | 768–1023px | 2-column grids, simplified Three.js scene (lower particle count) |
| Desktop | ≥1024px | Full layout, custom cursor, full Three.js scene |
| Wide | ≥1440px | Max-width content, wider gutters |

### Touch Targets
- Pill buttons with generous padding (12px–20px) — min 44×44 effective tap area
- Navigation links at 15px with 16–24px spacing
- Mobile: hamburger panel full-screen, 44×44 close button

### Collapsing Strategy
- Navigation: horizontal → hamburger at <1024px
- Feature grids: 3–12 col → stacked
- Hero: maintains centered layout, font scales with `clamp()`
- Scrolltelling: pin-based transitions → simple stacked scroll on mobile (`ScrollTrigger.matchMedia`)
- Portfolio grid: asymmetric masonry → single column
- Spacing compresses proportionally (`py-[192px]` → `py-[96px]`)

### Image & Video Behavior
- Video backgrounds → poster image fallback on `<768px` + `prefers-reduced-motion`
- Three.js canvas → Canvas 2D starfield on `<768px`
- Waveform SVG → static 32-bar SVG on mobile
- Aspect ratios preserved via `aspect-video`, `aspect-[4/5]`, etc.
- Rounded corners maintained across breakpoints

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: Pure Black (`#000000`) or Obsidian (`#0a0908`)
- Text: Pure White (`#ffffff`)
- Secondary text: `rgba(255, 255, 255, 0.78)`
- Muted text: `rgba(255, 255, 255, 0.50)`
- Accent surface: Warm Off-White (`rgba(245, 242, 239, 0.92)`)
- Border: `rgba(255, 255, 255, 0.08)` or `rgba(255, 255, 255, 0.04)`
- Focus ring: `rgba(147, 197, 253, 0.55)`

### Example Component Prompts
- "Create a hero on `#000000` background. Headline at `clamp(64px, 10vw, 180px)` Inter weight 100, line-height 0.95, letter-spacing -0.04em, `#ffffff` text. Subtitle at 18px Inter weight 400, line-height 1.55, letter-spacing 0.18px, `rgba(255,255,255,0.78)` text. Two pill buttons: white (9999px, 12px 20px padding) and warm off-white signature (`rgba(245,242,239,0.92)`, 30px radius, 12px 20px 12px 14px, warm halo `rgba(255,248,235,0.06) 0px 8px 28px`)."
- "Design a card: `#0a0908` background, 20px radius. Shadow: `rgba(255,255,255,0.05) 0 0 0 1px, rgba(0,0,0,0.8) 0 1px 2px, rgba(255,255,255,0.04) 0 8px 24px`. Title at 32px Inter weight 300, body at 16px Inter weight 400 letter-spacing 0.16px, `rgba(255,255,255,0.78)`."
- "Build an obsidian pill button: `#0a0908` bg, 9999px radius. Shadow: `rgba(255,255,255,0.08) 0 0 0 1px, rgba(0,0,0,0.6) 0 4px 16px`. Text at 15px Inter weight 500, `#ffffff`."
- "Create an uppercase CTA label: 13px Inter weight 700, text-transform uppercase, letter-spacing 0.14em, `#ffffff`."
- "Design navigation: transparent sticky header with `backdrop-blur-md` over `rgba(0,0,0,0.6)`. Inter 15px weight 500. White pill CTA right-aligned. Border-bottom: `rgba(255,255,255,0.04)`."

### Iteration Guide
1. Start with black — warm undertone comes from rim lights and warm off-white accents, never backgrounds
2. Inter variable weight 100–300 for display — never bold, lightness is identity
3. Multi-layer rim lights: always inset + outline + halo at sub-0.1 opacity
4. Positive letter-spacing on Inter body (+0.14–0.18px) — airy legibility on black
5. Warm off-white CTA is the signature — `rgba(245,242,239,0.92)` with `rgba(255,248,235,0.06)` halo
6. Pill (9999px) for buttons, generous radius (16–24px) for cards
7. Every animation must honor `prefers-reduced-motion` — this is non-negotiable for an animation-heavy site
