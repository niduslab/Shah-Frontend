# Frontend-Backend Integration Checklist

## ✅ Pre-Integration Checklist

### Backend Requirements
- [ ] Database migration run: `php artisan migrate`
- [ ] Storage link created: `php artisan storage:link`
- [ ] Product images table exists with correct schema
- [ ] API endpoints are accessible
- [ ] CORS configured for frontend domain

### Frontend Requirements
- [ ] `.env.local` has `NEXT_PUBLIC_API_URL` set
- [ ] Dependencies installed: `npm install`
- [ ] No TypeScript errors: `npm run build`
- [ ] API client configured correctly

## 🔧 Configuration

### 1. Environment Variables

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend (`.env`):**
```env
APP_URL=http://localhost:8000
FILESYSTEM_DISK=public
```

### 2. API Client Setup

Verify `lib/api/axios.ts` has correct base URL:
```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
```

## 🧪 Testing Guide

### Test 1: Create Product with Images

1. Navigate to `/admin/products`
2. Click "Add Product"
3. Fill in required fields:
   - Name: "Test Product"
   - SKU: "TEST-001"
   - Category: Select any
   - Brand: Select any
   - Price: 99.99
   - Quantity: 100
4. Scroll to "Product Images" section
5. Click "Add Image"
6. Enter image path: `products/test.jpg`
7. Enter alt text: "Test product image"
8. Click "Create Product"

**Expected Result:**
- ✅ Product created successfully
- ✅ Toast notification appears
- ✅ Product appears in list with image
- ✅ Image is marked as primary

### Test 2: Add Multiple Images

1. Edit the product created in Test 1
2. Click "Add Image" multiple times
3. Add paths for different images:
   - `products/test-2.jpg`
   - `products/test-3.jpg`
4. Set different alt texts
5. Click star icon on second image to make it primary
6. Click "Update Product"

**Expected Result:**
- ✅ All images saved
- ✅ Second image is now primary
- ✅ Product list shows "+2" badge
- ✅ Primary image displays correctly

### Test 3: Reorder Images

1. Edit product with multiple images
2. Drag images to reorder them
3. Observe position numbers update
4. Click "Update Product"

**Expected Result:**
- ✅ Images reorder smoothly
- ✅ Sort order saved correctly
- ✅ Order persists after refresh

### Test 4: Delete Image

1. Edit product with multiple images
2. Click trash icon on non-primary image
3. Confirm image is removed
4. Click "Update Product"

**Expected Result:**
- ✅ Image removed from list
- ✅ Other images remain
- ✅ Sort order updates

### Test 5: Delete Primary Image

1. Edit product with multiple images
2. Click trash icon on primary image
3. Observe next image becomes primary
4. Click "Update Product"

**Expected Result:**
- ✅ Primary image removed
- ✅ Next image auto-promoted to primary
- ✅ Star icon moves to new primary

### Test 6: Image Display

1. Go to product list page
2. Verify primary images display
3. Check image count badges
4. Test image error handling (invalid path)

**Expected Result:**
- ✅ Primary images load correctly
- ✅ Badges show correct count
- ✅ Placeholder shows for missing images

## 🔍 Verification Steps

### Database Verification

```sql
-- Check product images
SELECT * FROM product_images WHERE product_id = 1;

-- Verify primary image
SELECT * FROM product_images WHERE product_id = 1 AND is_primary = 1;

-- Check sort order
SELECT id, product_id, image_path, is_primary, sort_order 
FROM product_images 
WHERE product_id = 1 
ORDER BY sort_order;
```

### API Verification

Test endpoints with curl or Postman:

```bash
# Get product with images
curl http://localhost:8000/api/admin/products/1

# Add images
curl -X POST http://localhost:8000/api/admin/products/1/images \
  -H "Content-Type: application/json" \
  -d '{"images":[{"path":"products/test.jpg","alt_text":"Test"}]}'

# Set primary
curl -X POST http://localhost:8000/api/admin/products/1/images/1/set-primary

# Reorder
curl -X POST http://localhost:8000/api/admin/products/1/images/reorder \
  -H "Content-Type: application/json" \
  -d '{"image_ids":[3,1,2]}'

# Delete image
curl -X DELETE http://localhost:8000/api/admin/products/1/images/1
```

### Frontend Verification

