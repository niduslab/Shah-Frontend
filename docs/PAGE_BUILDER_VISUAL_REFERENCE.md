# Page Builder Visual Reference Guide

## 🎨 Complete Visual Layouts

This guide provides detailed visual representations of all section templates to help designers and developers understand the exact layout structure.

---

## Landing Page Templates

### 1. Landing Hero Grid (4-Section Layout)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌───────────────────────────────────┐  ┌──────────────────┐  │
│  │                                   │  │                  │  │
│  │                                   │  │  Perfect Gear    │  │
│  │         MAIN HERO CARD            │  │  Awaits          │  │
│  │         (Large - 2/3 width)       │  │                  │  │
│  │                                   │  │  [Shop Now]      │  │
│  │  Elevate Your                     │  │                  │  │
│  │  Fitness Journey                  │  └──────────────────┘  │
│  │                                   │                        │
│  │  ┌──────────┐                     │  ┌──────────────────┐  │
│  │  │  Up to   │                     │  │                  │  │
│  │  │   40%    │                     │  │  Shine Bright    │  │
│  │  │Discounts │                     │  │  with Weights    │  │
│  │  └──────────┘                     │  │                  │  │
│  │                                   │  │  [Shop Now]      │  │
│  │  [Shop Now]                       │  │                  │  │
│  │                                   │  └──────────────────┘  │
│  │                                   │                        │
│  │                                   │  ┌──────────────────┐  │
│  │                                   │  │                  │  │
│  │                                   │  │   TOP PICKS      │  │
│  │                                   │  │                  │  │
│  │                                   │  │  [Shop Now]      │  │
│  │                                   │  │                  │  │
│  └───────────────────────────────────┘  └──────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Grid Structure:
- Main Card: 2 columns × 3 rows (left side)
- Top Right: 1 column × 1 row
- Bottom Left: 1 column × 1 row  
- Bottom Right: 1 column × 1 row

CSS Grid:
grid-template-columns: 2fr 1fr;
grid-template-rows: repeat(3, 1fr);
gap: 16px;
height: 600px;
```

### 1b. Landing Hero Grid (Video Mode)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║                                                           ║ │
│  ║                                                           ║ │
│  ║                    VIDEO PLAYER                           ║ │
│  ║                  (Full Width/Height)                      ║ │
│  ║                                                           ║ │
│  ║                    ▶ Play Button                          ║ │
│  ║                                                           ║ │
│  ║                                                           ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Features:
- Replaces entire 4-section grid
- Full-width video player
- Poster image before play
- Controls overlay
```

---

### 2. Category Cards (Two Column)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐│
│  │                              │  │                          ││
│  │   ┌────────────┐             │  │   ┌────────────┐         ││
│  │   │ Save all   │             │  │   │  Up to     │         ││
│  │   │    45%     │             │  │   │   30%      │         ││
│  │   └────────────┘             │  │   └────────────┘         ││
│  │                              │  │                          ││
│  │  Cardio Equipment's          │  │  Free Weight Equipment's ││
│  │                              │  │                          ││
│  │  Burn calories and boost     │  │  Build strength and      ││
│  │  endurance with our premium  │  │  muscle with our         ││
│  │  cardio machines             │  │  professional weights    ││
│  │                              │  │                          ││
│  │  [Shop Now →]                │  │  [Shop Now →]            ││
│  │                              │  │                          ││
│  └──────────────────────────────┘  └──────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Layout:
- Two equal-width cards
- Circular badge overlay (top-right)
- Full-width background image
- Text overlay at bottom
- Yellow CTA button

CSS:
display: grid;
grid-template-columns: 1fr 1fr;
gap: 24px;
```

---

### 3. Pre-Order Showcase

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Pre-Order Now & Save Big          [View All Preorder →]       │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ ┌──────┐ │  │          │  │          │  │          │      │
│  │ │Save  │ │  │          │  │          │  │          │      │
│  │ │ 30%  │ │  │          │  │          │  │          │      │
│  │ └──────┘ │  │          │  │          │  │          │      │
│  │          │  │          │  │          │  │          │      │
│  │ Product  │  │ Product  │  │ Product  │  │ Product  │      │
│  │  Image   │  │  Image   │  │  Image   │  │  Image   │      │
│  │          │  │          │  │          │  │          │      │
│  │          │  │          │  │          │  │          │      │
│  │Nordictrk │  │  Step    │  │Commercial│  │  RW900   │      │
│  │T Series  │  │ Climber  │  │   S22i   │  │  Rower   │      │
│  │   10     │  │    XL    │  │  Cycle   │  │          │      │
│  │          │  │          │  │          │  │          │      │
│  │[Preorder]│  │[Preorder]│  │[Preorder]│  │[Preorder]│      │
│  │          │  │          │  │          │  │          │      │
│  │  • • •   │  │          │  │          │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Features:
- Section heading (left)
- "View All" link (right)
- 2-6 column grid
- Circular "Save X%" badge (optional)
- Carousel dots (optional)
- Yellow CTA buttons

CSS:
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 20px;
```


