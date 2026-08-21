---
name: Industrial Precision Core
colors:
  surface: '#121315'
  surface-dim: '#121315'
  surface-bright: '#38393b'
  surface-container-lowest: '#0d0e10'
  surface-container-low: '#1b1c1e'
  surface-container: '#1f2022'
  surface-container-high: '#292a2c'
  surface-container-highest: '#343537'
  on-surface: '#e3e2e5'
  on-surface-variant: '#e3bebb'
  inverse-surface: '#e3e2e5'
  inverse-on-surface: '#303033'
  outline: '#aa8987'
  outline-variant: '#5b403f'
  surface-tint: '#ffb3b0'
  primary: '#ffb3b0'
  on-primary: '#68000f'
  primary-container: '#be1e2d'
  on-primary-container: '#ffd3d1'
  inverse-primary: '#b91a2a'
  secondary: '#c6c6c9'
  on-secondary: '#2f3133'
  secondary-container: '#454749'
  on-secondary-container: '#b4b5b7'
  tertiary: '#c4c6cb'
  on-tertiary: '#2d3135'
  tertiary-container: '#5f6266'
  on-tertiary-container: '#dcdee3'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b0'
  on-primary-fixed: '#410006'
  on-primary-fixed-variant: '#930019'
  secondary-fixed: '#e2e2e5'
  secondary-fixed-dim: '#c6c6c9'
  on-secondary-fixed: '#1a1c1e'
  on-secondary-fixed-variant: '#454749'
  tertiary-fixed: '#e0e2e7'
  tertiary-fixed-dim: '#c4c6cb'
  on-tertiary-fixed: '#191c20'
  on-tertiary-fixed-variant: '#44474b'
  background: '#121315'
  on-background: '#e3e2e5'
  surface-variant: '#343537'
  safety-yellow: '#FACC15'
  steel-silver: '#94A3B8'
  industrial-red-dark: '#8B1521'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 80px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1em
  stat-lg:
    fontFamily: Montserrat
    fontSize: 56px
    fontWeight: '800'
    lineHeight: '1'
    letterSpacing: -0.02em
spacing:
  container-max: 1280px
  gutter: 2rem
  section-padding-lg: 8rem
  section-padding-sm: 4rem
  element-gap: 1.5rem
---

## Brand & Style

The design system is engineered to project **authority, engineering excellence, and heavy-duty reliability**. It targets industrial procurement officers and engineers who value precision and structural integrity.

The aesthetic follows a **High-Contrast Modern Industrial** movement. It utilizes a predominantly dark, "machined" environment to create a high-end feel, punctuated by stark white sections for technical documentation and product specifications. This juxtaposition mirrors the transition from a dark, heavy manufacturing floor to a clean, precise engineering lab. The mood is serious, established, and unapologetically technical.

## Colors

The palette is rooted in industrial reality. **Industrial Red** is the primary driver of action and brand identity, used for critical CTAs and lead-generation anchors. **Charcoal Grey** and **Neutral Black** form the foundation of the dark mode surfaces, providing a low-glare environment that makes product photography "pop."

**Safety Yellow** is reserved strictly for high-priority highlights, warnings, or specialized certification badges (ZED Gold). **Steel Silver** serves as a sophisticated neutral for secondary text and borders, mimicking the metallic nature of the fasteners themselves. Clean white backgrounds are used exclusively for data-heavy sections, such as technical specification tables and CAD drawing downloads, ensuring maximum legibility.

## Typography

Typography is used as a structural element. Headlines are set in **Montserrat**, chosen for its geometric, architectural stability. Large display sizes use extra-bold weights to command attention in hero sections.

**Inter** provides a highly legible, neutral base for long-form technical descriptions and paragraphs. To reinforce the engineering narrative, **JetBrains Mono** is introduced for labels, technical specs, and small captions, evoking the precision of technical blue-prints and modern CNC programming. All labels should be set in uppercase with increased letter spacing for a refined industrial look.

## Layout & Spacing

The layout utilizes a **12-column fixed grid** with generous margins to evoke a sense of premium "breathing room." This whitespace is intentional; it frames products as high-precision instruments rather than bulk commodities.

- **Desktop:** 12 columns, 32px gutters, 80px side margins.
- **Tablet:** 8 columns, 24px gutters, 40px side margins.
- **Mobile:** 4 columns, 16px gutters, 20px side margins.

Sections should alternate between dark and light themes to signal transitions between brand storytelling (dark) and technical utility (light). Large-scale vertical padding (128px+) is used between major sections to maintain the high-end editorial feel.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and **Hard Outlines** rather than soft shadows. In the dark theme, depth is created by moving from the base neutral (`#0D0E10`) to slightly lighter surface containers (`#1A1C1E`).

When depth is required for interactive cards, use **Steel Silver** low-opacity borders (1px) to define boundaries. Shadows, if used, should be "sharp" and high-offset, mimicking the harsh directional lighting found in industrial photography. Avoid soft, blurry ambient shadows which feel too "consumer software."

## Shapes

The design system employs a **Sharp (0px)** corner radius across all primary components. This choice reinforces the "hard" nature of steel manufacturing and the precision of industrial engineering. Rectilinear shapes reflect the structural grids of the fasteners themselves. Only small functional icons or status dots may deviate from this rule.

## Components

### Buttons
- **Primary:** Industrial Red background, white text, 0px radius. Hover state shifts to Industrial Red Dark. Use JetBrains Mono for button labels.
- **Secondary:** Transparent background, 2px Steel Silver border, white text.
- **Action:** For "Download CAD" or "Request Quote," use a Safety Yellow accent line on the left side of the button.

### Product Categories
- Display categories (Screws, Bolts, etc.) as large-scale tiles with high-contrast grayscale photography. On hover, apply an Industrial Red overlay with the product name in Montserrat Bold.

### Trust Blocks (Certifications)
- Use a "Technical Ledger" style: Monochrome logos of ISO/IATF standards on a light grey background with JetBrains Mono captions detailing the certification number and validity.

### Input Fields
- Underlined style only (no full box). Use a 1px Steel Silver bottom border that turns Industrial Red on focus. Placeholder text in Inter (Italic).

### Cards
- Use "Ghost Cards" for technical specs—no background fill, just a 1px border. For "40 Years of Excellence" style blocks, use a solid Charcoal Grey fill with Industrial Red accent bars.