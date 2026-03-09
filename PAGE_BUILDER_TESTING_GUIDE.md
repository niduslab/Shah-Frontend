# Page Builder - Testing Guide

## ✅ Backend API is Ready!

The backend has implemented the required endpoints:
- `POST /api/admin/pages` - Create page
- `POST /api/admin/pages/{id}/sections` - Create sections

## Authentication

The backend uses **Bearer Token** authentication, but the frontend uses **Sanctum cookie-based** authentication.

### Current Setup
The axios instance (`lib/api/axios.ts`) is configured for:
- Cookie-based authentication (withCredentials: true)
- CSRF token handling
- Base URL: `http://localhost:8000`

### How It Works
1. User logs in via `/admin/login`
2. Sanctum creates session cookie
3. All API requests include cookie automatically
4. CSRF token sent in headers

## Testing the Page Builder

### 1. Login First
```
1. Go to http://localhost:3000/admin/login
2. Enter admin credentials
3. Login successful → redirects to admin dashboard
```

### 2. Create a Landing Page
```
1. Go to http://localhost:3000/admin/page-templates
2. Click "Landing Page" card
3. Fill in:
   - Page Title: "Home"
   - Page Slug: "home"
4. Add sections:
   - Click "Hero Grid (4 Sections)"
5. Edit section content:
   - Click on the added section
   - Fill in all fields
   - Upload images (or paste URLs)
6. Click "Save Page"
7. Should see: "Page saved successfully!"
8. Redirects to /admin/page-templates
```

### 3. Create a Brand Page
```
1. Go to http://localhost:3000/admin/page-templates
2. Click "Brand Page" card
3. Fill in:
   - Page Title: "NordicTrack"
   - Page Slug: "nordictrack"
4. Add sections:
   - Brand Full Width CTA Banner
   - Brand Category Grid
   - Brand Featured Products
5. Edit each section's content
6. Click "Save Page"
7. Should see success message
```

### 4. View Created Pages
```
1. Go to http://localhost:3000/admin/pages
2. Should see list of created pages
3. Each page shows:
   - Title and slug
   - Type badge (Landing/Brand)
   - Active status
   - Section count
   - Edit/Delete buttons
```

### 5. Edit Existing Page
```
1. Go to http://localhost:3000/admin/pages
2. Click "Edit" on any page
3. View all sections
4. Click section to edit content
5. Make changes
6. Click "Save Changes"
7. Changes should persist
```

## Expected API Calls

### When Saving a Page

**1. Create Page**:
```
POST http://localhost:8000/api/admin/pages
Headers:
  Content-Type: application/json
  X-XSRF-TOKEN: [csrf-token]
  Cookie: [session-cookie]
Body:
{
  "title": "Home",
  "slug": "home",
  "type": "landing",
  "is_active": true,
  "sort_order": 0
}
```

**2. Create Sections** (for each section):
```
POST http://localhost:8000/api/admin/pages/1/sections
Body:
{
  "section_type": "landing_hero_grid",
  "title": "Hero Grid (4 Sections)",
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

## Troubleshooting

### Issue: 401 Unauthorized
**Cause**: Not logged in or session expired
**Solution**: 
1. Go to /admin/login
2. Login again
3. Try saving page again

### Issue: 419 CSRF Token Mismatch
**Cause**: CSRF token expired
**Solution**: 
- Axios automatically handles this
- Refreshes token and retries
- If persists, refresh page

### Issue: 422 Validation Error
**Cause**: Missing required fields
**Solution**:
- Check page title is filled
- Check page slug is filled
- Check slug is unique
- Check at least one section added

### Issue: Network Error
**Cause**: Backend not running
**Solution**:
```bash
# Start Laravel backend
cd backend
php artisan serve
```

### Issue: CORS Error
**Cause**: CORS not configured
**Solution**: Check Laravel `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

## Checking Browser Console