---

## Brand Page Templates

### 4. Brand Full Width CTA Banner (Hero)

```
┌─────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║                                                           ║ │
│  ║  [Background Image: Person on Treadmill]                 ║ │
│  ║                                                           ║ │
│  ║  ┌─────────────────────────────────────────────┐         ║ │
│  ║  │                                             │         ║ │
│  ║  │  Turn Your Home Into A Complete             │         ║ │
│  ║  │  Fitness Space  [Yellow Text]               │         ║ │
│  ║  │                                             │         ║ │
│  ║  │  NordicTrack is a leader in home fitness   │         ║ │
│  ║  │  equipment, known for innovative            │         ║ │
│  ║  │  treadmills, ellipticals, and exercise      │         ║ │
│  ║  │  bikes with iFIT technology integration.    │         ║ │
│  ║  │                                             │         ║ │
│  ║  │  [Shop Nordictrack →]                       │         ║ │
│  ║  │                                             │         ║ │
│  ║  └─────────────────────────────────────────────┘         ║ │
│  ║                                                           ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────────────────┘

Features:
- Full-width background image
- Dark overlay (adjustable opacity)
- Content box (left, center, or right aligned)
- Colored subheading (yellow default)
- Optional brand logo
- Yellow CTA button

Height Options:
- Small: 400px
- Medium: 600px
- Large: 800px
```

---

### 5. Brand Category Grid

```
┌─────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║  [Dark Background: #2c2c2c]                              ║ │
│  ║                                                           ║ │
│  ║         Explore The Nordictrack Categories                ║ │
│  ║                                                           ║ │
│  ║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐║ │
│  ║  │          │  │          │  │          │  │          │║ │
│  ║  │  Bikes   │  │Treadmills│  │Elliptical│  │  Rowers  │║ │
│  ║  │  Image   │  │  Image   │  │  Image   │  │  Image   │║ │
│  ║  │          │  │          │  │          │  │          │║ │
│  ║  │          │  │          │  │          │  │          │║ │
│  ║  │  Bikes   │  │Treadmills│  │Elliptical│  │  Rowers  │║ │
│  ║  │          │  │          │  │          │  │          │║ │
│  ║  └──────────┘  └──────────┘  └──────────┘  └──────────┘║ │
│  ║                                                           ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────────────────┘

Features:
- Dark background (#2c2c2c default)
- White text
- 2-6 column grid
- Category images
- Category titles
- Optional product count
- Hover effects (zoom/lift)

CSS:
background: #2c2c2c;
color: #ffffff;
padding: 80px 0;
```

---

### 6. Brand Featured Products

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐│
│  │                              │  │                          ││
│  │                              │  │                          ││
│  │      Treadmill Image         │  │    Elliptical Image      ││
│  │                              │  │                          ││
│  │                              │  │                          ││
│  │  ┌────────────┐              │  │                          ││
│  │  │  12 MPH    │              │  │                          ││
│  │  │   speed    │              │  │                          ││
│  │  └────────────┘              │  │                          ││
│  │                              │  │                          ││
│  │  T Series 16 Treadmill       │  │  Step Climber XL         ││
│  │                              │  │                          ││
│  │  [Shop Treadmill →]          │  │  [Shop Ellipticals →]    ││
│  │                              │  │                          ││
│  └──────────────────────────────┘  └──────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Features:
- Two large product cards
- Equal width (50/50)
- Product images
- Optional badge overlay
- Product titles
- Yellow CTA buttons

