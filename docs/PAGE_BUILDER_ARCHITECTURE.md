# Page Builder System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN PAGE BUILDER SYSTEM                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Page Type  │  │    Page      │  │    Pages     │          │
│  │   Selection  │→ │   Builder    │→ │  Management  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         │                  │                  ↓                  │
│         │                  │          ┌──────────────┐          │
│         │                  │          │   Section    │          │
│         │                  │          │    Editor    │          │
│         │                  │          └──────────────┘          │
│         │                  │                                     │
└─────────┼──────────────────┼─────────────────────────────────────┘
          │                  │
          ↓                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PageTypeCard │  │ SectionGrid  │  │SectionEditor │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │TemplateCard  │  │DeleteConfirm │                             │
│  └──────────────┘  └──────────────┘                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                       STATE MANAGEMENT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              React Query (TanStack Query)             │       │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │       │
│  │  │   Cache    │  │  Mutations │  │  Queries   │     │       │
│  │  └────────────┘  └────────────┘  └────────────┘     │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              Local Component State                    │       │
│  │  • Page Title/Slug  • Selected Sections              │       │
│  │  • Editing Section  • Form Inputs                    │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │         useDynamicPages.ts (Custom Hooks)             │       │
│  │                                                        │       │
│  │  Pages:                    Sections:                  │       │
│  │  • useAdminPages          • usePageSections           │       │
│  │  • useAdminPage           • useSection                │       │
│  │  • useCreatePage          • useCreateSection          │       │
│  │  • useUpdatePage          • useUpdateSection          │       │
│  │  • useDeletePage          • useDeleteSection          │       │
│  │                           • useReorderSections        │       │
│  │                                                        │       │
│  │  Templates:                                           │       │
│  │  • usePageTemplates                                   │       │
│  │  • useTemplatesByPageType                             │       │
│  │  • useTemplateSchema                                  │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Pages Endpoints:                                                │
│  • POST   /api/admin/pages                                       │
│  • GET    /api/admin/pages                                       │
│  • GET    /api/admin/pages/{id}                                  │
│  • PUT    /api/admin/pages/{id}                                  │
│  • DELETE /api/admin/pages/{id}                                  │
│                                                                   │
│  Sections Endpoints:                                             │
│  • POST   /api/admin/pages/{pageId}/sections                     │
│  • GET    /api/admin/pages/{pageId}/sections                     │
│  • GET    /api/admin/pages/{pageId}/sections/{sectionId}         │
│  • PUT    /api/admin/pages/{pageId}/sections/{sectionId}         │
│  • DELETE /api/admin/pages/{pageId}/sections/{sectionId}         │
│  • POST   /api/admin/pages/{pageId}/sections/reorder             │
│                                                                   │
│  Templates Endpoints:                                            │
│  • GET    /api/admin/page-templates                              │
│  • GET    /api/admin/page-templates/page-type/{type}             │
│  • GET    /api/admin/page-templates/{type}/schema                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │    pages     │────────<│   sections   │                      │
│  ├──────────────┤         ├──────────────┤                      │
│  │ id           │         │ id           │                      │
│  │ title        │         │ page_id (FK) │                      │
│  │ slug         │         │ section_type │                      │
│  │ type         │         │ title        │                      │
│  │ meta_title   │         │ content      │                      │
│  │ meta_desc    │         │ settings     │                      │
│  │ is_active    │         │ sort_order   │                      │
│  │ sort_order   │         │ is_active    │                      │
│  │ created_at   │         │ created_at   │                      │
│  │ updated_at   │         │ updated_at   │                      │
│  └──────────────┘         └──────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Creating a New Page

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │ 1. Navigate to /admin/page-templates
     ↓
┌─────────────────┐
│ Page Type       │
│ Selection       │
│ (page.tsx)      │
└────┬────────────┘
     │ 2. Click "Landing Page" or "Brand Page"
     ↓
┌─────────────────┐
│ Page Builder    │
│ ([type]/page)   │
├─────────────────┤
│ • Fill title    │
│ • Fill slug     │
│ • Add sections  │
│ • Edit content  │
└────┬────────────┘
     │ 3. Click "Save Page"
     ↓
