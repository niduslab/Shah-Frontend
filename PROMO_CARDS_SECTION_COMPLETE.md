# Promo Cards Section - Complete

## Overview
Added a new dynamic promo cards section to the landing page admin panel, displaying promotional cards for Cardio Equipment and Free Weight Equipment.

## What Was Added

### 1. Admin Panel Section
**Location:** `http://localhost:3000/admin/dynamic-contents/landing-page`

**Features:**
- Preview of 2 promo cards (Cardio & Free Weight)
- Click any card to edit
- Upload images for each card
- Edit title, description, button text/URL
- Toggle discount badge on/off
- Edit badge text and percentage
- Enable/disable entire section

### 2. Frontend Component
**File:** `app/(public)/_components/landing/promo-cards-section.tsx`

**Features:**
- Fetches data from `/api/hero-sections`
- Displays 2 cards side-by-side
- Hover animations (scale effect)
- Discount badges
- Responsive design
- GSAP scroll animations

### 3. Data Structure

```typescript
interface PromoCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
  badge: {
    enabled: boolean;
    text: string;
    percentage: string;
  };
}

interface PromoCardsSection {
  id: string;
  enabled: boolean;
  cards: PromoCard[];
}
```

### 4. Default Content

**Card 1 - Cardio Equipment:**
- Title: "Cardio Equipment's"
- Description: "Burn calories and boost endurance with our premium cardio machines"
- Button: "Shop Now" → `/shop?category=cardio`
- Badge: "Save up to 45%"

**Card 2 - Free Weight Equipment:**
- Title: "Free Weight Equipment's"
- Description: "Burn calories and boost endurance with our premium cardio machines"
- Button: "Shop Now" → `/shop?category=weights`
- Badge: "Up to 30%"

## How to Use

### Admin Side:
1. Go to: `http://localhost:3000/admin/dynamic-contents/landing-page`
2. Scroll down to "Promo Cards Section Preview"
3. Click on any card to edit
4. Upload new image (saves to `/images/landing/promo/`)
5. Edit title, description, button text/URL
6. Toggle badge and edit badge text/percentage
7. Click "Save Changes"

### Frontend Display:
1. Visit: `http://localhost:3000/`
2. Scroll down past the pre-order section
3. See the 2 promo cards displayed
4. Cards are clickable and link to shop pages

## Files Modified

1. `app/admin/dynamic-contents/landing-page/page.tsx`
   - Added PromoCard interfaces
   - Added promoCardsSection state
   - Added handlePromoCardImageUpload function
   - Added promo cards preview section
   - Added promo cards edit modal
   - Updated fetch and save functions

2. `app/api/admin/hero-sections/route.ts`
   - Added promoCardsSection to default data

3. `app/api/hero-sections/route.ts`
   - Added promoCardsSection to default data

4. `app/(public)/page.tsx`
   - Imported PromoCardsSection component
   - Added component after PreOrderSection

## Files Created

1. `app/(public)/_components/landing/promo-cards-section.tsx`
   - New component for displaying promo cards
   - Fetches data from API
   - GSAP animations
   - Responsive design

## Image Upload

Images are uploaded to: `public/images/landing/promo/`

Example URLs:
- `/images/landing/promo/1234567890-cardio-equipment.jpg`
- `/images/landing/promo/1234567890-free-weight-equipment.jpg`

## Testing Checklist

- [ ] Admin panel shows promo cards section
- [ ] Can click cards to edit
- [ ] Can upload images for each card
- [ ] Can edit title, description, button
- [ ] Can toggle badge on/off
- [ ] Can edit badge text and percentage
- [ ] Can enable/disable entire section
- [ ] Save changes works
- [ ] Frontend displays cards correctly
- [ ] Cards are clickable
- [ ] Hover animations work
- [ ] Responsive on mobile

## Summary

✅ Promo cards section added to admin panel
✅ Image upload functionality working
✅ Frontend component created and integrated
✅ Data flows from admin → API → frontend
✅ Fully dynamic and editable
✅ Animations and hover effects included

The promo cards section is now live and fully functional!