CSS:
display: grid;
grid-template-columns: 1fr 1fr;
gap: 32px;
```

---

### 7. Brand Content with Images

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌────────────────────────┐  ┌──────────────────────────────┐ │
│  │                        │  │  ┌──────────┐  ┌──────────┐  │ │
│  │ Thinking Behind        │  │  │          │  │          │  │ │
│  │ the Work               │  │  │  Image 1 │  │  Image 2 │  │ │
│  │                        │  │  │          │  │          │  │ │
│  │ NordicTrack delivers   │  │  └──────────┘  └──────────┘  │ │
│  │ a premium personal     │  │                              │ │
│  │ training experience... │  │  ┌──────────────────────┐   │ │
│  │                        │  │  │                      │   │ │
│  │ ┌────────────────────┐ │  │  │      Image 3         │   │ │
│  │ │      51 +          │ │  │  │                      │   │ │
│  │ │ Years of Experience│ │  │  └──────────────────────┘   │ │
│  │ └────────────────────┘ │  │                              │ │
│  │                        │  │                              │ │
│  │ ┌────────────────────┐ │  │                              │ │
│  │ │      1M +          │ │  │                              │ │
│  │ │ Happy Customers    │ │  │                              │ │
│  │ └────────────────────┘ │  │                              │ │
│  │                        │  │                              │ │
│  │ ┌────────────────────┐ │  │                              │ │
│  │ │      50 +          │ │  │                              │ │
│  │ │ Available In       │ │  │                              │ │
│  │ │ Countries          │ │  │                              │ │
│  │ └────────────────────┘ │  │                              │ │
│  │                        │  │                              │ │
│  └────────────────────────┘  └──────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Features:
- Two-column layout (40/60 or 50/50)
- Text content (left)
- Image collage (right)
- Stats display (3-5 stats)
- Flexible image layout

Layout Options:
- text_left (default)
- text_right
```

---

### 8. Brand Product Hero

```
┌─────────────────────────────────────────────────────────────────┐
│  [Light Blue Background: #e8f4f8]                              │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────────────────────┐ │
│  │                  │    │                                  │ │
│  │                  │    │  Smart Rowing.                   │ │
│  │   Rowing         │    │  Full-Body Results.              │ │
│  │   Machine        │    │  Real Progress.                  │ │
│  │   Image          │    │                                  │ │
│  │                  │    │  Experience a powerful,          │ │
│  │                  │    │  low-impact workout that         │ │
│  │                  │    │  engages every major muscle      │ │
│  │                  │    │  group. Track your progress      │ │
│  │                  │    │  with iFIT technology.           │ │
│  │                  │    │                                  │ │
│  │                  │    │  [Shop Rowers →]                 │ │
│  │                  │    │                                  │ │
│  └──────────────────┘    └──────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Features:
- Side-by-side layout
- Product image (40-60% width)
- Content area
- Heading + subheading
- Description text
- Yellow CTA button
- Background color support

Layout Options:
- image_left (default)
- image_right

Image Width Options:
- 40%
- 50%
- 60%
```


---

## Shared Templates

### 9. Stats Section

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │              │  │              │  │              │        │
│  │     51+      │  │     1M+      │  │     50+      │        │
│  │              │  │              │  │              │        │
│  │    Years     │  │   Happy      │  │  Available   │        │
│  │      of      │  │  Customers   │  │      In      │        │
│  │  Experience  │  │              │  │  Countries   │        │
│  │              │  │              │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Features:
- 2-6 stats per row
- Large value text
- Descriptive label
- Optional icon
- Centered alignment

CSS:
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 40px;
text-align: center;
```

---

### 10. Category Grid

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    Shop By Category                             │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │          │  │          │  │          │  │          │      │
│  │ Category │  │ Category │  │ Category │  │ Category │      │
│  │  Image   │  │  Image   │  │  Image   │  │  Image   │      │
│  │          │  │          │  │          │  │          │      │
│  │  Bikes   │  │ Weights  │  │  Cardio  │  │  Yoga    │      │
│  │ 45 items │  │ 32 items │  │ 28 items │  │ 15 items │      │
│  │          │  │          │  │          │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │          │  │          │  │          │  │          │      │
│  │ Category │  │ Category │  │ Category │  │ Category │      │
│  │  Image   │  │  Image   │  │  Image   │  │  Image   │      │
│  │          │  │          │  │          │  │          │      │
│  │ Rowers   │  │ Benches  │  │  Mats    │  │  Bands   │      │
│  │ 12 items │  │ 20 items │  │ 35 items │  │ 18 items │      │
│  │          │  │          │  │          │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Features:
- Optional section title
- 2-6 column grid
- Category images
- Category names
- Optional product count
- Optional border
- Hover effects

CSS:
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 24px;
```

---

### 11. Full Width Banner

