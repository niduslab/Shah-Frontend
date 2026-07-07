# Frontend Product Image Management

Complete guide for the frontend implementation of the product image management system.

## 📋 Overview

The frontend now supports the backend's multi-image product system with:
- Multiple images per product (max 10)
- Primary image designation
- Drag-and-drop reordering
- Alt text for SEO
- Real-time preview
- Image count badges

## 🎯 Key Features

### 1. Image Manager Component
**Location:** `app/admin/products/_components/ImageManager.tsx`

Features:
- Add/remove images
- Drag-and-drop reordering
- Set primary image
- Edit alt text for SEO
- Visual primary indicator (star icon)
- Image count display
- Max 10 images limit

### 2. Updated Product Modal
**Location:** `app/admin/products/_components/ProductModal.tsx`

Changes:
- Integrated ImageManager component
- Handles image state management
- Sends images array with product data
- Loads existing images on edit

### 3. Enhanced Product List
**Location:** `app/admin/products/page.tsx`

Features:
- Displays primary image
- Shows image count badge (+N)
- Uses helper functions for image URLs

### 4. Image Utility Functions
**Location:** `lib/utils/image.ts`

New functions:
```typescript
// Get primary image URL from images array
getPrimaryImageUrl(images?: Array<{ image_path: string; is_primary: boolean }> | null): string

// Get all image URLs
getAllImageUrls(images?: Array<{ image_path: string }> | null): string[]

// Get placeholder with custom text
getPlaceholderImage(text?: string): string
```

### 5. API Hooks
**Location:** `lib/hooks/admin/useAdminProducts.ts`

New hooks:
```typescript
useAddProductImages()        // Add images to existing product
useUpdateProductImage()      // Update single image
useDeleteProductImage()      // Delete single image
useSetPrimaryProductImage()  // Set image as primary
useReorderProductImages()    // Reorder images
```

## 🔧 Usage Examples

### Creating a Product with Images

```typescript
const createMutation = useCreateProduct();

await createMutation.mutateAsync({
  name: "Premium Laptop",
  sku: "LAP-001",
  category_id: 5,
  brand_id: 3,
  price: 1299.99,
  quantity: 50,
  status: "active",
  images: [
    {
      path: "products/laptop-front.jpg",
      alt_text: "Laptop front view",
      is_primary: true,
      sort_order: 0
    },
    {
      path: "products/laptop-side.jpg",
      alt_text: "Laptop side view",
      is_primary: false,
      sort_order: 1
    }
  ]
});
```

### Adding Images to Existing Product

```typescript
const addImagesMutation = useAddProductImages();

await addImagesMutation.mutateAsync({
  productId: 5,
  data: {
    images: [
      {
        path: "products/laptop-keyboard.jpg",
        alt_text: "Keyboard closeup"
      }
    ]
  }
});
```

### Setting Primary Image

```typescript
const setPrimaryMutation = useSetPrimaryProductImage();

await setPrimaryMutation.mutateAsync({
  productId: 5,
  imageId: 12
});
```

### Deleting an Image

```typescript
const deleteImageMutation = useDeleteProductImage();

await deleteImageMutation.mutateAsync({
  productId: 5,
  imageId: 12
});
```

### Reordering Images

```typescript
const reorderMutation = useReorderProductImages();

await reorderMutation.mutateAsync({
  productId: 5,
  data: {
    image_ids: [14, 12, 15, 13] // New order
  }
});
```

## 🎨 UI Components

### ImageManager Component Props

```typescript
interface ImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number; // Default: 10
}

interface ProductImage {
  id?: number;           // Only present for existing images
  path: string;          // Required: relative path from storage
  alt_text?: string;     // Optional: for SEO
  is_primary: boolean;   // One must be true
  sort_order: number;    // Display order
}
```

### Visual Features

1. **Primary Image Indicator**
   - Orange star icon on primary image
   - Orange border around primary image card

