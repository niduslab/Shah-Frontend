# Architecture Diagram - Cookie Consent & Visitor Popup

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER VISITS SITE                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    app/(public)/layout.tsx                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Renders on every page:                                 │    │
│  │  • TopBar                                               │    │
│  │  • NavBar                                               │    │
│  │  • {children} (page content)                            │    │
│  │  • SubscribeSection                                     │    │
│  │  • Footer                                               │    │
│  │  • ScrollToTop                                          │    │
│  │  • CookieConsent ◄── NEW                               │    │
│  │  • VisitorPopup (delay: 5000ms) ◄── NEW               │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                    │                           │
                    │                           │
        ┌───────────┴──────────┐    ┌──────────┴──────────┐
        ▼                      ▼    ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│ Cookie Consent   │   │ Visitor Popup    │
│ Component        │   │ Component        │
└──────────────────┘   └──────────────────┘
        │                      │
        ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│ localStorage     │   │ localStorage     │
│ Key:             │   │ Key:             │
│ cookie_consent_  │   │ visitor_popup_   │
│ accepted         │   │ submitted        │
└──────────────────┘   └──────────────────┘
                               │
                               │ (on submit)
                               ▼
                    ┌──────────────────────┐
                    │ POST /api/visitor-   │
                    │ popup                │
                    │                      │
                    │ Body:                │
                    │ • name               │
                    │ • email              │
                    │ • phone              │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Backend API          │
                    │ (Laravel)            │
                    │                      │
                    │ Stores in:           │
                    │ visitor_popups table │
                    └──────────────────────┘
```

## Admin Dashboard Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN LOGS IN                                 │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Navigate to /admin/visitor-popups                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│           app/admin/visitor-popups/page.tsx                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Uses React Query Hooks:                               │    │
│  │  • useVisitorPopups(filters)                           │    │
│  │  • useDeleteVisitorPopup()                             │    │
│  │                                                         │    │
│  │  Displays:                                             │    │
│  │  • Statistics Cards                                    │    │
│  │  • Search & Filter Bar                                 │    │
│  │  • Submissions List                                    │    │
│  │  • Pagination                                          │    │
│  │  • Export CSV Button                                   │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                    │                           │
        ┌───────────┴──────────┐    ┌──────────┴──────────┐
        ▼                      ▼    ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│ View Details     │   │ Delete           │
│ (Eye Icon)       │   │ (Trash Icon)     │
└──────────────────┘   └──────────────────┘
        │                      │
        ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│ VisitorDetails   │   │ DeleteConfirm    │
│ Modal            │   │ Modal            │
│                  │   │                  │
│ Shows:           │   │ Confirms:        │
│ • Full name      │   │ • Deletion       │
│ • Email          │   │ • Warning        │
│ • Phone          │   │                  │
│ • IP address     │   │ On confirm:      │
│ • User agent     │   │ DELETE /api/     │
│ • Timestamp      │   │ admin/visitor-   │
│                  │   │ popups/{id}      │
└──────────────────┘   └──────────────────┘
```

## API Endpoints Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
└─────────────────────────────────────────────────────────────────┘

PUBLIC ENDPOINTS (No Auth)
┌──────────────────────────────────────────────────────────────┐
│ POST /api/visitor-popup                                       │
│ ├─ Body: { name, email?, phone? }                            │
│ ├─ Auto-captures: IP, User Agent, Timestamp                  │
│ └─ Returns: { success: true, data: {...} }                   │
└──────────────────────────────────────────────────────────────┘

ADMIN ENDPOINTS (Auth + Admin Role Required)
┌──────────────────────────────────────────────────────────────┐
│ GET /api/admin/visitor-popups                                 │
│ ├─ Query: page, per_page, search, has_email, has_phone      │
│ └─ Returns: Paginated list + statistics                      │
├──────────────────────────────────────────────────────────────┤
│ GET /api/admin/visitor-popups/statistics                      │
│ └─ Returns: { total, with_email, with_phone, today }        │
├──────────────────────────────────────────────────────────────┤
│ GET /api/admin/visitor-popups/export                          │
│ └─ Returns: CSV file download                                │
├──────────────────────────────────────────────────────────────┤
│ GET /api/admin/visitor-popups/{id}                            │
│ └─ Returns: Single submission details                        │
├──────────────────────────────────────────────────────────────┤
│ DELETE /api/admin/visitor-popups/{id}                         │
│ └─ Returns: { success: true }                                │
└──────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
app/(public)/layout.tsx
├── TopBar
├── NavBar
├── {children}
├── SubscribeSection
├── Footer
├── ScrollToTop
├── CookieConsent ◄── NEW
│   └── Uses localStorage: cookie_consent_accepted
└── VisitorPopup ◄── NEW
    ├── Props: delay (default: 5000ms)
    ├── Uses localStorage: visitor_popup_submitted
    └── API: POST /api/visitor-popup

