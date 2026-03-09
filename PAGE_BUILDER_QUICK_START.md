# Page Builder Quick Start Guide

## 🚀 Quick Navigation

### Admin Routes
- **Page Templates Home**: `/admin/page-templates` - Choose page type
- **Page Builder**: `/admin/page-templates/[type]` - Build new pages
- **Pages Management**: `/admin/pages` - View all pages
- **Section Editor**: `/admin/pages/[id]/sections` - Edit page sections

## 📁 Key Files

### Pages
```
app/admin/page-templates/
├── page.tsx                          # Page type selection
├── [type]/page.tsx                   # Visual page builder
└── _components/
    ├── SectionGrid.tsx               # Available & selected sections
    ├── SectionEditor.tsx             # Content editor (3 tabs)
    └── PageTypeCard.tsx              # Page type cards

app/admin/pages/
├── page.tsx                          # Pages list & management
├── [id]/sections/page.tsx            # Edit existing page sections
└── _components/
    └── DeleteConfirmModal.tsx        # Delete confirmation
```

### API Hooks
```
lib/hooks/admin/useDynamicPages.ts    # All API calls
```

## 🎯 Common Tasks

### Add a New Section Type Editor

1. Open `app/admin/page-templates/_components/SectionEditor.tsx`
2. Find the content tab section
3. Add a new condition after `landing_hero_grid`:

```tsx
{section.id === 'your_section_type' && (
  <div className="space-y-4">
    {/* Your form fields here */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Field Name
      </label>
      <input
        type="text"
        value={content.field_name || ''}
        onChange={(e) => handleContentChange('field_name', e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
      />
    </div>
  </div>
)}
```

### Add Image Upload Field

```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    <ImageIcon className="inline h-4 w-4 mr-1" />
    Image
  </label>
  <div className="flex gap-2">
    <input
      type="text"
      value={content.image_url || ''}
      onChange={(e) => handleContentChange('image_url', e.target.value)}
      placeholder="/images/photo.jpg"
      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
    />
    <button
      onClick={() => handleImageUpload('image_url')}
      className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
    >
      <Upload className="h-4 w-4" />
    </button>
  </div>
  {content.image_url && (
    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
      <img src={content.image_url} alt="Preview" className="w-full h-32 object-cover" />
    </div>
  )}
</div>
```

### Add a New Section Template

1. Open `app/admin/page-templates/[type]/page.tsx`
2. Add to `LANDING_SECTIONS` or `BRAND_SECTIONS`:

```tsx
{
  id: 'your_section_id',
  name: 'Section Name',
  description: 'Brief description',
  category: 'hero', // or 'content', 'product', 'cta'
  preview: '/images/sections/preview.png'
}
```

## 🔧 API Integration

### Expected Request Format

**Create Page**:
```json
POST /api/admin/pages
{
  "title": "Home",
  "slug": "home",
  "type": "landing",
  "is_active": true,
  "sort_order": 0
}
```

**Create Section**:
```json
POST /api/admin/pages/{pageId}/sections
{
  "section_type": "landing_hero_grid",
  "title": "Hero Section",
  "content": {
    "main_card_image": "/images/hero.jpg",
    "main_card_heading": "Welcome"
  },
  "settings": {
    "text_color": "#ffffff"
  },
  "sort_order": 1,
  "is_active": true
}
```

### Expected Response Format

The system handles both formats:

**Format 1** (Direct):
```json
{
  "id": 1,
  "title": "Home",
  "slug": "home"
}
```

**Format 2** (Nested):
```json
{
  "data": {
    "id": 1,
    "title": "Home",
    "slug": "home"
  }
}
```

## 🎨 Styling Guide

### Colors
- Primary: `#FF6F00` (Orange)
- Primary Dark: `#E65100`
- Success: `emerald-600`
- Danger: `red-600`
- Gray: `gray-600`

### Common Classes
```tsx
// Primary Button
className="rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30"

// Secondary Button
className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"

// Input Field
className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"

// Card
className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200"
```

## 🐛 Troubleshooting

### Save Button Not Working
1. Check browser console for errors
2. Verify API endpoints exist
3. Check network tab for failed requests
4. Ensure page title and slug are filled
5. Ensure at least one section is added

### Sections Not Displaying
1. Check API response format
2. Verify `sectionsData` is being parsed correctly
3. Check if sections have `is_active: true`
4. Look for console errors

### Images Not Uploading
- Currently simulated - implement real upload endpoint
- Check `handleImageUpload` function in SectionEditor.tsx
- Add backend storage (S3, local storage, etc.)

### TypeScript Errors
1. Run diagnostics: Check for type issues
2. Add type assertions: `(data as any).field`
3. Check import paths are correct

## 📊 Data Flow

```
User Action → Component State → API Hook → Backend API
                                    ↓
                              React Query Cache
                                    ↓
                              UI Update
```

### Example: Creating a Page
1. User fills form in `[type]/page.tsx`
2. Clicks "Save Page"
3. `handleSavePage` function runs
4. Calls `POST /api/admin/pages`
5. Gets page ID from response
6. Loops through sections
7. Calls `POST /api/admin/pages/{id}/sections` for each
8. Shows success toast
9. Redirects to `/admin/page-templates`

## 🔐 Permissions

Ensure these routes are protected:
- `/admin/page-templates/*`
- `/admin/pages/*`

Add authentication middleware to check admin role.

## 📱 Responsive Design

All components are responsive:
- Mobile: Single column layout
- Tablet: 2-column grid for sections
- Desktop: 3-column layout (2 for grid, 1 for editor)

## ⚡ Performance Tips

1. **Lazy Load Images**: Use Next.js Image component
2. **Debounce Inputs**: Add debounce to content changes
3. **Optimize Queries**: Use React Query's staleTime
4. **Pagination**: Already implemented for pages list
5. **Code Splitting**: Routes are automatically split

## 🚦 Status Indicators

### Page Status
- **Active** (Green): Page is live
- **Inactive** (Gray): Page is hidden

### Section Status
- **Active** (Green): Section displays on page
- **Inactive** (Gray): Section is hidden

## 📝 Content Guidelines

### Page Titles
- Keep under 60 characters
- Use title case
- Be descriptive

### Page Slugs
- Use lowercase
- Use hyphens for spaces
- No special characters
- Example: `summer-sale-2024`

### Section Content
- Fill all required fields
- Use high-quality images
- Keep text concise
- Test on mobile devices

## 🎓 Learning Resources

### Related Documentation
- `PAGE_BUILDER_SYSTEM_COMPLETE.md` - Full system docs
- `SESSION_COMPLETION_SUMMARY.md` - Recent changes
- `VISUAL_PAGE_BUILDER_COMPLETE.md` - Visual builder guide
- `TEMPLATE_SYSTEM_INTEGRATION_GUIDE.md` - Template system

### Code Examples
- Check `landing_hero_grid` in SectionEditor.tsx
- See save flow in `[type]/page.tsx`
- Review API hooks in `useDynamicPages.ts`

## 🎉 Quick Wins

Want to make quick improvements?

1. **Add More Section Types**: Copy `landing_hero_grid` pattern
2. **Improve Validation**: Add field validation
3. **Add Tooltips**: Help users understand fields
4. **Add Keyboard Shortcuts**: Ctrl+S to save
5. **Add Auto-Save**: Save draft every 30 seconds

---

**Need Help?** Check the full documentation in `PAGE_BUILDER_SYSTEM_COMPLETE.md`
