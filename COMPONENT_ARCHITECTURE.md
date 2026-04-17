# Component Architecture - Dynamic Brand Pages

## Component Hierarchy

```
app/(public)/brand/[slug]/page.tsx (Main Page)
│
├── Fetches brand data by slug
├── Fetches brand page content from API
├── Renders sections conditionally based on enabled flags
│
├─── DynamicHeroSection
│    ├── Background image
│    ├── Title (with line breaks)
│    ├── Highlighted text (orange gradient)
│    ├── Description
│    └── CTA Button
│
├─── DynamicCategoriesSection
│    ├── Section title
│    └── Category items (grid)
│        ├── Category image
│        ├── Category name
│        └── Link
│
├─── DynamicBehindTheWorkSection
│    ├── Title
│    ├── Description
│    ├── Statistics (3 items)
│    │   ├── Value
│    │   └── Label
│    └── Images (3 items)
│        ├── Left image
│        ├── Center image
│        └── Right image
│
└─── DynamicShopBySection
     ├── Product cards (grid)
     │   ├── Product image
     │   ├── Product title
     │   ├── CTA Button
     │   └── Badge (optional)
     │       ├── Value
     │       └── Label
```

---

## File Structure

```
app/
├── (public)/
│   ├── brand/
│   │   └── [slug]/
│   │       ├── page.tsx              ← Main dynamic page
│   │       └── not-found.tsx         ← 404 page
│   │
│   └── _components/
│       └── brand/
│           ├── DynamicHeroSection.tsx
│           ├── DynamicCategoriesSection.tsx
│           ├── DynamicBehindTheWorkSection.tsx
│           └── DynamicShopBySection.tsx
│
└── api/
    └── admin/
        └── brand-pages/
            └── [brandId]/
                └── route.ts          ← Already exists
```

---

## Data Flow Through Components

### 1. Main Page (`[slug]/page.tsx`)

```typescript
// Fetches data
const brand = await getBrandBySlug(slug)
const content = await getBrandPageContent(brand.id)

// Renders sections
<DynamicHeroSection data={content.hero} />
<DynamicCategoriesSection data={content.categories} />
<DynamicBehindTheWorkSection data={content.behindTheWork} />
<DynamicShopBySection data={content.shopBy} />
```

### 2. Hero Section Component

```typescript
interface DynamicHeroSectionProps {
  data: {
    backgroundImage: string
    title: string
    highlightedText: string
    description: string
    buttonText: string
    buttonUrl: string
  }
}

// Renders:
// - Background image with overlay
// - Title with line breaks
// - Highlighted text in orange
// - Description
// - CTA button
```

### 3. Categories Section Component

```typescript
interface DynamicCategoriesSectionProps {
  data: {
    sectionTitle: string
    items: Array<{
      id: string
      name: string
      image: string
      href: string
    }>
  }
}

// Renders:
// - Section title
// - Grid of category cards
// - Each card has image, name, and link
```

### 4. Behind The Work Section Component

```typescript
interface DynamicBehindTheWorkSectionProps {
  data: {
    title: string
    description: string
    stats: Array<{ value: string; label: string }>
    images: { left: string; center: string; right: string }
  }
}

// Renders:
// - Title and description
// - Statistics in cards
// - Three images side by side
```

### 5. Shop By Section Component

```typescript
interface DynamicShopBySectionProps {
  data: {
    cards: Array<{
      id: string
      image: string
      title: string
      buttonText: string
      buttonUrl: string
      badge?: { enabled: boolean; value: string; label: string }
    }>
  }
}

// Renders:
// - Grid of product cards
// - Each card has image, title, button
// - Optional badge in corner
```

---

## Component Props Flow

```
Main Page
  ↓
  ├─ hero: BrandPageContent['hero']
  │  └─ DynamicHeroSection
  │     └─ Renders hero banner
  │
  ├─ categories: BrandPageContent['categories']
  │  └─ DynamicCategoriesSection
  │     └─ Renders category grid
  │
  ├─ behindTheWork: BrandPageContent['behindTheWork']
  │  └─ DynamicBehindTheWorkSection
  │     └─ Renders brand story
  │
  └─ shopBy: BrandPageContent['shopBy']
     └─ DynamicShopBySection
        └─ Renders product cards
```

---

## Conditional Rendering

Each section checks the `enabled` flag:

```typescript
// In main page
{content.hero?.enabled && <DynamicHeroSection data={content.hero} />}
{content.categories?.enabled && <DynamicCategoriesSection data={content.categories} />}
{content.behindTheWork?.enabled && <DynamicBehindTheWorkSection data={content.behindTheWork} />}
{content.shopBy?.enabled && <DynamicShopBySection data={content.shopBy} />}
```

This allows admins to:
- Show/hide sections without deleting content
- Reorder sections by changing the order in the main page
- Disable sections temporarily

---

## Styling Architecture

### Tailwind CSS Classes Used

