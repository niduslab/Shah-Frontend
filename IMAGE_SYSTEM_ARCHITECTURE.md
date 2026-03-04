# Product Image System Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │  Product List    │         │  Product Modal   │             │
│  │  - Display       │         │  - Create/Edit   │             │
│  │  - Primary Image │         │  - Image Manager │             │
│  │  - Count Badge   │         │  - Drag & Drop   │             │
│  └────────┬─────────┘         └────────┬─────────┘             │
│           │                            │                         │
│           └────────────┬───────────────┘                         │
│                        │                                         │
│           ┌────────────▼─────────────┐                          │
│           │   React Query Hooks      │                          │
│           │  - useAdminProducts      │                          │
│           │  - useAddProductImages   │                          │
│           │  - useUpdateProductImage │                          │
│           │  - useDeleteProductImage │                          │
│           │  - useSetPrimaryImage    │                          │
│           │  - useReorderImages      │                          │
│           └────────────┬─────────────┘                          │
│                        │                                         │
│           ┌────────────▼─────────────┐                          │
│           │   Utility Functions      │                          │
│           │  - getImageUrl()         │                          │
│           │  - getPrimaryImageUrl()  │                          │
│           │  - getAllImageUrls()     │                          │
│           │  - getPlaceholderImage() │                          │
│           └────────────┬─────────────┘                          │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                      BACKEND (Laravel)                            │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API Routes                             │   │
│  │  POST   /api/admin/products                              │   │
│  │  PUT    /api/admin/products/{id}                         │   │
│  │  POST   /api/admin/products/{id}/images                  │   │
│  │  PUT    /api/admin/products/{id}/images/{imageId}        │   │
│  │  DELETE /api/admin/products/{id}/images/{imageId}        │   │
│  │  POST   /api/admin/products/{id}/images/{imageId}/...    │   │
│  │  POST   /api/admin/products/{id}/images/reorder          │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                           │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │              ProductController                            │   │
│  │  - store()         - addImages()                         │   │
│  │  - update()        - updateImage()                       │   │
│  │  - destroy()       - deleteImage()                       │   │
│  │                    - setPrimaryImage()                   │   │
│  │                    - reorderImages()                     │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                           │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │              CatalogService                               │   │
│  │  - syncProductImages()                                   │   │
│  │    • Validates image data                                │   │
│  │    • Ensures one primary image                           │   │
│  │    • Manages sort order                                  │   │
│  │    • Handles database operations                         │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                           │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │                   Models                                  │   │
│  │  ┌──────────────┐         ┌──────────────┐              │   │
│  │  │   Product    │◄────────┤ProductImage  │              │   │
│  │  │              │ 1     * │              │              │   │
│  │  │ - id         │         │ - id         │              │   │
│  │  │ - name       │         │ - product_id │              │   │
│  │  │ - sku        │         │ - image_path │              │   │
│  │  │ - price      │         │ - alt_text   │              │   │
│  │  │ - ...        │         │ - is_primary │              │   │
│  │  │              │         │ - sort_order │              │   │
│  │  └──────────────┘         └──────────────┘              │   │
│  └───────────────────────────────────────────────────────────┘   │
│                       │                                           │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │                  Database                                 │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │ products                                          │    │   │
│  │  │ - id, name, sku, price, category_id, brand_id... │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │ product_images                                    │    │   │
│  │  │ - id, product_id, image_path, alt_text,          │    │   │
│  │  │   is_primary, sort_order, created_at, updated_at │    │   │
│  │  │                                                   │    │   │
│  │  │ Indexes:                                          │    │   │
│  │  │ - idx_product_primary (product_id, is_primary)   │    │   │
│  │  │ - idx_product_sort (product_id, sort_order)      │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  └───────────────────────────────────────────────────────────┘   │
│                       │                                           │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │              File Storage                                 │   │
│  │  storage/app/public/                                     │   │
│  │    └── products/                                         │   │
│  │        ├── laptop-front.jpg                              │   │
│  │        ├── laptop-side.jpg                               │   │
│  │        └── ...                                           │   │
│  │                                                           │   │
│  │  Accessible via: /storage/products/laptop-front.jpg      │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagrams

### 1. Create Product with Images

```
User Input
    │
    ▼
┌─────────────────┐
│ ProductModal    │
│ - Form Data     │
│ - Images Array  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useCreateProduct│
│ Hook            │
└────────┬────────┘
         │
         ▼ POST /api/admin/products
┌─────────────────┐
│ ProductController│
│ ::store()       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CatalogService  │
│ ::syncImages()  │
│ - Validate      │
│ - Set Primary   │
│ - Save to DB    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Database        │
│ - products      │
│ - product_images│
└────────┬────────┘
         │
         ▼
    Response
         │
         ▼
┌─────────────────┐
│ React Query     │
│ - Cache Update  │
│ - UI Refresh    │
└─────────────────┘
```

