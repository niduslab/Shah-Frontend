# Notification System - Quick Setup Guide

## 🚀 What's Been Implemented

A complete, professional notification system for both admin and user dashboards with:
- ✅ Real-time notifications via Pusher
- ✅ Toast notifications for instant alerts
- ✅ Notification bell with dropdown preview
- ✅ Full notification pages with filters
- ✅ Mark as read/unread, delete, clear all
- ✅ Professional UI matching your design system
- ✅ Mobile responsive

## 📍 Where to Find It

### Admin Dashboard
- **Notification Bell**: Top right corner of admin header (next to profile)
- **Full Page**: `/admin/notifications`
- **Features**: Orange gradient theme, real-time updates, filters

### User Dashboard
- **Notification Bell**: Top navigation bar (between cart and user menu)
- **Full Page**: `/dashboard/notifications` (already existed, now enhanced)
- **Features**: Blue theme, real-time updates, filters

## 🔧 Backend Setup Required

### 1. Environment Variables

Add to your Laravel `.env`:

```env
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=ap2

BROADCAST_DRIVER=pusher
```

Add to your Next.js `.env.local`:

```env
NEXT_PUBLIC_PUSHER_KEY=your_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 2. Required API Endpoints

Make sure these endpoints exist in your Laravel backend:

#### User Endpoints
```
GET    /api/notifications
GET    /api/notifications/unread-count
POST   /api/notifications/{id}/mark-as-read
POST   /api/notifications/mark-all-as-read
DELETE /api/notifications/{id}
POST   /api/notifications/clear
```

#### Admin Endpoints
```
GET    /api/admin/notifications
GET    /api/admin/notifications/unread-count
POST   /api/admin/notifications/{id}/mark-as-read
POST   /api/admin/notifications/mark-all-as-read
DELETE /api/admin/notifications/{id}
POST   /api/admin/notifications/clear
```

#### Broadcasting
```
POST /broadcasting/auth
```

### 3. Test Notifications

Send test notifications from Laravel:

```php
// For users
$user = User::find(1);
$user->notify(new OrderShippedNotification($order));

// For admins
$admin = User::where('user_type', 'admin')->first();
$admin->notify(new NewOrderNotification($order));
```

## 🎨 Notification Types

### Admin Notifications
- `order` - New orders (🛒)
- `payment` - Payment updates (💳)
- `review` - New reviews (⭐)
- `user` - User activities (👤)
- `product` - Product updates (🏷️)
- `report` - Report alerts (📊)
- `system` - System notifications (⚙️)

### User Notifications
- `order` - Order updates (📦)
- `payment` - Payment confirmations (💳)
- `review` - Review reminders (⭐)
- `promotion` - Special offers (🎁)
- `system` - System alerts (⚠️)

## 📱 How It Works

### 1. Notification Bell
- Shows unread count badge
- Click to see 5 most recent notifications
- Quick actions: mark as read, delete
- "View all" button to go to full page

### 2. Full Notifications Page
- Filter by: All, Unread, Read
- Pagination (20 per page)
- Bulk actions: Mark all read, Clear all
- Individual actions: Mark read, Delete
- Action buttons for notifications with links

### 3. Real-time Updates
- Instant toast notification when new notification arrives
- Bell count updates automatically
- Notification list refreshes
- Works via Pusher WebSocket connection

## 🧪 Testing

### 1. Check Notification Bell
```
1. Login as admin → Check bell in header
2. Login as user → Check bell in navbar
3. Click bell → See dropdown
4. Click "View all" → Go to full page
```

### 2. Test Functionality
```
1. Mark notification as read → Badge updates
2. Delete notification → Removed from list
3. Filter by unread → Shows only unread
4. Mark all as read → All marked
5. Clear all → All removed
```

### 3. Test Real-time (if Pusher configured)
```
1. Open app in browser
2. Send test notification from backend
3. See toast appear
4. See bell count update
5. Check notification in dropdown
```

## 🎯 Key Features

### Professional UI
- Smooth animations and transitions
- Color-coded notification types
- Visual unread indicators
- Hover effects and interactions
- Mobile responsive design

### Performance
- Pagination for large lists
- Query caching with React Query
- Optimistic UI updates
- Lazy loading in dropdown

### User Experience
- Keyboard navigation
- Click outside to close
- Loading states
- Error handling
- Empty states

## 📝 Customization

### Change Colors

**Admin (Orange):**
```tsx
// In app/admin/notifications/page.tsx
className="bg-gradient-to-r from-orange-400 to-orange-500"
```

**User (Blue):**
```tsx
// In app/(public)/dashboard/notifications/page.tsx
className="bg-[#00072D]"
```

### Add New Notification Type

1. Add icon to `notificationIcons` object
2. Add color to `notificationColors` object
3. Backend sends notification with new type

### Modify Dropdown Size

```tsx
// In lib/components/NotificationBell.tsx
const recentNotifications = notifications.slice(0, 5); // Change 5 to desired number
```

## 🐛 Troubleshooting

### Notifications not loading?
- Check API endpoints are accessible
- Verify authentication token
- Check browser console for errors

### Real-time not working?
- Verify Pusher credentials in .env
- Check Pusher dashboard for connections
- Ensure broadcasting/auth endpoint works

### Bell not showing?
- User must be logged in
- Check component is imported correctly
- Verify no CSS conflicts

## 📚 Files Modified/Created

### Created
- `lib/hooks/admin/useAdminNotifications.ts`
- `lib/components/NotificationBell.tsx`
- `lib/components/ToastProvider.tsx`
- `lib/context/NotificationContext.tsx`
- `app/admin/notifications/page.tsx`
- `app/(public)/_components/layout/UserNotificationBell.tsx`

### Modified
- `lib/hooks/admin/index.ts` - Added notification exports
- `app/admin/_components/admin-header.tsx` - Added notification bell
- `app/(public)/_components/layout/nav-bar.tsx` - Added notification bell
- `app/layout.tsx` - Added ToastProvider

## ✅ Next Steps

1. **Configure Pusher** (optional for real-time)
   - Get Pusher credentials
   - Add to .env files
   - Test real-time notifications

2. **Test Backend Endpoints**
   - Verify all API endpoints work
   - Test with Postman/curl
   - Check response formats

3. **Send Test Notifications**
   - Create test notifications
   - Verify they appear in UI
   - Test all actions work

4. **Customize (optional)**
   - Adjust colors to match brand
   - Modify notification types
   - Add custom icons

## 🎉 You're Done!

The notification system is fully implemented and ready to use. Just ensure your backend endpoints are working and optionally configure Pusher for real-time updates.

For detailed documentation, see `NOTIFICATION_SYSTEM_IMPLEMENTATION.md`.