2. **Drag Handle**
   - Grip icon for reordering
   - Shows position number (#1, #2, etc.)

3. **Image Preview**
   - 80x80px thumbnail
   - Fallback to placeholder on error

4. **Action Buttons**
   - Star button: Set as primary
   - Trash button: Remove image

5. **Image Count Badge**
   - Shows "+N" on product list
   - Indicates additional images

## 📝 Form Validation

### Image Path Requirements
- Required field
- Should be relative path from storage
- Example: `products/laptop.jpg`
- Backend constructs full URL: `{API_URL}/storage/products/laptop.jpg`

### Alt Text
- Optional but recommended for SEO
- Max 255 characters (backend validation)
- Descriptive text for accessibility

### Primary Image
- Exactly one image must be primary
- Automatically set for first image
- Can be changed by clicking star icon

### Image Limits
- Maximum 10 images per product
- Enforced in UI and backend
- Add button disabled at limit

## 🔄 State Management

### Image State Flow

1. **Load Product**
   ```typescript
   // ProductModal loads existing images
   if (product.images) {
     const sortedImages = [...product.images].sort((a, b) => 
       a.sort_order - b.sort_order
     );
     setImages(sortedImages);
   }
   ```

2. **Add Image**
   ```typescript
   const newImage = {
     path: '',
     alt_text: '',
     is_primary: images.length === 0, // First image is primary
     sort_order: images.length
   };
   setImages([...images, newImage]);
   ```

3. **Remove Image**
   ```typescript
   const newImages = images.filter((_, i) => i !== index);
   
   // Promote next image if primary was removed
   if (images[index].is_primary && newImages.length > 0) {
     newImages[0].is_primary = true;
   }
   
   // Update sort orders
   newImages.forEach((img, i) => {
     img.sort_order = i;
   });
   ```

4. **Reorder Images**
   ```typescript
   // Drag and drop updates sort_order
   const newImages = [...images];
   const draggedImage = newImages[draggedIndex];
   newImages.splice(draggedIndex, 1);
   newImages.splice(dropIndex, 0, draggedImage);
   
   newImages.forEach((img, i) => {
     img.sort_order = i;
   });
   ```

## 🎯 Best Practices

### 1. Image Paths
- Always use relative paths from storage root
- Don't include `/storage/` prefix
- Backend handles URL construction

### 2. Alt Text
- Write descriptive, keyword-rich text
- Helps with SEO and accessibility
- Keep under 255 characters

### 3. Primary Image
- Choose the best product view
- Usually front or main angle
- Used in product lists and cards

### 4. Image Order
- Most important images first
- Logical viewing sequence
- Use drag-and-drop for easy reordering

### 5. Error Handling
- Always provide fallback images
- Handle missing image paths gracefully
- Show user-friendly error messages

## 🐛 Troubleshooting

### Images Not Displaying

1. **Check Image Path**
   ```typescript
   // Correct
   path: "products/laptop.jpg"
   
   // Incorrect
   path: "/storage/products/laptop.jpg"
   path: "http://localhost:8000/storage/products/laptop.jpg"
   ```

2. **Verify API URL**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Check Backend Storage**
   - Ensure file exists in `storage/app/public/products/`
   - Verify symbolic link: `php artisan storage:link`

### Primary Image Not Set

```typescript
// Ensure at least one image is primary
if (images.length > 0 && !images.some(img => img.is_primary)) {
  images[0].is_primary = true;
}
```

### Drag-and-Drop Not Working

- Check `draggable` attribute is set
- Verify drag event handlers are attached
- Ensure state updates on drop

### Image Count Badge Not Showing

```typescript
// Check images array exists and has length
{product.images && product.images.length > 1 && (
  <div className="absolute bottom-0 right-0 bg-black/60 px-1.5 py-0.5 text-xs text-white">
    +{product.images.length - 1}
  </div>
)}
```

## 🔐 Security Considerations

1. **Path Validation**
   - Backend validates image paths
   - Prevents directory traversal
   - Restricts to allowed directories

2. **File Type Validation**
   - Backend checks MIME types
   - Only allows images
   - Max file size enforced

3. **XSS Prevention**
   - Alt text is sanitized
   - Image URLs are validated
   - No inline scripts allowed

## 📊 Performance Tips

1. **Lazy Loading**
   ```typescript
   <img loading="lazy" src={imageUrl} alt={altText} />
   ```

2. **Image Optimization**
   - Use appropriate image sizes
   - Compress before upload
   - Consider WebP format

3. **Caching**
   - React Query caches API responses
   - Browser caches images
   - Use cache headers

## 🚀 Future Enhancements

Potential improvements:
- [ ] Image upload directly from UI
- [ ] Image cropping/editing
- [ ] Bulk image operations
- [ ] Image gallery lightbox
- [ ] Image compression on upload
- [ ] CDN integration
- [ ] Image variants (thumbnails, etc.)

## 📚 Related Files

### Components
- `app/admin/products/_components/ImageManager.tsx`
- `app/admin/products/_components/ProductModal.tsx`
- `app/admin/products/_components/DeleteConfirmModal.tsx`
- `app/admin/products/page.tsx`

### Utilities
- `lib/utils/image.ts`

### Hooks
- `lib/hooks/admin/useAdminProducts.ts`

### Types
- Product interface with images array
- ProductImage interface

## 🎓 Learning Resources

- [React DnD](https://react-dnd.github.io/react-dnd/) - Drag and drop
- [React Query](https://tanstack.com/query/latest) - Data fetching
- [Image Optimization](https://web.dev/fast/#optimize-your-images) - Best practices