### 2. Display Product Images

```
Component Mount
    │
    ▼
┌─────────────────┐
│ useAdminProducts│
│ Hook            │
└────────┬────────┘
         │
         ▼ GET /api/admin/products
┌─────────────────┐
│ ProductController│
│ ::index()       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Product Model   │
│ with('images')  │
│ ->ordered()     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Database Query  │
│ JOIN images     │
│ ORDER BY sort   │
└────────┬────────┘
         │
         ▼
    JSON Response
    {
      data: [{
        id: 1,
        name: "Product",
        images: [
          {
            id: 1,
            image_path: "products/img.jpg",
            is_primary: true,
            sort_order: 0
          }
        ]
      }]
    }
         │
         ▼
┌─────────────────┐
│ getPrimaryImage │
│ Url()           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ <img> Element   │
│ src={imageUrl}  │
└─────────────────┘
```

### 3. Reorder Images (Drag & Drop)

```
User Drags Image
    │
    ▼
┌─────────────────┐
│ ImageManager    │
│ - onDragStart   │
│ - onDragOver    │
│ - onDragEnd     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Local State     │
│ Update          │
│ - Reorder array │
│ - Update sort   │
└────────┬────────┘
         │
         ▼
    User Saves
         │
         ▼
┌─────────────────┐
│ useReorderImages│
│ Hook            │
└────────┬────────┘
         │
         ▼ POST /api/admin/products/{id}/images/reorder
┌─────────────────┐
│ ProductController│
│ ::reorderImages()│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Database Update │
│ UPDATE images   │
│ SET sort_order  │
└────────┬────────┘
         │
         ▼
    Success Response
         │
         ▼
┌─────────────────┐
│ React Query     │
│ - Invalidate    │
│ - Refetch       │
└─────────────────┘
```

### 4. Set Primary Image

```
User Clicks Star
    │
    ▼
┌─────────────────┐
│ ImageManager    │
│ handleSetPrimary│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Local State     │
│ Update          │
│ - Unset all     │
│ - Set selected  │
└────────┬────────┘
         │
         ▼
    User Saves
         │
         ▼
┌─────────────────┐
│ useSetPrimary   │
│ Image Hook      │
└────────┬────────┘
         │
         ▼ POST /api/admin/products/{id}/images/{imageId}/set-primary
┌─────────────────┐
│ ProductController│
│ ::setPrimary()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Database Update │
│ UPDATE images   │
│ SET is_primary  │
│ WHERE product_id│
└────────┬────────┘
         │
         ▼
    Success Response
         │
         ▼
┌─────────────────┐
│ React Query     │
│ - Invalidate    │
│ - UI Update     │
└─────────────────┘
```

## 🗂️ File Structure

