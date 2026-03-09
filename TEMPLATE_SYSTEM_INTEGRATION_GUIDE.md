# Template System Integration Guide

## 🔗 Complete System Integration

This guide explains how all the pieces of the page builder system work together.

---

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN WORKFLOW                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Browse Templates (/admin/page-templates)                │
│     - View all available templates                          │
│     - Filter by page type & category                        │
│     - Search templates                                      │
│     - Preview template details                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Select Template                                         │
│     - Click "Use This Template"                             │
│     - Template stored in session storage                    │
│     - Redirect to page creation                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Create Page (/admin/dynamic-pages)                      │
│     - Fill page details (title, slug, type)                 │
│     - Template auto-applied                                 │
│     - Page created in database                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Add Sections (/admin/dynamic-pages/[id]/sections)       │
│     - Click "Add Section"                                   │
│     - Select section type from template                     │
│     - Use visual editor (if available)                      │
│     - Or use JSON editor                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Manage Sections                                         │
│     - Drag & drop to reorder                                │
│     - Edit content visually                                 │
│     - Toggle active/inactive                                │
│     - Delete sections                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Publish Page                                            │
│     - Set page to active                                    │
│     - Page available at /{slug}                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND RENDERING                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Integration

### 1. Template Browser → Page Creation

**Template Browser** (`/admin/page-templates/page.tsx`)
```typescript
// User clicks "Use Template"
const handleUseTemplate = () => {
  // Store template in session
  sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
  
  // Redirect to page creation
  router.push('/admin/dynamic-pages?action=create&template=' + template.id);
  
  toast.success('Template selected');
};
```

**Page Modal** (`/admin/dynamic-pages/_components/PageModal.tsx`)
```typescript
// Check for selected template
useEffect(() => {
  const templateData = sessionStorage.getItem('selectedTemplate');
  if (templateData) {
    const template = JSON.parse(templateData);
    
    // Pre-fill form with template data
    setFormData({
      ...formData,
      type: template.page_types[0], // Use first compatible type
    });
    
    // Clear session storage
    sessionStorage.removeItem('selectedTemplate');
  }
}, []);
```

---

### 2. Page Creation → Section Management

**Pages List** (`/admin/dynamic-pages/page.tsx`)
```typescript
// After page creation, navigate to sections
const handleManageSections = (page: Page) => {
  router.push(`/admin/dynamic-pages/${page.id}/sections`);
};
```

**Sections Page** (`/admin/dynamic-pages/[id]/sections/page.tsx`)
```typescript
// Load page and sections
const { data: pageData } = useAdminPage(pageId);
const { data: sectionsData } = usePageSections(pageId);

// Create section with template
const handleCreate = () => {
  setIsModalOpen(true);
};
```

---

### 3. Section Modal → Visual Editor

**Section Modal** (`/admin/dynamic-pages/[id]/sections/_components/SectionModal.tsx`)
```typescript
// Select section type
const [sectionType, setSectionType] = useState('');

// Load template schema
const { data: schema } = useTemplateSchema(sectionType);

// Show visual editor if available
{sectionType && (
  <VisualSectionEditor
    sectionType={sectionType}
    content={content}
    settings={settings}
    onChange={(newContent, newSettings) => {
      setContent(newContent);
      setSettings(newSettings);
    }}
  />
)}
```

**Visual Editor** (`/admin/dynamic-pages/[id]/sections/_components/VisualSectionEditor.tsx`)
```typescript
// Render appropriate editor based on section type
if (sectionType === 'hero_slider') {
  return <HeroSliderEditor />;
}

if (sectionType === 'product_grid') {
  return <ProductGridEditor />;
}

// Fallback to JSON editor
return <JSONEditorFallback />;
```

---

### 4. Section Management → Frontend

**API Endpoint** (`/api/pages/{slug}`)
```json
{
  "id": 1,
  "title": "Home",
  "slug": "home",
  "sections": [
    {
      "id": 1,
      "section_type": "landing_hero_grid",
      "content": { ... },
      "settings": { ... },
      "sort_order": 1,
      "is_active": true
    }
  ]
}
```

