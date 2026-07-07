# Navbar to Shop Page Search Integration

## Overview
Seamless search integration between the main navigation bar and shop page, allowing users to search from anywhere and land on filtered shop results.

## Search Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN NAVBAR                               │
│  [Logo]  [Nav Links]  [🔍 Search Products]  [Cart] [User]  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ User types "treadmill"
                            │ Presses Enter
                            ▼
                    Redirect to:
              /shop?search=treadmill
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SHOP PAGE                               │
│  ┌─────────────┬──────────────────────────────────────────┐ │
│  │  SIDEBAR    │         MAIN CONTENT                      │ │
│  │  [Filters]  │  Products: 15                             │ │
│  │             │  [🔍 treadmill    ]  Sort By: [Best ▼]   │ │
│  │             │  ────────────────────────────────────────  │ │
│  │             │  [Treadmill Products Grid]                │ │
│  └─────────────┴──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. Navbar Search (Desktop)
**Location**: Top right of navbar
**File**: `app/(public)/_components/layout/nav-bar.tsx`

```tsx
<form onSubmit={handleDesktopSearch}>
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search Products"
  />
  <Search icon />
</form>

const handleDesktopSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
  }
};
```

### 2. Navbar Search (Mobile)
**Location**: Inside mobile menu drawer
**File**: `app/(public)/_components/layout/nav-bar.tsx`

```tsx
<form onSubmit={handleMobileSearch}>
  <input
    type="text"
    value={mobileSearchQuery}
    onChange={(e) => setMobileSearchQuery(e.target.value)}
    placeholder="Search Products..."
  />
  <Search icon />
</form>

const handleMobileSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (mobileSearchQuery.trim()) {
    setIsMobileMenuOpen(false);
    window.location.href = `/shop?search=${encodeURIComponent(mobileSearchQuery.trim())}`;
  }
};
```

### 3. Shop Page URL Parameter Handling
**File**: `app/(public)/shop/page.tsx`

```tsx
const searchParams = useSearchParams();
const urlSearch = searchParams.get("search") || "";

const [searchQuery, setSearchQuery] = useState(urlSearch);
const [searchInput, setSearchInput] = useState(urlSearch);

// Update search when URL parameter changes
useEffect(() => {
  if (urlSearch) {
    setSearchQuery(urlSearch);
    setSearchInput(urlSearch);
  }
}, [urlSearch]);
```

### 4. Shop Page Inline Search
**Layout**: Inline with Sort By dropdown

```tsx
<div className="flex flex-col gap-4">
  <p>Products: {totalProducts}</p>
  
  <div className="flex items-center gap-3">
    {/* Search - Takes flex-1 */}
    <form onSubmit={handleSearch} className="flex-1">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for products..."
      />
    </form>
    
    {/* Sort By - Fixed width */}
    <div className="flex items-center gap-2">
      <span>Sort By:</span>
      <select>...</select>
    </div>
  </div>
</div>
```

## User Journeys

### Journey 1: Search from Homepage
```
1. User on homepage
2. Types "dumbbells" in navbar search
3. Presses Enter
4. Redirected to /shop?search=dumbbells
5. Shop page shows filtered results
6. User can refine with additional filters
```

### Journey 2: Search from Any Page
```
1. User browsing product details
2. Wants to search for something else
3. Uses navbar search
4. Redirected to shop with results
5. Can continue shopping
```

### Journey 3: Refine Search on Shop Page
```
1. User already on shop page
2. Uses inline search to refine
3. Results update immediately
4. Can combine with other filters
```

## Technical Features

### URL Parameter Handling
- Uses Next.js `useSearchParams()` hook
- Reads `search` parameter from URL
- Automatically applies search on page load
- Maintains search state across navigation

### State Synchronization
- Navbar search → URL parameter → Shop page state
- Shop page inline search → Updates state directly
- Both methods work seamlessly together

### Search Behavior
- **Navbar**: Redirects to shop page with search parameter
- **Shop Page**: Updates results without page reload
- **URL**: Always reflects current search query
- **Back Button**: Works correctly with browser history

### Responsive Design
- **Desktop**: Navbar search in header, inline search on shop page
- **Mobile**: Navbar search in drawer, inline search full width
- **Tablet**: Adaptive layout for both

## Benefits

1. **Consistent UX**: Search works the same everywhere
2. **Shareable URLs**: Users can share search results
3. **Browser History**: Back/forward buttons work correctly
4. **SEO Friendly**: Search queries in URL
5. **Fast**: No page reload for inline search
6. **Intuitive**: Users expect navbar search to work

## Testing Checklist

- [ ] Desktop navbar search redirects to shop
- [ ] Mobile navbar search redirects to shop
- [ ] Shop page reads URL search parameter
- [ ] Inline search updates results
- [ ] Search combines with other filters
- [ ] Back button works correctly
- [ ] URL updates with search query
- [ ] Empty search handled gracefully
- [ ] Special characters encoded properly
- [ ] Search persists across page refreshes
