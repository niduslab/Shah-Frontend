# Product Image Upload Guide

## 🎯 Overview

The system now supports **direct image uploads** from the frontend. Users can upload images directly through the UI instead of manually entering file paths.

## ✨ Features

### Upload Methods
1. **File Upload** - Upload images directly from your computer
2. **Path Entry** - Manually enter existing image paths (legacy support)
3. **Mixed Mode** - Combine uploaded files and existing paths

### Key Capabilities
- ✅ Multiple file selection (upload multiple images at once)
- ✅ Drag-and-drop reordering
- ✅ Real-time image preview
- ✅ File size display
- ✅ Primary image selection
- ✅ Alt text for SEO
- ✅ Max 10 images per product
- ✅ Automatic FormData handling

## 🚀 How to Use

### 1. Upload Images When Creating a Product

1. Click "Add Product" button
2. Fill in product details
3. Scroll to "Product Images" section
4. Click "Upload Images" button
5. Select one or multiple images from your computer
6. Images will appear with preview
7. Add alt text for each image
8. Click star icon to set primary image
9. Drag to reorder if needed
10. Click "Create Product"

### 2. Upload Images to Existing Product

1. Click edit icon on a product
2. Scroll to "Product Images" section
3. Click "Upload More Images" button
4. Select additional images
5. Update alt text and primary image as needed
6. Click "Update Product"

### 3. Mix Uploaded Files and Paths

You can have both:
- Images uploaded through the UI (shows filename and size)
- Images referenced by path (shows path input field)

## 📋 Technical Details

### Frontend Changes

#### ImageManager Component
```typescript
interface ProductImage {
  id?: number;           // Existing image ID
  path?: string;         // Path for existing images
  file?: File;           // File object for uploads
  preview?: string;      // Object URL for preview
  alt_text?: string;     // SEO alt text
  is_primary: boolean;   // Primary flag
  sort_order: number;    // Display order
}
```

#### File Handling
- Uses `<input type="file" accept="image/*" multiple>`
- Creates object URLs for preview: `URL.createObjectURL(file)`
- Cleans up object URLs on remove: `URL.revokeObjectURL(preview)`
- Displays file name and size

#### API Hooks Updated
- `useCreateProduct` - Handles FormData for file uploads
- `useUpdateProduct` - Handles FormData for file uploads
- `useAddProductImages` - Handles FormData for file uploads

### Backend Requirements

Your backend needs to handle `multipart/form-data` requests:

```php
// ProductController.php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        // ... other fields
        'images' => 'nullable|array|max:10',
        'images.*.file' => 'nullable|image|max:5120', // 5MB max
        'images.*.path' => 'nullable|string|max:500',
        'images.*.alt_text' => 'nullable|string|max:255',
        'images.*.is_primary' => 'boolean',
        'images.*.sort_order' => 'integer',
    ]);

    // Handle file uploads
    if ($request->has('images')) {
        foreach ($request->images as $index => $imageData) {
            if (isset($imageData['file'])) {
                // Store uploaded file
                $path = $imageData['file']->store('products', 'public');
                $validated['images'][$index]['path'] = $path;
                unset($validated['images'][$index]['file']);
            }
        }
    }

    // Create product with images
    $product = Product::create($validated);
    
    return response()->json($product->load('images'));
}
```

## 🎨 UI/UX Features

### Image Preview
- Shows thumbnail preview immediately after selection
- Displays filename and file size for uploads
- Shows path input for existing images
- Fallback to placeholder on error

### Visual Indicators
- **Uploaded File**: Shows filename + size (e.g., "laptop.jpg 245.3 KB")
- **Existing Path**: Shows editable path input field
- **Primary Image**: Orange star icon and border
- **Position**: Shows #1, #2, etc. for ordering

### User Feedback
- File input hidden, triggered by button click
- Multiple file selection supported
- Remaining slots shown (e.g., "Upload More Images (3/10)")
- Disabled state when limit reached

## 📝 Code Examples

### Creating Product with Uploaded Images

```typescript
import { useCreateProduct } from '@/lib/hooks/admin/useAdminProducts';

const createProduct = useCreateProduct();

// User selects files through UI
// ImageManager handles file selection and preview
// On submit:

await createProduct.mutateAsync({
  name: "Premium Laptop",
  sku: "LAP-001",
  category_id: 5,
  brand_id: 3,
  price: 1299.99,
  quantity: 50,
  status: "active",
  images: [
    {
      file: File, // Actual File object
      alt_text: "Laptop front view",
      is_primary: true,
      sort_order: 0
    },
    {
      file: File, // Another File object
      alt_text: "Laptop side view",
      is_primary: false,
      sort_order: 1
    }
  ]
});

// Hook automatically converts to FormData
// Backend receives multipart/form-data request
```

### Mixing Uploads and Paths

```typescript
await createProduct.mutateAsync({
  name: "Product Name",
  // ... other fields
  images: [
    {
      file: File, // New upload
      alt_text: "New image",
      is_primary: true,
      sort_order: 0
    },
    {
      path: "products/existing.jpg", // Existing image
      alt_text: "Existing image",
      is_primary: false,
      sort_order: 1
    }
  ]
});
```

