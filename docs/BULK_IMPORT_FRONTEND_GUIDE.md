# Bulk Product Import - Frontend Implementation Guide

## Overview

The Bulk Product Import feature allows administrators to upload CSV files containing multiple products. The system processes imports in the background with real-time progress tracking, error reporting, and comprehensive import history.

---

## Features Implemented

### ✅ Core Features

1. **CSV Template Download**
   - Pre-formatted template with all supported columns
   - Sample data included for reference
   - One-click download functionality

2. **File Upload**
   - Drag & drop interface
   - File type validation (CSV only)
   - File size validation (10MB max)
   - Visual feedback for file selection

3. **Real-Time Progress Tracking**
   - Live progress bar with percentage
   - Row-by-row processing status
   - Success/failure counters
   - Auto-refresh every 3 seconds during processing

4. **Import History**
   - Paginated list of all imports
   - Status indicators (pending, processing, completed, failed, cancelled)
   - Quick actions (view, download errors, cancel, delete)
   - Sortable and filterable

5. **Error Handling**
   - Detailed error messages
   - Downloadable error reports (CSV)
   - Row-level error tracking
   - Validation feedback

6. **Import Management**
   - Cancel in-progress imports
   - Delete completed imports
   - View detailed import statistics
   - Refresh status manually

---

## File Structure

```
app/admin/products/
├── bulk-import/
│   └── page.tsx                          # Main bulk import page
├── _components/
│   ├── ImportProgressCard.tsx            # Real-time progress display
│   └── ImportHistoryTable.tsx            # Import history table

lib/hooks/admin/
└── useBulkImport.ts                      # API hooks for bulk import
```

---

## Pages & Routes

### Main Bulk Import Page
**Route:** `/admin/products/bulk-import`

**Features:**
- CSV template download
- File upload with drag & drop
- Active import progress tracking
- Import history table
- Instructions and best practices
- Requirements and tips

**Access:**
- Linked from Products page via "Bulk Import" button
- Direct navigation via sidebar (optional)

---

## Components

### 1. ImportProgressCard

**Purpose:** Display real-time progress of active import

**Props:**
```typescript
interface ImportProgressCardProps {
  import: any;              // Import data object
  onCancel: () => void;     // Cancel import callback
  onDownloadErrors: () => void; // Download errors callback
  onRefresh: () => void;    // Refresh status callback
}
```

**Features:**
- Auto-refresh every 3 seconds during processing
- Visual progress bar
- Statistics grid (total, processed, success, failed)
- Status indicators with icons
- Cancel button for pending/processing imports
- Download errors button for completed imports with errors
- Timestamps for start and completion

### 2. ImportHistoryTable

**Purpose:** Display list of all imports with actions

**Props:**
```typescript
interface ImportHistoryTableProps {
  imports: any[];                      // Array of import records
  isLoading: boolean;                  // Loading state
  onViewDetails: (importId: number) => void;    // View details callback
  onDownloadErrors: (importId: number) => void; // Download errors callback
  onCancel: (importId: number) => void;         // Cancel import callback
  onDelete: (importId: number) => void;         // Delete import callback
}
```

**Features:**
- Responsive table layout
- Status badges with colors
- Progress bars for each import
- Success/failure counters
- Action buttons (view, download, cancel, delete)
- Empty state handling
- Loading state

---

## API Hooks

### useBulkImports()
Fetch list of all imports with optional filters

```typescript
const { data, isLoading, refetch } = useBulkImports({
  status: 'completed',  // optional
  per_page: 15,         // optional
  page: 1               // optional
});
```

### useImportStatus(importId)
Get detailed status of a specific import with auto-refresh

```typescript
const { data, refetch } = useImportStatus(importId);
// Auto-refreshes every 3 seconds if status is 'processing' or 'pending'
```

### useUploadImport()
Upload CSV file to start import

```typescript
const uploadMutation = useUploadImport();

const handleUpload = async () => {
  const formData = new FormData();
  formData.append('file', file);
  await uploadMutation.mutateAsync(formData);
};
```

### useDownloadTemplate()
Download CSV template

```typescript
const downloadTemplate = useDownloadTemplate();
await downloadTemplate.mutateAsync();
```

### useDownloadErrors(importId)
Download error report for failed rows