┌─────────────────┐
│ handleSavePage()│
├─────────────────┤
│ 1. Validate     │
│ 2. POST page    │
│ 3. Get page ID  │
│ 4. POST sections│
│ 5. Show toast   │
│ 6. Redirect     │
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Backend API     │
├─────────────────┤
│ • Create page   │
│ • Create sections│
│ • Return data   │
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Database        │
├─────────────────┤
│ • Insert page   │
│ • Insert sections│
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Success!        │
│ Redirect to     │
│ /admin/page-    │
│ templates       │
└─────────────────┘
```

### Editing Existing Page

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │ 1. Navigate to /admin/pages
     ↓
┌─────────────────┐
│ Pages List      │
│ (pages/page)    │
├─────────────────┤
│ • Search        │
│ • Filter        │
│ • View pages    │
└────┬────────────┘
     │ 2. Click "Edit" button
     ↓
┌─────────────────┐
│ Section Editor  │
│ ([id]/sections) │
├─────────────────┤
│ • Load page     │
│ • Load sections │
│ • Display list  │
└────┬────────────┘
     │ 3. Click section to edit
     ↓
┌─────────────────┐
│ SectionEditor   │
│ Component       │
├─────────────────┤
│ • Show form     │
│ • Edit content  │
│ • Update state  │
└────┬────────────┘
     │ 4. Auto-save or click "Save"
     ↓
┌─────────────────┐
│ handleUpdate()  │
├─────────────────┤
│ 1. Validate     │
│ 2. PUT section  │
│ 3. Show toast   │
│ 4. Refetch data │
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Backend API     │
├─────────────────┤
│ • Update section│
│ • Return data   │
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Database        │
├─────────────────┤
│ • Update record │
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ React Query     │
│ Cache Update    │
└─────────────────┘
```

## Component Hierarchy