## 🔧 FormData Structure

When files are present, the request is sent as `multipart/form-data`:

```
POST /api/admin/products
Content-Type: multipart/form-data

name: "Premium Laptop"
sku: "LAP-001"
category_id: 5
brand_id: 3
price: 1299.99
quantity: 50
status: "active"
images[0][file]: <File object>
images[0][alt_text]: "Laptop front view"
images[0][is_primary]: 1
images[0][sort_order]: 0
images[1][file]: <File object>
images[1][alt_text]: "Laptop side view"
images[1][is_primary]: 0
images[1][sort_order]: 1
```

For updates with PUT method:
```
POST /api/admin/products/5
Content-Type: multipart/form-data

_method: PUT
name: "Updated Name"
images[0][file]: <File object>
...
```

## 🎯 File Validation

### Frontend Validation
- File type: `accept="image/*"` (only images)
- Max images: 10 per product
- File size: Displayed to user

### Backend Validation (Recommended)
```php
'images.*.file' => [
    'nullable',
    'image',              // Must be image
    'mimes:jpeg,png,jpg,gif,webp', // Allowed types
    'max:5120',          // Max 5MB
],
```

## 🐛 Troubleshooting

### Issue: Images Not Uploading

**Check:**
1. Backend accepts `multipart/form-data`
2. File size within limits
3. Correct MIME types allowed
4. Storage directory writable
5. Network tab shows FormData request

### Issue: Preview Not Showing

**Check:**
1. Object URL created: `URL.createObjectURL(file)`
2. File is valid image type
3. Browser supports File API
4. No CORS issues

### Issue: FormData Not Sent

**Check:**
1. At least one image has `file` property
2. Hook detects files: `hasFiles` check
3. Content-Type header set correctly
4. File input not empty

### Issue: Memory Leaks

**Solution:**
- Object URLs are revoked on image remove
- Cleanup in `handleRemoveImage`:
```typescript
if (imageToRemove.preview) {
  URL.revokeObjectURL(imageToRemove.preview);
}
```

## 📊 Performance Considerations

### Client-Side
- Object URLs are lightweight (just pointers)
- Files not loaded into memory until upload
- Preview generation is instant
- Cleanup prevents memory leaks

### Server-Side
- Use chunked uploads for large files
- Implement progress tracking
- Compress images on server
- Generate thumbnails asynchronously

### Optimization Tips
1. **Compress before upload** (optional)
   ```typescript
   // Use library like browser-image-compression
   const compressed = await imageCompression(file, {
     maxSizeMB: 1,
     maxWidthOrHeight: 1920
   });
   ```

2. **Show upload progress**
   ```typescript
   await api.post('/api/admin/products', formData, {
     headers: { 'Content-Type': 'multipart/form-data' },
     onUploadProgress: (progressEvent) => {
       const percentCompleted = Math.round(
         (progressEvent.loaded * 100) / progressEvent.total
       );
       setUploadProgress(percentCompleted);
     }
   });
   ```

3. **Lazy load images**
   ```typescript
   <img loading="lazy" src={preview} alt={altText} />
   ```

## 🔐 Security Best Practices

### Frontend
1. Validate file types before upload
2. Check file size limits
3. Sanitize filenames
4. Don't trust MIME types alone

### Backend
1. Validate file types server-side
2. Check magic bytes (file signatures)
3. Scan for malware
4. Store outside web root
5. Generate unique filenames
6. Set proper permissions
7. Limit upload rate

## 🎓 Advanced Features

### Drag-and-Drop Upload (Future Enhancement)
```typescript
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  // Process files
};

<div
  onDrop={handleDrop}
  onDragOver={(e) => e.preventDefault()}
  className="border-dashed border-2"
>
  Drop images here
</div>
```

### Image Cropping (Future Enhancement)
```typescript
import Cropper from 'react-easy-crop';

// Allow users to crop before upload
<Cropper
  image={preview}
  crop={crop}
  zoom={zoom}
  aspect={4 / 3}
  onCropComplete={onCropComplete}
/>
```

### Bulk Upload (Future Enhancement)
```typescript
// Upload multiple products with images
const bulkUpload = async (productsWithImages) => {
  for (const product of productsWithImages) {
    await createProduct.mutateAsync(product);
  }
};
```

## 📚 Related Documentation

- `FRONTEND_IMAGE_MANAGEMENT.md` - Complete system documentation
- `FRONTEND_IMAGE_QUICK_REFERENCE.md` - Quick code reference
- `INTEGRATION_CHECKLIST.md` - Testing guide
- `IMAGE_SYSTEM_ARCHITECTURE.md` - System architecture

## ✅ Summary

Your system now supports:
- ✅ Direct file uploads from UI
- ✅ Multiple file selection
- ✅ Real-time preview
- ✅ File size display
- ✅ Automatic FormData handling
- ✅ Mixed upload/path mode
- ✅ Memory leak prevention
- ✅ Drag-and-drop reordering

Users can now upload images directly without manually managing file paths!