```typescript
const downloadErrors = useDownloadErrors();
await downloadErrors.mutateAsync(importId);
```

### useCancelImport(importId)
Cancel pending or in-progress import

```typescript
const cancelMutation = useCancelImport();
await cancelMutation.mutateAsync(importId);
```

### useDeleteImport(importId)
Delete import record

```typescript
const deleteMutation = useDeleteImport();
await deleteMutation.mutateAsync(importId);
```

---

## User Flow

### 1. Access Bulk Import
```
Products Page → Click "Bulk Import" button → Bulk Import Page
```

### 2. Download Template
```
Click "Download Template" → CSV file downloads → Open in Excel/Sheets
```

### 3. Prepare CSV File
```
Fill in product data → Save as CSV → Ensure UTF-8 encoding
```

### 4. Upload File
```
Drag & drop CSV file OR Click to browse → Select file → Click "Start Import"
```

### 5. Monitor Progress
```
View real-time progress → See success/failure counts → Wait for completion
```

### 6. Handle Errors (if any)
```
Click "Download Error Report" → Review errors → Fix data → Re-upload
```

### 7. View History
```
Scroll to Import History → View all past imports → Manage old imports
```

---

## Status Indicators

### Status Types

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| `pending` | Yellow | Clock | Import queued, waiting to start |
| `processing` | Blue | Spinner | Currently processing rows |
| `completed` | Green | Check | Import finished successfully |
| `failed` | Red | X Circle | Import failed with critical error |
| `cancelled` | Gray | X | Import was cancelled by user |

### Visual Indicators

- **Progress Bar:** Shows percentage completion (0-100%)
- **Statistics Grid:** Total, Processed, Success, Failed counts
- **Status Badge:** Colored badge with icon and text
- **Action Buttons:** Context-aware actions based on status

---

## Error Handling

### Client-Side Validation

1. **File Type:** Only CSV files accepted
2. **File Size:** Maximum 10MB
3. **File Selection:** Must select a file before upload

### Server-Side Errors

1. **Upload Errors:** Display toast notification with error message
2. **Processing Errors:** Show in import progress card
3. **Row Errors:** Available in downloadable error report

### Error Report Format

CSV file with columns:
- Row Number
- Errors (comma-separated list)

Example:
```csv
Row Number,Errors
15,"Category ID is required; Price must be a positive number"
23,"Database error: Duplicate entry 'SKU-123' for key 'products.sku'"
```

---

## Best Practices

### For Users

1. **Start Small:** Test with 10-50 rows first
2. **Validate Data:** Check category IDs and brand IDs exist
3. **Unique SKUs:** Ensure all SKUs are unique
4. **Split Large Files:** Break into batches of 500-1000 rows
5. **UTF-8 Encoding:** Save CSV files with UTF-8 encoding
6. **Image URLs:** Use publicly accessible URLs
7. **Off-Peak Hours:** Import during low-traffic times

### For Developers

1. **Auto-Refresh:** Progress updates every 3 seconds
2. **Query Invalidation:** Refresh data after mutations
3. **Error Boundaries:** Wrap components in error boundaries
4. **Loading States:** Show loading indicators during API calls
5. **Toast Notifications:** Provide user feedback for all actions
6. **Responsive Design:** Ensure mobile compatibility
7. **Accessibility:** Use semantic HTML and ARIA labels

---

## Styling & Design

### Design System