app/admin/visitor-popups/page.tsx
├── Statistics Cards
│   ├── Total Submissions
│   ├── With Email
│   ├── With Phone
│   └── Today
├── Filters Bar
│   ├── Search Input
│   ├── Contact Filter (All/Email/Phone/Both)
│   └── Export CSV Button
├── Submissions List
│   └── For each submission:
│       ├── Name & Avatar
│       ├── Email & Phone
│       ├── IP Address
│       ├── Timestamp
│       └── Actions:
│           ├── View Details (Eye Icon)
│           └── Delete (Trash Icon)
├── Pagination
├── VisitorDetailsModal ◄── NEW
│   └── Shows full submission details
└── DeleteConfirmModal ◄── NEW
    └── Confirms deletion
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA FLOW DIAGRAM                             │
└─────────────────────────────────────────────────────────────────┘

1. USER INTERACTION
   User visits site
        │
        ▼
   Cookie Consent appears (bottom)
        │
        ├─ Accept → localStorage.setItem('cookie_consent_accepted', 'true')
        └─ Decline → localStorage.setItem('cookie_consent_accepted', 'false')
        
   After 5 seconds
        │
        ▼
   Visitor Popup appears (center)
        │
        ├─ Close → Popup closes (can show again on next visit)
        └─ Submit → 
             │
             ├─ Validate form
             ├─ POST to /api/visitor-popup
             ├─ Show success message
             ├─ localStorage.setItem('visitor_popup_submitted', 'true')
             └─ Auto-close after 2 seconds

2. BACKEND PROCESSING
   POST /api/visitor-popup
        │
        ├─ Validate: name (required)
        ├─ Capture: IP address, User Agent
        ├─ Store in: visitor_popups table
        └─ Return: success response

3. ADMIN VIEWING
   Admin visits /admin/visitor-popups
        │
        ├─ useVisitorPopups() hook
        │   └─ GET /api/admin/visitor-popups
        │       └─ Returns: paginated data + statistics
        │
        ├─ Search/Filter
        │   └─ Re-fetch with new params
        │
        ├─ View Details
        │   └─ Open VisitorDetailsModal
        │       └─ Display all submission data
        │
        ├─ Delete
        │   └─ Open DeleteConfirmModal
        │       └─ On confirm: DELETE /api/admin/visitor-popups/{id}
        │           └─ Invalidate queries → Refresh list
        │
        └─ Export CSV
            └─ GET /api/admin/visitor-popups/export
                └─ Download CSV file
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND STACK                              │
├─────────────────────────────────────────────────────────────────┤
│ • Next.js 14 (App Router)                                       │
│ • React 18                                                       │
│ • TypeScript                                                     │
│ • Tailwind CSS                                                   │
│ • React Query (TanStack Query)                                  │
│ • Axios                                                          │
│ • Lucide React (Icons)                                          │
│ • Sonner (Toast notifications)                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND STACK                               │
├─────────────────────────────────────────────────────────────────┤
│ • Laravel (PHP)                                                  │
│ • MySQL Database                                                 │
│ • RESTful API                                                    │
│ • JWT Authentication                                             │
│ • Middleware: Auth, Admin Role                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      STORAGE                                     │
├─────────────────────────────────────────────────────────────────┤
│ • localStorage (Browser)                                         │
│   ├─ cookie_consent_accepted                                    │
│   └─ visitor_popup_submitted                                    │
│                                                                  │
│ • Database (MySQL)                                               │
│   └─ visitor_popups table                                       │
│       ├─ id                                                      │
│       ├─ name                                                    │
│       ├─ email                                                   │
│       ├─ phone                                                   │
│       ├─ ip_address                                              │
│       ├─ user_agent                                              │
│       ├─ submitted_at                                            │
│       ├─ created_at                                              │
│       └─ updated_at                                              │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
shah_frontend/
│
├── app/
│   ├── (public)/
│   │   ├── layout.tsx ◄── MODIFIED (added CookieConsent & VisitorPopup)
│   │   └── _components/
│   │       └── shared/
│   │           ├── cookie-consent.tsx ◄── NEW
│   │           └── visitor-popup.tsx ◄── NEW
│   │
│   └── admin/
│       └── visitor-popups/ ◄── NEW
│           ├── page.tsx
│           └── _components/
│               ├── VisitorDetailsModal.tsx
│               └── DeleteConfirmModal.tsx
│
├── lib/
│   └── hooks/
│       └── admin/
│           ├── index.ts ◄── MODIFIED (added export)
│           └── useVisitorPopups.ts ◄── NEW
│
└── Documentation/
    ├── VISITOR_POPUP_COOKIE_CONSENT_IMPLEMENTATION.md ◄── NEW
    ├── IMPLEMENTATION_SUMMARY.md ◄── NEW
    ├── QUICK_START_GUIDE.md ◄── NEW
    └── ARCHITECTURE_DIAGRAM.md ◄── NEW (this file)
```

---

**This architecture provides a complete, scalable solution for cookie consent and visitor data collection with full admin management capabilities.**