**Frontend Page** (`app/(public)/[slug]/page.tsx`)
```typescript
// Fetch page data
const page = await fetch(`/api/pages/${slug}`).then(r => r.json());

// Render sections
return (
  <div>
    {page.sections.map(section => (
      <SectionRenderer
        key={section.id}
        type={section.section_type}
        content={section.content}
        settings={section.settings}
      />
    ))}
  </div>
);
```

**Section Renderer** (`components/sections/SectionRenderer.tsx`)
```typescript
const COMPONENTS = {
  landing_hero_grid: LandingHeroGrid,
  category_cards_two_column: CategoryCardsTwoColumn,
  // ... other mappings
};

const Component = COMPONENTS[type];
return <Component content={content} settings={settings} />;
```

---

## Data Flow

### Template Data Flow

```
Backend API
    │
    ├─→ GET /api/admin/page-templates
    │       │
    │       └─→ Returns all templates
    │
    ├─→ GET /api/admin/page-templates/page-type/{type}
    │       │
    │       └─→ Returns filtered templates
    │
    └─→ GET /api/admin/page-templates/{type}/schema
            │
            └─→ Returns template schema
```

### Page Data Flow

```
Admin Creates Page
    │
    ├─→ POST /api/admin/pages
    │       │
    │       └─→ Page created in database
    │
    ├─→ POST /api/admin/pages/{id}/sections
    │       │
    │       └─→ Sections created
    │
    └─→ GET /api/pages/{slug}
            │
            └─→ Public page data
```

---

## Hook Integration

### Template Hooks

```typescript
// Get all templates
const { data: templates } = usePageTemplates();

// Get templates by page type
const { data: landingTemplates } = useTemplatesByPageType('landing');

// Get templates by category
const { data: heroTemplates } = useTemplatesByCategory('hero');

// Get template schema
const { data: schema } = useTemplateSchema('landing_hero_grid');
```

### Page Hooks

```typescript
// Get all pages
const { data: pages } = useAdminPages({ page: 1, per_page: 15 });

// Get single page
const { data: page } = useAdminPage(pageId);

// Create page
const createMutation = useCreatePage();
await createMutation.mutateAsync(pageData);

// Update page
const updateMutation = useUpdatePage();
await updateMutation.mutateAsync({ id, data });
```

### Section Hooks

```typescript
// Get page sections
const { data: sections } = usePageSections(pageId);

// Create section
const createMutation = useCreateSection();
await createMutation.mutateAsync({ pageId, data });

// Update section
const updateMutation = useUpdateSection();
await updateMutation.mutateAsync({ pageId, sectionId, data });

// Reorder sections
const reorderMutation = useReorderSections();
await reorderMutation.mutateAsync({ pageId, sections });
```

---

## State Management

### Session Storage

```typescript
// Store template selection
sessionStorage.setItem('selectedTemplate', JSON.stringify(template));

// Retrieve template selection
const template = JSON.parse(sessionStorage.getItem('selectedTemplate') || '{}');

// Clear after use
sessionStorage.removeItem('selectedTemplate');
```

### React Query Cache

```typescript
// Automatic cache invalidation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'page', pageId] });
}
```

---

## Error Handling

### Template Loading Errors

```typescript
const { data, isLoading, error } = usePageTemplates();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
```

### Page Creation Errors

```typescript
try {
  await createMutation.mutateAsync(data);
  toast.success('Page created successfully');
} catch (error) {
  toast.error('Failed to create page', {
    description: error.message
  });
}
```

### Section Validation Errors

```typescript
// Validate against template schema
const validateSection = (content, schema) => {
  const errors = [];
  
  Object.keys(schema.content).forEach(key => {
    if (schema.content[key].required && !content[key]) {
      errors.push(`${key} is required`);
    }
  });
  
  return errors;
};
```

---

## Performance Optimization

### Template Caching

```typescript
// Cache templates for 5 minutes
const { data: templates } = usePageTemplates({}, {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});
```

### Lazy Loading