- **Primary Color:** Orange (#FF6F00 to #E65100)
- **Success Color:** Green
- **Error Color:** Red
- **Warning Color:** Yellow
- **Info Color:** Blue
- **Neutral Color:** Gray

### Component Patterns

1. **Cards:** Rounded corners (rounded-2xl), shadow, ring border
2. **Buttons:** Gradient backgrounds, shadow effects, hover states
3. **Progress Bars:** Gradient fill, smooth transitions
4. **Status Badges:** Colored backgrounds, ring borders, icons
5. **Tables:** Hover effects, action buttons on hover
6. **Empty States:** Centered content, icon, message, CTA button

### Responsive Breakpoints

- **Mobile:** < 768px (single column)
- **Tablet:** 768px - 1024px (adjusted grid)
- **Desktop:** > 1024px (full layout with sidebar)

---

## Integration with Products Page

### Navigation Link

Added "Bulk Import" button to Products page header:

```tsx
<Link href="/admin/products/bulk-import">
  <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50">
    <Upload className="h-5 w-5" />
    Bulk Import
  </button>
</Link>
```

**Location:** Next to "Add Product" button in actions bar

---

## Testing Checklist

### Functional Testing

- [ ] Download CSV template
- [ ] Upload valid CSV file
- [ ] Upload invalid file type (should fail)
- [ ] Upload file > 10MB (should fail)
- [ ] Monitor progress during import
- [ ] Cancel in-progress import
- [ ] Download error report
- [ ] Delete completed import
- [ ] View import details
- [ ] Refresh import status manually
- [ ] Navigate back to products page

### UI Testing

- [ ] Drag & drop file upload works
- [ ] Click to browse file works
- [ ] Progress bar animates smoothly
- [ ] Status badges display correctly
- [ ] Action buttons appear on hover
- [ ] Toast notifications appear
- [ ] Loading states display
- [ ] Empty states display
- [ ] Responsive on mobile
- [ ] Responsive on tablet

### Error Testing

- [ ] Handle network errors gracefully
- [ ] Display validation errors
- [ ] Show processing errors
- [ ] Download error report works
- [ ] Cancel import works
- [ ] Delete import works

---

## Performance Considerations

### Optimization Strategies

1. **Auto-Refresh:** Only refresh when status is 'processing' or 'pending'
2. **Query Caching:** Use React Query cache for import list
3. **Lazy Loading:** Load import history on demand
4. **Debouncing:** Debounce manual refresh clicks
5. **File Size Limit:** Enforce 10MB limit to prevent memory issues
6. **Pagination:** Paginate import history for large datasets

### Expected Performance

| Products | Estimated Time | Notes |
|----------|---------------|-------|
| 100 | 1-2 minutes | Without variations |
| 500 | 5-10 minutes | Without variations |
| 1000 | 10-20 minutes | Without variations |
| 2500 | 25-50 minutes | Without variations |

---

## Future Enhancements

### Potential Features

1. **Bulk Edit:** Edit multiple products at once
2. **Scheduled Imports:** Schedule imports for specific times
3. **Import Templates:** Save custom templates
4. **Validation Preview:** Preview data before import
5. **Duplicate Detection:** Warn about duplicate SKUs
6. **Image Upload:** Upload images with CSV
7. **Mapping Tool:** Map CSV columns to product fields
8. **Import Presets:** Save common import configurations
9. **Notifications:** Email/SMS notifications on completion
10. **Rollback:** Undo completed imports

---

## Troubleshooting

### Common Issues

**Issue:** Import stuck in "Pending"
- **Solution:** Check if queue workers are running on backend

**Issue:** Progress not updating
- **Solution:** Check network connection, manually refresh

**Issue:** File upload fails
- **Solution:** Check file size (<10MB), file type (CSV), network connection

**Issue:** Error report download fails
- **Solution:** Ensure import has failed rows, check browser download settings

**Issue:** Can't cancel import
- **Solution:** Only pending/processing imports can be cancelled

**Issue:** Can't delete import
- **Solution:** Cancel processing imports before deleting

---

## Support & Documentation

### Related Documentation

- [BULK_PRODUCT_IMPORT_API.md](./BULK_PRODUCT_IMPORT_API.md) - Backend API documentation
- [Product Management Guide](./PRODUCT_MANAGEMENT_GUIDE.md) - General product management

### API Endpoints

All endpoints are documented in `BULK_PRODUCT_IMPORT_API.md`

Base URL: `/api/admin/products/import`

---

## Changelog

### Version 1.0.0 (2026-04-21)
- ✅ Initial implementation
- ✅ CSV template download
- ✅ File upload with drag & drop
- ✅ Real-time progress tracking
- ✅ Import history table
- ✅ Error reporting and export
- ✅ Import management (cancel, delete)
- ✅ Professional UI matching admin design
- ✅ Responsive layout
- ✅ Toast notifications
- ✅ Loading states
- ✅ Empty states

---

## Credits

**Developed by:** Shah Sports Development Team  
**Date:** April 21, 2026  
**Version:** 1.0.0