Check browser console for:
- ✅ No JavaScript errors
- ✅ API calls succeed (200 status)
- ✅ React Query cache updates
- ✅ Images load correctly

## 🐛 Common Issues & Solutions

### Issue 1: Images Not Displaying

**Symptoms:**
- Broken image icons
- 404 errors in console

**Solutions:**
1. Check storage link: `php artisan storage:link`
2. Verify image path format (no `/storage/` prefix)
3. Check file permissions on storage directory
4. Verify `NEXT_PUBLIC_API_URL` is correct

### Issue 2: CORS Errors

**Symptoms:**
- "Access-Control-Allow-Origin" errors
- API calls blocked

**Solutions:**
1. Update `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000'],
```
2. Clear config cache: `php artisan config:clear`

### Issue 3: Primary Image Not Set

**Symptoms:**
- No primary image in database
- Multiple primary images

**Solutions:**
1. Backend automatically sets first image as primary
2. Check `CatalogService::syncProductImages()` logic
3. Verify database constraint on `is_primary`

### Issue 4: Image Order Not Saving

**Symptoms:**
- Images reorder in UI but not persisted
- Sort order incorrect after refresh

**Solutions:**
1. Check `sort_order` field in database
2. Verify reorder API endpoint works
3. Check React Query cache invalidation

### Issue 5: Can't Add More Than 10 Images

**Symptoms:**
- Add button disabled
- Validation error

**Solutions:**
- This is expected behavior (max 10 images)
- Delete existing images to add new ones
- Adjust `maxImages` prop if needed

## 📊 Performance Checklist

- [ ] Images optimized (compressed, appropriate size)
- [ ] Lazy loading enabled for images
- [ ] React Query caching configured
- [ ] Database indexes on `product_id` and `is_primary`
- [ ] API responses paginated
- [ ] Image CDN configured (optional)

## 🔐 Security Checklist

- [ ] Image paths validated on backend
- [ ] File upload restrictions enforced
- [ ] MIME type validation
- [ ] Directory traversal prevention
- [ ] XSS prevention in alt text
- [ ] Authentication required for admin routes
- [ ] CSRF protection enabled

## 📱 Responsive Design Checklist

- [ ] Image manager works on mobile
- [ ] Drag-and-drop works on touch devices
- [ ] Product list responsive
- [ ] Image previews scale correctly
- [ ] Modal scrolls on small screens

## ♿ Accessibility Checklist

- [ ] Alt text required for images
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast sufficient

## 🚀 Production Checklist

### Before Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Storage configured correctly
- [ ] CORS configured for production domain
- [ ] SSL/HTTPS enabled
- [ ] Image optimization enabled
- [ ] CDN configured (if using)
- [ ] Monitoring setup

### After Deployment

- [ ] Test image upload
- [ ] Verify image display
- [ ] Check API endpoints
- [ ] Monitor error logs
- [ ] Test on multiple devices
- [ ] Verify performance
- [ ] Check security headers

## 📚 Documentation Review

- [ ] Read `FRONTEND_IMAGE_MANAGEMENT.md`
- [ ] Review `FRONTEND_IMAGE_QUICK_REFERENCE.md`
- [ ] Check `PRODUCT_IMAGE_MANAGEMENT.md` (backend)
- [ ] Review `API_PRODUCT_IMAGES_REFERENCE.md`

## 🎯 Success Criteria

Your integration is successful when:

1. ✅ Products can be created with multiple images
2. ✅ Images display correctly in product list
3. ✅ Primary image can be set and changed
4. ✅ Images can be reordered via drag-and-drop
5. ✅ Individual images can be added/updated/deleted
6. ✅ Image count badges display correctly
7. ✅ Alt text saves and displays
8. ✅ Error handling works (missing images, etc.)
9. ✅ No console errors or warnings
10. ✅ Performance is acceptable

## 🆘 Getting Help

If you encounter issues:

1. Check this checklist first
2. Review error messages in console
3. Check backend logs
4. Verify database state
5. Test API endpoints directly
6. Review documentation files
7. Check network tab in DevTools

## 📝 Notes

- Maximum 10 images per product (configurable)
- First image is automatically primary
- Deleting primary image promotes next image
- Image paths are relative to storage root
- Backend constructs full URLs
- React Query handles caching automatically
