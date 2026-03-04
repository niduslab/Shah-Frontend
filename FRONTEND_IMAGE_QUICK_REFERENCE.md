# Frontend Image Management - Quick Reference

## 🎯 Quick Start

### 1. Display Primary Image
```typescript
import { getPrimaryImageUrl } from '@/lib/utils/image';

const imageUrl = getPrimaryImageUrl(product.images);
<img src={imageUrl} alt={product.name} />
```

### 2. Show All Images
```typescript
import { getAllImageUrls } from '@/lib/utils/image';

const imageUrls = getAllImageUrls(product.images);
imageUrls.map(url => <img key={url} src={url} />)
```

### 3. Add Images to Product
```typescript
import { useAddProductImages } from '@/lib/hooks/admin/useAdminProducts';

const addImages = useAddProductImages();

await addImages.mutateAsync({
  productId: 5,
  data: {
    images: [
      { path: "products/image.jpg", alt_text: "Description", is_primary: false }
    ]
  }
});
```

### 4. Set Primary Image
```typescript
import { useSetPrimaryProductImage } from '@/lib/hooks/admin/useAdminProducts';

const setPrimary = useSetPrimaryProductImage();

await setPrimary.mutateAsync({
  productId: 5,
  imageId: 12
});
```

### 5. Delete Image
```typescript
import { useDeleteProductImage } from '@/lib/hooks/admin/useAdminProducts';

const deleteImage = useDeleteProductImage();

await deleteImage.mutateAsync({
  productId: 5,
  imageId: 12
});
```

### 6. Reorder Images
```typescript
import { useReorderProductImages } from '@/lib/hooks/admin/useAdminProducts';

const reorder = useReorderProductImages();

await reorder.mutateAsync({
  productId: 5,
  data: { image_ids: [14, 12, 15, 13] }
});
```

## 📦 Component Usage

### ImageManager Component
```typescript
import ImageManager from '@/app/admin/products/_components/ImageManager';

const [images, setImages] = useState<ProductImage[]>([]);

<ImageManager 
  images={images} 
  onChange={setImages} 
  maxImages={10} 
/>
```

## 🔧 Utility Functions

```typescript
// Get full URL from path
getImageUrl("products/laptop.jpg")
// Returns: "http://localhost:8000/storage/products/laptop.jpg"

// Get placeholder
getPlaceholderImage("Product Name")
// Returns: SVG data URL with text

// Get primary image URL
getPrimaryImageUrl(product.images)
// Returns: URL of primary image or placeholder

// Get all image URLs
getAllImageUrls(product.images)
// Returns: Array of full URLs
```

## 📝 Data Structure

```typescript
interface ProductImage {
  id?: number;           // Present for existing images
  path: string;          // "products/image.jpg"
  alt_text?: string;     // "Product description"
  is_primary: boolean;   // true for main image
  sort_order: number;    // 0, 1, 2, etc.
}

interface Product {
  id: number;
  name: string;
  images?: ProductImage[];
  // ... other fields
}
```

## 🎨 UI Patterns

### Product Card with Image Count
```typescript
<div className="relative">
  <img src={getPrimaryImageUrl(product.images)} alt={product.name} />
  {product.images && product.images.length > 1 && (
    <div className="absolute bottom-0 right-0 bg-black/60 px-2 py-1 text-xs text-white">
      +{product.images.length - 1}
    </div>
  )}
</div>
```

### Image Gallery
```typescript
const imageUrls = getAllImageUrls(product.images);

<div className="grid grid-cols-4 gap-2">
  {imageUrls.map((url, index) => (
    <img key={index} src={url} className="rounded-lg" />
  ))}
</div>
```

### Primary Image Indicator
```typescript
{image.is_primary && (
  <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-1">
    <Star className="h-4 w-4 fill-white text-white" />
  </div>
)}
```

## ⚡ Common Operations

### Create Product with Images
```typescript
const createProduct = useCreateProduct();

await createProduct.mutateAsync({
  name: "Product Name",
  sku: "SKU-001",
  category_id: 1,
  brand_id: 1,
  price: 99.99,
  quantity: 100,
  status: "active",
  images: [
    {
      path: "products/main.jpg",
      alt_text: "Main view",
      is_primary: true,
      sort_order: 0
    },
    {
      path: "products/side.jpg",
      alt_text: "Side view",
      is_primary: false,
      sort_order: 1
    }
  ]
});
```

### Update Product with Images
```typescript
const updateProduct = useUpdateProduct();

await updateProduct.mutateAsync({
  id: 5,
  data: {
    name: "Updated Name",
    images: [
      // Replaces all existing images
      { path: "products/new.jpg", is_primary: true, sort_order: 0 }
    ]
  }
});
```

## 🚨 Important Notes

1. **Image Paths**: Always use relative paths without `/storage/` prefix
   - ✅ `products/laptop.jpg`
   - ❌ `/storage/products/laptop.jpg`

2. **Primary Image**: Exactly one image must be primary
   - First image is automatically primary if none specified
   - Setting new primary automatically unsets others

3. **Max Images**: Limited to 10 images per product
   - Enforced in UI and backend
   - Add button disabled at limit

4. **Sort Order**: Maintained automatically
   - Updated on add/remove/reorder
   - Zero-indexed (0, 1, 2, ...)

5. **Image Deletion**: Deleting primary promotes next image
   - Next image becomes primary automatically
   - No product can have zero primary images

## 🔗 API Endpoints

```
POST   /api/admin/products                                    - Create with images
PUT    /api/admin/products/{id}                               - Update (replace images)
POST   /api/admin/products/{id}/images                        - Add images
PUT    /api/admin/products/{productId}/images/{imageId}       - Update image
DELETE /api/admin/products/{productId}/images/{imageId}       - Delete image
POST   /api/admin/products/{productId}/images/{imageId}/set-primary - Set primary
POST   /api/admin/products/{productId}/images/reorder         - Reorder images
```

## 📚 Full Documentation

See `FRONTEND_IMAGE_MANAGEMENT.md` for complete documentation.