```typescript
// Lazy load section components
const LandingHeroGrid = dynamic(() => import('./LandingHeroGrid'), {
  loading: () => <SectionSkeleton />,
});
```

### Pagination

```typescript
// Paginate templates
const [page, setPage] = useState(1);
const { data } = usePageTemplates({ page, per_page: 12 });
```

---

## Security Considerations

### Authentication

```typescript
// Protect admin routes
middleware.ts:
if (pathname.startsWith('/admin')) {
  if (!session) {
    return NextResponse.redirect('/login');
  }
}
```

### Authorization

```typescript
// Check user permissions
if (!user.hasPermission('manage_pages')) {
  return <Unauthorized />;
}
```

### Input Validation

```typescript
// Validate template data
const validateTemplate = (template) => {
  if (!template.name || !template.description) {
    throw new Error('Invalid template data');
  }
  
  if (!['hero', 'content', 'product', 'cta'].includes(template.category)) {
    throw new Error('Invalid category');
  }
};
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('TemplateCard', () => {
  it('renders template information', () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.getByText('Landing Hero Grid')).toBeInTheDocument();
  });
  
  it('calls onPreview when preview button clicked', () => {
    const onPreview = jest.fn();
    render(<TemplateCard template={mockTemplate} onPreview={onPreview} />);
    fireEvent.click(screen.getByText('Preview'));
    expect(onPreview).toHaveBeenCalledWith(mockTemplate);
  });
});
```

### Integration Tests

```typescript
describe('Template to Page Flow', () => {
  it('creates page from template', async () => {
    // Browse templates
    render(<PageTemplatesPage />);
    
    // Select template
    fireEvent.click(screen.getByText('Use'));
    
    // Verify redirect
    expect(router.push).toHaveBeenCalledWith(
      '/admin/dynamic-pages?action=create&template=landing_hero_grid'
    );
  });
});
```

### E2E Tests

```typescript
test('complete page creation workflow', async ({ page }) => {
  // Login
  await page.goto('/admin/login');
  await page.fill('[name="email"]', 'admin@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Browse templates
  await page.goto('/admin/page-templates');
  await page.click('text=Landing Hero Grid');
  await page.click('text=Use This Template');
  
  // Create page
  await page.fill('[name="title"]', 'Test Page');
  await page.fill('[name="slug"]', 'test-page');
  await page.click('text=Create');
  
  // Verify page created
  await expect(page).toHaveURL('/admin/dynamic-pages');
  await expect(page.locator('text=Test Page')).toBeVisible();
});
```

---

## Troubleshooting

### Template Not Loading

**Problem:** Templates not appearing in browser

**Solution:**
1. Check API endpoint: `/api/admin/page-templates`
2. Verify backend service is running
3. Check browser console for errors
4. Clear React Query cache

### Session Storage Issues

**Problem:** Template not pre-filling in page creation

**Solution:**
1. Check session storage in browser DevTools
2. Verify template is stored correctly
3. Check for session storage quota exceeded
4. Clear session storage and try again

### Visual Editor Not Showing

**Problem:** JSON editor showing instead of visual editor

**Solution:**
1. Check section type is supported
2. Verify VisualSectionEditor component
3. Add new editor for unsupported type
4. Check console for errors

---

## Summary

### Integration Points

1. **Template Browser** ↔ **Page Creation**
   - Session storage for template selection
   - URL parameters for template ID

2. **Page Creation** ↔ **Section Management**
   - Page ID in URL
   - React Query for data fetching

3. **Section Management** ↔ **Visual Editor**
   - Section type determines editor
   - Template schema for validation

4. **Admin** ↔ **Frontend**
   - Public API endpoints
   - Section renderer for display

### Key Technologies

- **React Query** - Data fetching and caching
- **Session Storage** - Template selection
- **React Hook Form** - Form management
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
- **Sonner** - Toast notifications

### Success Metrics

✅ Template browsing works
✅ Template preview works
✅ Template selection works
✅ Page creation works
✅ Section management works
✅ Visual editor works (2 types)
✅ Frontend rendering works

**The system is fully integrated and ready to use!** 🚀