```
App
└── Admin Layout
    └── Page Templates
        ├── Page Type Selection (/admin/page-templates)
        │   └── PageTypeCard (x2)
        │       • Landing Page
        │       • Brand Page
        │
        └── Page Builder (/admin/page-templates/[type])
            ├── Header
            │   ├── Back Button
            │   ├── Title
            │   └── Save Button
            │
            ├── Section Grid (Left 2/3)
            │   ├── Available Sections
            │   │   └── Section Cards (click to add)
            │   │
            │   └── Selected Sections
            │       └── Section Items (with drag handles)
            │           ├── Order Number
            │           ├── Section Name
            │           ├── Edit Button
            │           └── Delete Button
            │
            └── Section Editor (Right 1/3)
                ├── Tab Navigation
                │   ├── Page Tab
                │   ├── Content Tab
                │   └── Settings Tab
                │
                ├── Page Tab Content
                │   ├── Title Input
                │   └── Slug Input
                │
                ├── Content Tab Content
                │   └── Dynamic Form Fields
                │       ├── Text Inputs
                │       ├── Image Uploads
                │       └── Link Inputs
                │
                └── Settings Tab Content
                    ├── Checkboxes
                    └── Dropdowns

Pages Management (/admin/pages)
├── Header
│   ├── Title
│   └── Create Button
│
├── Actions Bar
│   ├── Search Input
│   ├── Type Filter
│   └── Create Button
│
├── Pages List
│   └── Page Items
│       ├── Title & Slug
│       ├── Type Badge
│       ├── Status Badge
│       ├── Section Count
│       ├── Toggle Button
│       ├── Edit Button
│       └── Delete Button
│
├── Pagination
│
└── Delete Confirm Modal
    ├── Warning Icon
    ├── Message
    ├── Cancel Button
    └── Delete Button

Section Editor (/admin/pages/[id]/sections)
├── Header
│   ├── Back Button
│   ├── Page Title
│   └── Save Button
│
├── Sections List (Left 2/3)
│   ├── Add Section Button
│   └── Section Items
│       ├── Drag Handle
│       ├── Order Number
│       ├── Section Name
│       ├── Status Badge
│       ├── Toggle Button
│       ├── Edit Button
│       └── Delete Button
│
└── Section Editor (Right 1/3)
    └── (Same as Page Builder)
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT STATE                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Local State (useState):                                     │
│  • pageTitle: string                                         │
│  • pageSlug: string                                          │
│  • selectedSections: Section[]                               │
│  • editingSection: Section | null                            │
│  • searchQuery: string                                       │
│  • currentPage: number                                       │
│  • typeFilter: string                                        │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                   REACT QUERY CACHE                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Query Keys:                                                 │
│  • ['admin', 'pages', params]                                │
│  • ['admin', 'page', id]                                     │
│  • ['admin', 'page', pageId, 'sections']                     │
│  • ['admin', 'page', pageId, 'section', sectionId]           │
│  • ['admin', 'page-templates', params]                       │
│                                                               │
│  Mutations:                                                  │
│  • createPage                                                │
│  • updatePage                                                │
│  • deletePage                                                │
│  • createSection                                             │
│  • updateSection                                             │
│  • deleteSection                                             │
│  • reorderSections                                           │
│                                                               │
│  Cache Invalidation:                                         │
│  • On mutation success → invalidate related queries          │
│  • Automatic refetch → UI updates                            │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                      API CALLS                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  axios instance → Backend API → Database                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Route Protection:                                           │
│  • /admin/* routes require authentication                    │
│  • Check user role (admin only)                              │
│  • Redirect to login if unauthorized                         │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  API Middleware:                                             │
│  • Verify JWT token                                          │
│  • Check admin permissions                                   │
│  • Validate request data                                     │
│  • Sanitize inputs                                           │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA VALIDATION                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend:                                                   │
│  • Required field validation                                 │
│  • Format validation (slug, etc.)                            │
│  • Type checking                                             │
│                                                               │
│  Backend:                                                    │
│  • Schema validation                                         │
│  • SQL injection prevention                                  │
│  • XSS protection                                            │
│  • CSRF protection                                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                    OPTIMIZATION STRATEGIES                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Code Splitting:                                          │
│     • Next.js automatic route-based splitting                │
│     • Dynamic imports for heavy components                   │
│                                                               │
│  2. Caching:                                                 │
│     • React Query cache (5 min stale time)                   │
│     • Browser cache for static assets                        │
│     • API response caching                                   │
│                                                               │
│  3. Lazy Loading:                                            │
│     • Images loaded on demand                                │
│     • Sections loaded as needed                              │
│     • Pagination for large lists                             │
│                                                               │
│  4. Optimistic Updates:                                      │
│     • UI updates before API response                         │
│     • Rollback on error                                      │
│                                                               │
│  5. Debouncing:                                              │
│     • Search input (300ms)                                   │
│     • Auto-save (1000ms)                                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  User Action                                                 │
│      ↓                                                        │
│  Component Handler                                           │
│      ↓                                                        │
│  Try/Catch Block                                             │
│      ↓                                                        │
│  API Call                                                    │
│      ↓                                                        │
│  ┌─────────┬─────────┐                                       │
│  │ Success │  Error  │                                       │
│  └────┬────┴────┬────┘                                       │
│       │         │                                            │
│       │         ↓                                            │
│       │    Log Error                                         │
│       │         ↓                                            │
│       │    Show Toast                                        │
│       │         ↓                                            │
│       │    Rollback State                                    │
│       │                                                       │
│       ↓                                                       │
│  Update UI                                                   │
│       ↓                                                       │
│  Show Success Toast                                          │
│       ↓                                                       │
│  Invalidate Cache                                            │
│       ↓                                                       │
│  Refetch Data                                                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (Next.js):                                         │
│  • Vercel / Netlify / Custom Server                          │
│  • Static pages cached at CDN                                │
│  • API routes proxied to backend                             │
│                                                               │
│  Backend API:                                                │
│  • Node.js / Laravel / Custom                                │
│  • Load balanced                                             │
│  • Rate limited                                              │
│                                                               │
│  Database:                                                   │
│  • PostgreSQL / MySQL                                        │
│  • Replicated for read scaling                               │
│  • Backed up regularly                                       │
│                                                               │
│  File Storage:                                               │
│  • S3 / CloudFlare R2 / Local                                │
│  • CDN for image delivery                                    │
│  • Image optimization                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

This architecture provides a scalable, maintainable, and performant page builder system with clear separation of concerns and robust error handling.