```
frontend/
├── app/
│   └── admin/
│       └── products/
│           ├── page.tsx                    # Product list
│           └── _components/
│               ├── ProductModal.tsx        # Create/Edit modal
│               ├── ImageManager.tsx        # Image management UI
│               └── DeleteConfirmModal.tsx  # Delete confirmation
├── lib/
│   ├── hooks/
│   │   └── admin/
│   │       └── useAdminProducts.ts         # API hooks
│   ├── utils/
│   │   └── image.ts                        # Image utilities
│   └── api/
│       └── axios.ts                        # API client
└── docs/
    ├── FRONTEND_IMAGE_MANAGEMENT.md        # Full documentation
    ├── FRONTEND_IMAGE_QUICK_REFERENCE.md   # Quick reference
    ├── FRONTEND_IMAGE_UPDATE_SUMMARY.md    # Update summary
    ├── INTEGRATION_CHECKLIST.md            # Integration guide
    └── IMAGE_SYSTEM_ARCHITECTURE.md        # This file

backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           └── Admin/
│   │               └── ProductController.php
│   ├── Models/
│   │   ├── Product.php
│   │   └── ProductImage.php
│   └── Services/
│       └── CatalogService.php
├── database/
│   └── migrations/
│       └── 2024_07_09_070935_create_product_images_table.php
├── routes/
│   └── api.php
└── storage/
    └── app/
        └── public/
            └── products/                   # Image storage
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Authentication                                           │
│     ├── JWT/Session tokens                                  │
│     ├── Admin middleware                                     │
│     └── Route protection                                     │
│                                                               │
│  2. Authorization                                            │
│     ├── Role-based access                                   │
│     ├── Permission checks                                    │
│     └── Resource ownership                                   │
│                                                               │
│  3. Input Validation                                         │
│     ├── Request validation rules                            │
│     ├── Max 10 images limit                                 │
│     ├── Path format validation                              │
│     ├── Alt text length limit                               │
│     └── File type restrictions                              │
│                                                               │
│  4. Path Security                                            │
│     ├── No directory traversal                              │
│     ├── Whitelist allowed paths                             │
│     ├── Sanitize file names                                 │
│     └── Validate extensions                                  │
│                                                               │
│  5. XSS Prevention                                           │
│     ├── Escape output                                       │
│     ├── Sanitize alt text                                   │
│     ├── Content Security Policy                             │
│     └── No inline scripts                                    │
│                                                               │
│  6. CSRF Protection                                          │
│     ├── CSRF tokens                                         │
│     ├── SameSite cookies                                    │
│     └── Origin validation                                    │
│                                                               │
│  7. Rate Limiting                                            │
│     ├── API rate limits                                     │
│     ├── Upload throttling                                   │
│     └── Request quotas                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

```sql
┌─────────────────────────────────────────────────────────────┐
│                         products                             │
├─────────────────────────────────────────────────────────────┤
│ id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT  │
│ name            VARCHAR(255) NOT NULL                       │
│ sku             VARCHAR(100) UNIQUE NOT NULL                │
│ category_id     BIGINT UNSIGNED FOREIGN KEY                 │
│ brand_id        BIGINT UNSIGNED FOREIGN KEY                 │
│ price           DECIMAL(10,2) NOT NULL                      │
│ quantity        INT NOT NULL DEFAULT 0                      │
│ status          ENUM('active','inactive','draft')           │
│ created_at      TIMESTAMP                                   │
│ updated_at      TIMESTAMP                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1:N
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      product_images                          │
├─────────────────────────────────────────────────────────────┤
│ id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT  │
│ product_id      BIGINT UNSIGNED FOREIGN KEY → products.id   │
│                 ON DELETE CASCADE                            │
│ image_path      VARCHAR(500) NOT NULL                       │
│ alt_text        VARCHAR(255) NULLABLE                       │
│ is_primary      BOOLEAN DEFAULT FALSE                       │
│ sort_order      INT DEFAULT 0                               │
│ created_at      TIMESTAMP                                   │
│ updated_at      TIMESTAMP                                   │
│                                                              │
│ INDEX idx_product_primary (product_id, is_primary)          │
│ INDEX idx_product_sort (product_id, sort_order)             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Component Hierarchy

```
ProductsPage
├── Header
├── Actions Bar
│   ├── Search Input
│   ├── Status Filter
│   └── Add Product Button
├── Products Table
│   └── Product Row (for each product)
│       ├── Image Cell
│       │   ├── Primary Image
│       │   └── Count Badge (+N)
│       ├── Product Info
│       ├── Price
│       ├── Stock
│       ├── Status Badge
│       └── Actions
│           ├── Edit Button → Opens ProductModal
│           └── Delete Button → Opens DeleteConfirmModal
├── Pagination
├── ProductModal
│   ├── Modal Header
│   ├── Form
│   │   ├── Basic Information
│   │   ├── Pricing
│   │   ├── Inventory
│   │   ├── Shipping
│   │   ├── Features
│   │   ├── SEO
│   │   └── ImageManager
│   │       ├── Add Image Button
│   │       └── Image Card (for each image)
│   │           ├── Drag Handle
│   │           ├── Image Preview
│   │           ├── Image Fields
│   │           │   ├── Path Input
│   │           │   └── Alt Text Input
│   │           └── Actions
│   │               ├── Set Primary Button
│   │               └── Delete Button
│   └── Modal Footer
│       ├── Cancel Button
│       └── Submit Button
└── DeleteConfirmModal
    ├── Warning Icon
    ├── Confirmation Message
    └── Actions
        ├── Cancel Button
        └── Delete Button
```

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    React Query Cache                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ['admin', 'products', filters]                             │
│  ├── data: { data: [...], pagination: {...} }              │
│  ├── isLoading: boolean                                     │
│  ├── error: Error | null                                    │
│  └── refetch: () => Promise                                 │
│                                                               │
│  ['admin', 'product', id]                                   │
│  ├── data: { id, name, images: [...], ... }                │
│  ├── isLoading: boolean                                     │
│  └── error: Error | null                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Component State                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ProductModal                                                │
│  ├── formData: { name, sku, price, ... }                   │
│  ├── images: ProductImage[]                                 │
│  └── isSubmitting: boolean                                  │
│                                                               │
│  ImageManager                                                │
│  ├── images: ProductImage[]                                 │
│  ├── draggedIndex: number | null                            │
│  └── onChange: (images) => void                             │
│                                                               │
│  ProductsPage                                                │
│  ├── searchQuery: string                                    │
│  ├── currentPage: number                                    │
│  ├── statusFilter: string                                   │
│  ├── isModalOpen: boolean                                   │
│  ├── isDeleteModalOpen: boolean                             │
│  └── selectedProduct: Product | null                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

This architecture provides a complete, scalable, and maintainable solution for managing product images in your e-commerce application.
