# Quick Start Guide - Cookie Consent & Visitor Popup

## 🚀 Instant Setup (Already Done!)

Everything is already integrated and ready to use. No additional setup required!

## 📍 Where to Find Everything

### For Users
- **Cookie Consent**: Appears at bottom of every page (first visit only)
- **Visitor Popup**: Appears 5 seconds after landing (first visit only)

### For Admins
- **Dashboard**: Navigate to `/admin/visitor-popups`
- **View submissions, statistics, export data, and manage entries**

## ⚡ Quick Actions

### Change Popup Delay
**File:** `app/(public)/layout.tsx` (Line 17)
```tsx
<VisitorPopup delay={5000} /> // Change to 3000 for 3 seconds, 10000 for 10 seconds, etc.
```

### Reset for Testing
**Browser DevTools > Application > Local Storage**
Delete these keys:
- `cookie_consent_accepted`
- `visitor_popup_submitted`

Then refresh the page.

### Access Admin Dashboard
1. Login as admin
2. Go to: `http://your-domain.com/admin/visitor-popups`

### Export Data
1. Go to admin dashboard
2. Click "Export CSV" button
3. File downloads automatically

## 🎯 Key Features at a Glance

| Feature | Location | Shows When |
|---------|----------|------------|
| Cookie Consent | Bottom of page | First visit only |
| Visitor Popup | Center modal | After 5 seconds, first visit only |
| Admin Dashboard | `/admin/visitor-popups` | Anytime (admin only) |

## 📊 What Data is Collected

### Cookie Consent
- User's choice (Accept/Decline)
- Stored in browser only (localStorage)

### Visitor Popup
- Name (required)
- Email (optional)
- Phone (optional)
- IP Address (automatic)
- User Agent (automatic)
- Submission timestamp (automatic)

## 🔒 Privacy & Storage

- **Cookie consent**: Stored locally in browser only
- **Visitor data**: Sent to backend database
- **Admin access**: Requires authentication + admin role
- **Data export**: CSV format for easy backup

## ✅ Testing Checklist

- [ ] Cookie banner appears on first visit
- [ ] Cookie banner doesn't appear after accepting/declining
- [ ] Visitor popup appears after 5 seconds
- [ ] Popup form validation works
- [ ] Popup submits data successfully
- [ ] Popup doesn't appear after submission
- [ ] Admin can view submissions
- [ ] Admin can search/filter
- [ ] Admin can export CSV
- [ ] Admin can delete submissions

## 🎨 Customization Points

### Popup Welcome Message
**File:** `app/(public)/_components/shared/visitor-popup.tsx`
**Line:** 95-98

### Cookie Consent Text
**File:** `app/(public)/_components/shared/cookie-consent.tsx`
**Line:** 32-36

### Popup Delay
**File:** `app/(public)/layout.tsx`
**Line:** 17

### Colors & Styling
Both components use Tailwind CSS classes. Search for:
- `bg-red-600` - Primary button color
- `from-[#FF6F00]` - Orange gradient start
- `to-[#E65100]` - Orange gradient end

## 🔧 Environment Variables

Make sure these are set in your `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📱 Mobile Responsive

Both components are fully responsive:
- Cookie banner: Stacks vertically on mobile
- Visitor popup: Adjusts width and padding
- Admin dashboard: Responsive grid and tables

## 🆘 Common Issues

### "Popup not showing"
→ Check localStorage, delete `visitor_popup_submitted` key

### "Cookie banner not showing"
→ Check localStorage, delete `cookie_consent_accepted` key

### "Admin page shows errors"
→ Verify you're logged in as admin and backend API is running

### "Form submission fails"
→ Check browser console, verify API_URL is correct

## 📞 Quick Commands

### Clear localStorage (Browser Console)
```javascript
localStorage.removeItem('cookie_consent_accepted');
localStorage.removeItem('visitor_popup_submitted');
location.reload();
```

### Check if popup was submitted (Browser Console)
```javascript
console.log(localStorage.getItem('visitor_popup_submitted'));
```

### Check cookie consent status (Browser Console)
```javascript
console.log(localStorage.getItem('cookie_consent_accepted'));
```

---

**That's it! Everything is ready to go. Visit your site to see it in action! 🎉**
