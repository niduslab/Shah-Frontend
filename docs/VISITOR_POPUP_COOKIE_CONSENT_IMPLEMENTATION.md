# Visitor Popup & Cookie Consent Implementation

## Overview
This implementation adds two key features to the website:
1. **Cookie Consent Banner** - Shows at the bottom of the page for first-time visitors
2. **Visitor Popup** - Collects visitor information (name, email, phone) with backend integration

## Files Created

### Frontend Components

#### 1. Cookie Consent Banner
**Location:** `app/(public)/_components/shared/cookie-consent.tsx`
- Shows at the bottom of the page
- Appears only once per visitor
- Stores consent in localStorage
- Options: Accept All or Decline
- Includes link to privacy policy

#### 2. Visitor Popup
**Location:** `app/(public)/_components/shared/visitor-popup.tsx`
- Modal popup that appears after 5 seconds (configurable)
- Collects: Name (required), Email (optional), Phone (optional)
- Form validation
- Success message after submission
- Stores submission status in localStorage
- Integrates with backend API

#### 3. Admin Dashboard
**Location:** `app/admin/visitor-popups/page.tsx`
- View all visitor submissions
- Statistics cards (total, with email, with phone, today)
- Search functionality
- Filter by contact info (all, email, phone, both)
- Export to CSV
- View detailed submission info
- Delete submissions
- Pagination support

#### 4. Admin Modal Components
**Location:** `app/admin/visitor-popups/_components/`
- `VisitorDetailsModal.tsx` - Shows full visitor details
- `DeleteConfirmModal.tsx` - Confirmation dialog for deletion

### Backend Integration

#### Custom Hooks
**Location:** `lib/hooks/admin/useVisitorPopups.ts`
- `useVisitorPopups` - Fetch paginated visitor submissions
- `useVisitorPopup` - Fetch single submission
- `useVisitorPopupStatistics` - Fetch statistics
- `useDeleteVisitorPopup` - Delete submission

## Configuration

### Popup Delay
You can adjust the popup delay in `app/(public)/layout.tsx`:
```tsx
<VisitorPopup delay={5000} /> // 5 seconds (5000ms)
```

### API Endpoints Used

#### Public Endpoint (No Auth)
```
POST /api/visitor-popup
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+123456"
}
```

#### Admin Endpoints (Auth + Admin Role Required)
```
GET    /api/admin/visitor-popups              # List submissions
GET    /api/admin/visitor-popups/statistics   # Get statistics
GET    /api/admin/visitor-popups/export       # Export CSV
GET    /api/admin/visitor-popups/{id}         # Get single submission
DELETE /api/admin/visitor-popups/{id}         # Delete submission
```

## Features

### Cookie Consent
- ✅ Shows only once per visitor
- ✅ Bottom banner design
- ✅ Accept/Decline options
- ✅ Privacy policy link
- ✅ Responsive design
- ✅ LocalStorage persistence

### Visitor Popup
- ✅ Configurable delay
- ✅ Shows only once per visitor
- ✅ Form validation
- ✅ Required/optional fields
- ✅ Success feedback
- ✅ Error handling
- ✅ API integration
- ✅ LocalStorage persistence
- ✅ Responsive design
- ✅ Close button

### Admin Dashboard
- ✅ Statistics overview
- ✅ Search functionality
- ✅ Filter options
- ✅ Pagination
- ✅ Export to CSV
- ✅ View details
- ✅ Delete submissions
- ✅ Responsive design
- ✅ Loading states
- ✅ Empty states

## LocalStorage Keys

The implementation uses the following localStorage keys:
- `cookie_consent_accepted` - Stores cookie consent status ("true" or "false")
- `visitor_popup_submitted` - Stores popup submission status ("true")

## Customization

### Styling
Both components use Tailwind CSS and follow the existing design system:
- Primary color: `#FF6F00` (Orange)
- Consistent with admin dashboard styling
- Responsive breakpoints

### Content
You can customize the popup content in `visitor-popup.tsx`:
- Title: "Welcome to Our Store!"
- Description text
- Button text: "Get Exclusive Deals"
- Success message

### Cookie Consent Text
Customize the cookie consent message in `cookie-consent.tsx`:
- Main message text
- Privacy policy link
- Button labels

## Testing

### Test Cookie Consent
1. Visit the site
2. Cookie banner should appear at the bottom
3. Click "Accept All" or "Decline"
4. Refresh the page - banner should not appear again
5. Clear localStorage to test again

### Test Visitor Popup
1. Visit the site
2. Wait 5 seconds (or configured delay)
3. Popup should appear
4. Fill in the form and submit
5. Success message should appear
6. Refresh the page - popup should not appear again
7. Clear localStorage to test again

### Test Admin Dashboard
1. Login as admin
2. Navigate to `/admin/visitor-popups`
3. View statistics
4. Search and filter submissions
5. View details of a submission
6. Export to CSV
7. Delete a submission

## Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Notes
- Both features use localStorage, so they work per browser/device
- Clearing browser data will reset the "shown once" behavior
- The popup delay starts when the page loads
- Admin features require authentication and admin role
- CSV export includes all submission data