```
┌─────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║                                                           ║ │
│  ║  [Background Image]                                       ║ │
│  ║                                                           ║ │
│  ║                    Flash Sale                             ║ │
│  ║                 Limited Time Offer                        ║ │
│  ║                                                           ║ │
│  ║              ┌─────────────────────┐                      ║ │
│  ║              │  23h : 45m : 12s    │                      ║ │
│  ║              └─────────────────────┘                      ║ │
│  ║                                                           ║ │
│  ║                  [Shop Now →]                             ║ │
│  ║                                                           ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────────────────┘

Features:
- Full-width background image
- Title + subtitle
- Optional countdown timer
- CTA button
- Adjustable height

Height Options:
- 300px
- 400px
- 500px
- 600px
```

---

## Color Scheme

### Primary Colors
```css
--yellow-cta: #FFC107;        /* CTA buttons */
--orange-badge: #FF6F00;      /* Discount badges */
--dark-bg: #2c2c2c;           /* Dark sections */
--light-bg: #f8f9fa;          /* Light sections */
--blue-tint: #e8f4f8;         /* Product hero background */
```

### Text Colors
```css
--text-dark: #1a1a1a;         /* Headings */
--text-body: #4a4a4a;         /* Body text */
--text-light: #ffffff;        /* On dark backgrounds */
--text-muted: #6b7280;        /* Secondary text */
```

### Accent Colors
```css
--success: #10b981;           /* Success states */
--error: #ef4444;             /* Error states */
--warning: #f59e0b;           /* Warning states */
--info: #3b82f6;              /* Info states */
```

---

## Typography Scale

### Headings
```css
h1: 48px / 3rem (font-bold)
h2: 36px / 2.25rem (font-bold)
h3: 24px / 1.5rem (font-semibold)
h4: 20px / 1.25rem (font-semibold)
h5: 18px / 1.125rem (font-medium)
h6: 16px / 1rem (font-medium)
```

### Body Text
```css
body: 16px / 1rem (font-normal)
small: 14px / 0.875rem (font-normal)
xs: 12px / 0.75rem (font-normal)
```

### Line Heights
```css
tight: 1.25
normal: 1.5
relaxed: 1.75
loose: 2
```

---

## Spacing System

### Padding/Margin Scale
```css
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
4xl: 80px
5xl: 96px
```

### Section Spacing
```css
section-padding-y: 80px (desktop), 48px (mobile)
section-padding-x: 24px
container-max-width: 1280px
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices (large desktops) */
2xl: 1536px /* 2X large devices (larger desktops) */
```

### Grid Adjustments
```css
/* Landing Hero Grid */
Mobile: 1 column (stacked)
Tablet: 2 columns
Desktop: 2fr 1fr (main + 3 small)

/* Category Cards */
Mobile: 1 column (stacked)
Tablet: 2 columns
Desktop: 2 columns

/* Pre-Order Showcase */
Mobile: 1 column
Tablet: 2 columns
Desktop: 4 columns

/* Category Grid */
Mobile: 2 columns
Tablet: 3 columns
Desktop: 4 columns
```

---

## Animation Guidelines

### Hover Effects
```css
/* Image Zoom */
transition: transform 0.5s ease;
hover: scale(1.05);

/* Button Hover */
transition: all 0.3s ease;
hover: brightness(1.1);

/* Card Lift */
transition: transform 0.3s ease, box-shadow 0.3s ease;
hover: translateY(-4px), box-shadow: 0 10px 20px rgba(0,0,0,0.1);
```

### Loading States
```css
/* Skeleton Loader */
background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
animation: shimmer 1.5s infinite;

/* Fade In */
animation: fadeIn 0.5s ease-in;
```

---

## Accessibility Guidelines

### Contrast Ratios
- Normal text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum (WCAG AA)
- UI components: 3:1 minimum

### Focus States
```css
focus: outline-2px solid #3b82f6;
focus: outline-offset: 2px;
```

### Alt Text Requirements
- All images must have descriptive alt text
- Decorative images: alt=""
- Functional images: describe function

---

## Summary

This visual reference provides:
✅ Detailed layout diagrams for all 11+ templates
✅ CSS grid structures
✅ Color scheme definitions
✅ Typography scale
✅ Spacing system
✅ Responsive breakpoints
✅ Animation guidelines
✅ Accessibility standards

Use this guide when:
- Designing new sections
- Implementing frontend components
- Creating visual mockups
- Training new team members

