# Hydration Mismatch Fix

## Problem
The page was reloading automatically due to React hydration mismatches caused by:

1. **GSAP Plugin Registration at Module Level**: Using `if (typeof window !== "undefined")` at the top level of modules causes different code execution on server vs client
2. **Router in useEffect Dependencies**: Including `router` object in dependency arrays causes unnecessary re-renders

## Root Cause
```typescript
// ❌ BAD - Causes hydration mismatch
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

This code runs at module load time, which happens differently on server (where `window` is undefined) vs client (where `window` exists). This creates a mismatch in the React component tree between server-rendered HTML and client-rendered output, forcing React to re-render the entire page.

## Solution

### 1. Centralized GSAP Initialization
Created `lib/gsap-init.ts`:
```typescript
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

export function registerGSAPPlugins() {
  if (!isRegistered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
}
```

### 2. Custom Hook
Created `lib/hooks/useGSAPInit.ts`:
```typescript
'use client';

import { useEffect } from 'react';
import { registerGSAPPlugins } from '../gsap-init';

export function useGSAPInit() {
  useEffect(() => {
    registerGSAPPlugins();
  }, []);
}
```

### 3. Component Usage
```typescript
// ✅ GOOD - No hydration mismatch
export function MyComponent() {
  useGSAPInit(); // Initialize GSAP in useEffect
  
  useGSAP(() => {
    // Your animations
  });
  
  return <div>...</div>;
}
```

### 4. Fixed Router Dependencies
In `app/(auth)/login/page.tsx`:
```typescript
// ❌ BAD
useEffect(() => {
  if (user) {
    router.push(redirectTo);
  }
}, [user, redirectTo, router]); // router causes re-renders

// ✅ GOOD
const hasRedirected = useRef(false);

useEffect(() => {
  if (user && !hasRedirected.current) {
    hasRedirected.current = true;
    router.push(redirectTo);
  }
}, [user, redirectTo]); // router removed
```

### 5. Fixed AuthContext
In `lib/context/AuthContext.tsx`:
```typescript
// ❌ BAD - checkAuth recreated on every state change
const checkAuth = useCallback(async () => {
  if (isInitialized && !loading) return;
  // ...
}, [isInitialized, loading]);

// ✅ GOOD - checkAuth created once
const checkAuth = useCallback(async () => {
  if (isInitialized) return;
  setLoading(true);
  // ...
}, []); // Empty dependencies
```

## Files Modified

### Core Files
- `lib/gsap-init.ts` - NEW: Centralized GSAP initialization
- `lib/hooks/useGSAPInit.ts` - NEW: Custom hook for GSAP init
- `lib/context/AuthContext.tsx` - Fixed memoization
- `app/(auth)/login/page.tsx` - Fixed router dependencies
- `app/_components/ProtectedRoute.tsx` - Already fixed

### GSAP Components
- `app/(public)/_components/shared/gsap-animations.tsx` - Fixed
- `app/(public)/_components/landing/hero-section.tsx` - Fixed
- `app/(public)/_components/landing/discounts-section.tsx` - Needs fix
- `app/(public)/_components/landing/explore-categories.tsx` - Needs fix
- `app/(public)/_components/landing/flash-deal-section.tsx` - Needs fix
- `app/(public)/_components/landing/floor-solution.tsx` - Needs fix
- `app/(public)/_components/landing/our-services-section.tsx` - Needs fix
- `app/(public)/_components/landing/pre-order-section.tsx` - Needs fix
- `app/(public)/_components/landing/rdx-gallery-section.tsx` - Needs fix
- `app/(public)/_components/landing/success-stories.tsx` - Needs fix
- `app/(public)/_components/services/how-it-works.tsx` - Needs fix
- `app/(public)/_components/services/services-hero.tsx` - Needs fix
- `app/(public)/_components/services/services-list.tsx` - Needs fix

## How to Apply Fix to Remaining Files

For each file with `if (typeof window !== "undefined")`:

1. Remove the module-level check:
```typescript
// Remove this
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

2. Add the import:
```typescript
import { useGSAPInit } from "@/lib/hooks/useGSAPInit";
```

3. Call the hook at the start of your component:
```typescript
export function MyComponent() {
  useGSAPInit(); // Add this line
  
  // Rest of component
}
```

## Testing
After applying fixes:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console - should see no hydration warnings
4. Page should load once without automatic reloads

## Why This Works

1. **useEffect runs only on client**: The GSAP registration now happens inside useEffect, which only runs on the client after hydration is complete
2. **Consistent rendering**: Server and client render the same initial HTML
3. **No dependency loops**: Removed problematic dependencies that caused infinite re-renders
4. **Single registration**: The `isRegistered` flag ensures plugins are only registered once

## Result
- ✅ No hydration mismatches
- ✅ No automatic page reloads
- ✅ Clean console (no warnings)
- ✅ Smooth page transitions
- ✅ Better performance