**Hero Section:**
- `min-h-screen` - Full viewport height
- `bg-gradient-to-r` - Gradient overlay
- `text-5xl md:text-6xl lg:text-7xl` - Responsive text sizes
- `bg-clip-text text-transparent` - Text gradient effect

**Categories Section:**
- `grid gap-6 md:grid-cols-2 lg:grid-cols-4` - Responsive grid
- `group hover:scale-110` - Hover effects
- `rounded-lg` - Border radius

**Behind The Work Section:**
- `grid gap-12 lg:grid-cols-2` - Two-column layout
- `rounded-lg bg-white p-6 shadow-sm` - Card styling
- `text-3xl font-bold text-orange-500` - Stat styling

**Shop By Section:**
- `grid gap-8 md:grid-cols-2 lg:grid-cols-3` - Responsive grid
- `absolute right-4 top-4` - Badge positioning
- `bg-gradient-to-r from-orange-400 to-orange-500` - Button gradient

---

## Image Optimization

All components use Next.js `Image` component:

```typescript
<Image
  src={imageUrl}
  alt={altText}
  fill
  className="object-cover"
/>
```

Benefits:
- Automatic optimization
- Lazy loading
- Responsive image serving
- WebP format support
- Prevents layout shift

---

## Type Safety

All components are fully typed:

```typescript
// Hero Section
interface DynamicHeroSectionProps {
  data: {
    backgroundImage: string
    title: string
    highlightedText: string
    description: string
    buttonText: string
    buttonUrl: string
  }
}

// Categories Section
interface DynamicCategoriesSectionProps {
  data: {
    sectionTitle: string
    items: Array<{
      id: string
      name: string
      image: string
      href: string
    }>
  }
}

// Behind The Work Section
interface DynamicBehindTheWorkSectionProps {
  data: {
    title: string
    description: string
    stats: Array<{ value: string; label: string }>
    images: { left: string; center: string; right: string }
  }
}

// Shop By Section
interface DynamicShopBySectionProps {
  data: {
    cards: Array<{
      id: string
      image: string
      title: string
      buttonText: string
      buttonUrl: string
      badge?: { enabled: boolean; value: string; label: string }
    }>
  }
}
```

---

## Reusability

Each component is:
- **Standalone** - Can be used independently
- **Reusable** - Can be used on other pages
- **Configurable** - All content comes from props
- **Testable** - Easy to test with different data
- **Maintainable** - Clear props interface

Example: Use `DynamicHeroSection` on landing page:

```typescript
import { DynamicHeroSection } from "@/app/(public)/_components/brand/DynamicHeroSection"

export default function LandingPage() {
  const heroData = {
    backgroundImage: "/images/landing-hero.jpg",
    title: "Welcome to\nOur Store",
    highlightedText: "Shop Now",
    description: "Discover amazing products",
    buttonText: "Get Started",
    buttonUrl: "/shop"
  }

  return <DynamicHeroSection data={heroData} />
}
```

---

## Performance Considerations

### Caching
- Brand data: Cached for 1 hour
- Brand page content: Cached for 1 hour
- Images: Cached by browser

### Optimization
- Server-side rendering (SSR)
- Static generation with ISR
- Image optimization
- CSS-in-JS (Tailwind)
- Minimal JavaScript

### Bundle Size
- Components are small and focused
- No external dependencies (except Next.js)
- Tree-shakeable exports

---

## Error Handling

### Main Page
- Handles missing brand (shows 404)
- Handles missing content (shows fallback)
- Handles API errors gracefully

### Components
- Handle missing data gracefully
- Render nothing if data is empty
- Use optional chaining (`?.`)

---

## Accessibility

### Semantic HTML
- `<section>` for sections
- `<h1>`, `<h2>`, `<h3>` for headings
- `<button>` for buttons
- `<a>` for links

### ARIA Labels
- Images have `alt` text
- Buttons have descriptive text
- Links have descriptive text

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Links and buttons are focusable
- Proper tab order

---

## Testing Strategy

### Unit Tests
- Test each component with different props
- Test conditional rendering
- Test image loading

### Integration Tests
- Test main page data fetching
- Test section rendering
- Test navigation

### E2E Tests
- Test full user flow
- Test brand page loading
- Test section visibility

---

## Future Enhancements

### Possible Additions
1. **More section types**
   - Testimonials section
   - FAQ section
   - Video section
   - Newsletter signup

2. **Section reordering**
   - Drag-and-drop in admin
   - Custom section order per brand

3. **Advanced styling**
   - Custom colors per brand
   - Custom fonts
   - Custom spacing

4. **Analytics**
   - Track section views
   - Track button clicks
   - Track conversions

5. **A/B Testing**
   - Test different layouts
   - Test different content
   - Track performance

---

## Summary

The component architecture is:
- ✅ Modular and reusable
- ✅ Fully typed with TypeScript
- ✅ Optimized for performance
- ✅ Accessible and semantic
- ✅ Easy to test
- ✅ Easy to maintain
- ✅ Easy to extend

Each component has a single responsibility and can be used independently or together.