### Success Flow
```
1. Click "Save Page"
2. Console shows:
   POST /api/admin/pages → 201 Created
   POST /api/admin/pages/1/sections → 201 Created
   POST /api/admin/pages/1/sections → 201 Created
3. Toast: "Page saved successfully!"
4. Redirects to /admin/page-templates
```

### Error Flow
```
1. Click "Save Page"
2. Console shows:
   POST /api/admin/pages → 422 Unprocessable Entity
   Response: { "errors": { "slug": ["The slug has already been taken."] } }
3. Toast: "Failed to save page"
4. Check error message
```

## Database Verification

After creating a page, check the database:

```sql
-- Check pages table
SELECT * FROM pages ORDER BY id DESC LIMIT 5;

-- Check sections table
SELECT * FROM page_sections ORDER BY id DESC LIMIT 10;

-- Check page with sections
SELECT 
  p.id,
  p.title,
  p.slug,
  COUNT(ps.id) as section_count
FROM pages p
LEFT JOIN page_sections ps ON p.id = ps.page_id
GROUP BY p.id
ORDER BY p.id DESC;
```

## Testing Checklist

### Landing Page
- [ ] Can create landing page
- [ ] Can add hero grid section
- [ ] Can edit section content
- [ ] Can upload images
- [ ] Can save page
- [ ] Page appears in pages list
- [ ] Can edit page sections
- [ ] Can toggle page active/inactive
- [ ] Can delete page

### Brand Page
- [ ] Can create brand page
- [ ] Can add brand CTA banner
- [ ] Can add category grid
- [ ] Can add featured products
- [ ] Can add content with images
- [ ] Can add product hero
- [ ] Can edit all sections
- [ ] Can save page
- [ ] All sections persist correctly

### Content Fields
- [ ] Text inputs work
- [ ] Textareas work
- [ ] Image upload triggers file picker
- [ ] Image preview displays
- [ ] Links save correctly
- [ ] Settings save correctly

### UI/UX
- [ ] Loading states show during save
- [ ] Success toast appears
- [ ] Error toast shows on failure
- [ ] Redirects after save
- [ ] Back button works
- [ ] Section reordering works (drag handles)

## Performance Testing

### Page Load Time
- Page templates: < 1s
- Page builder: < 1s
- Pages list: < 2s (with pagination)
- Section editor: < 500ms

### Save Time
- Create page: < 500ms
- Create sections: < 200ms per section
- Total save time: < 2s for 5 sections

## Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Form labels present

## Security Testing

- [ ] CSRF protection works
- [ ] Authentication required
- [ ] Admin role required
- [ ] XSS prevention in content
- [ ] SQL injection prevention

## Next Steps After Testing

### If Everything Works
1. ✅ Mark page builder as production-ready
2. 📝 Update documentation with any findings
3. 🎉 Deploy to staging environment
4. 👥 Train admin users

### If Issues Found
1. 🐛 Document the issue
2. 🔍 Check browser console
3. 🔍 Check network tab
4. 🔍 Check Laravel logs
5. 🛠️ Fix and retest

## Support

### Frontend Issues
- Check browser console
- Check React DevTools
- Check network requests
- Review `app/admin/page-templates/[type]/page.tsx`

### Backend Issues
- Check Laravel logs: `storage/logs/laravel.log`
- Check database queries
- Test endpoints with Postman
- Review controller code

### Authentication Issues
- Check Sanctum configuration
- Verify CORS settings
- Check session configuration
- Test login flow

## Success Criteria

The page builder is working correctly when:
1. ✅ Can create pages without errors
2. ✅ Sections save with correct content
3. ✅ Pages appear in management list
4. ✅ Can edit existing pages
5. ✅ All section types work
6. ✅ Images upload successfully
7. ✅ Settings persist correctly
8. ✅ No console errors
9. ✅ Performance is acceptable
10. ✅ Works across browsers

---

**Ready to test!** Follow the steps above and report any issues found.
