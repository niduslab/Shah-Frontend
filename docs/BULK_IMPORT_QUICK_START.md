# Bulk Product Import - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Access Bulk Import
1. Navigate to **Admin → Products**
2. Click the **"Bulk Import"** button (next to "Add Product")

### Step 2: Download Template
1. Click **"Download Template"** button
2. Open the CSV file in Excel, Google Sheets, or any spreadsheet software

### Step 3: Fill Your Data

#### Required Columns (Must Fill)
- `name` - Product name
- `category_id` - Category ID (must exist in your system)
- `price` - Product price (e.g., 99.99)

#### Common Optional Columns
- `sku` - Product SKU (auto-generated if empty)
- `brand_id` - Brand ID
- `description` - Full product description
- `short_description` - Brief description
- `quantity` - Stock quantity
- `compare_price` - Original price for showing discounts
- `status` - active, inactive, or draft
- `is_featured` - 1 for yes, 0 for no
- `weight` - Product weight
- `weight_unit` - kg, lb, or g
- `image_1` to `image_10` - Image URLs

#### Example Row
```csv
name,sku,category_id,brand_id,price,compare_price,quantity,status,is_featured
"Treadmill Pro 3000","TM-3000",5,3,1299.99,1599.99,25,"active",1
```

### Step 4: Upload Your File
1. **Drag & drop** your CSV file into the upload area, OR
2. **Click** the upload area to browse and select your file
3. Click **"Start Import"** button

### Step 5: Monitor Progress
- Watch the **real-time progress bar**
- See **success/failure counts** update live
- Wait for completion (auto-refreshes every 3 seconds)

### Step 6: Handle Errors (if any)
1. If there are failed rows, click **"Download Error Report"**
2. Review the errors in the downloaded CSV
3. Fix the issues in your original file
4. Re-upload the corrected file

---

## 📋 Quick Tips

### ✅ Do's
- ✅ Start with a small test file (10-50 products)
- ✅ Verify category IDs and brand IDs exist before importing
- ✅ Use unique SKUs for each product
- ✅ Save your CSV with UTF-8 encoding
- ✅ Split large imports into batches of 500-1000 rows
- ✅ Use publicly accessible URLs for images

### ❌ Don'ts
- ❌ Don't upload files larger than 10MB
- ❌ Don't use duplicate SKUs
- ❌ Don't use non-existent category or brand IDs
- ❌ Don't forget required fields (name, category_id, price)
- ❌ Don't import during peak traffic hours

---

## 🎯 Common Use Cases

### 1. New Product Launch
```csv
name,category_id,price,quantity,status,is_featured
"New Product 1",5,99.99,100,"active",1
"New Product 2",5,149.99,50,"active",1
```

### 2. Bulk Price Update
```csv
name,sku,price,compare_price
"Existing Product","SKU-001",89.99,99.99
```

### 3. Stock Update
```csv
sku,quantity
"SKU-001",150
"SKU-002",75
```

### 4. Full Product Import
```csv
name,sku,category_id,brand_id,price,compare_price,quantity,description,short_description,status,is_featured,weight,weight_unit,image_1
"Complete Product","FULL-001",5,3,299.99,399.99,50,"Full description here","Short desc","active",1,10.5,"kg","https://example.com/image.jpg"
```

---

## 🔍 Status Indicators

| Status | What It Means | What To Do |
|--------|---------------|------------|
| 🟡 **Pending** | Import is queued | Wait for processing to start |
| 🔵 **Processing** | Import is running | Monitor progress, can cancel if needed |
| 🟢 **Completed** | Import finished | Review results, download errors if any |
| 🔴 **Failed** | Import failed | Check error message, fix and retry |
| ⚫ **Cancelled** | Import was stopped | Can delete or retry |

---

## 🛠️ Troubleshooting

### Problem: Upload fails
**Solutions:**
- Check file size (must be < 10MB)
- Verify file is CSV format
- Check internet connection

### Problem: Many rows failing
**Solutions:**
- Download error report
- Check category IDs exist
- Verify required fields are filled
- Check for duplicate SKUs

### Problem: Import stuck in "Pending"
**Solutions:**
- Wait a few minutes (queue may be busy)
- Contact administrator if stuck > 10 minutes

### Problem: Can't download template
**Solutions:**
- Check internet connection
- Try different browser
- Contact support

---

## 📊 Import Limits

| Limit | Value |
|-------|-------|
| Maximum file size | 10 MB |
| Recommended batch size | 500-1000 rows |
| Maximum images per product | 10 |
| Maximum variations per product | 10 |
| File format | CSV only |
| Encoding | UTF-8 |

---

## 🎨 CSV Format Tips

### Excel Users
1. Fill in your data
2. Click **File → Save As**
3. Choose **CSV UTF-8 (Comma delimited) (*.csv)**
4. Click **Save**

### Google Sheets Users
1. Fill in your data
2. Click **File → Download → Comma Separated Values (.csv)**
3. File downloads automatically

### Text Editor Users
- Use commas to separate columns
- Use quotes for text with commas
- Use UTF-8 encoding
- One product per line

---

## 📞 Need Help?

### Resources
- **Full API Documentation:** See `BULK_PRODUCT_IMPORT_API.md`
- **Frontend Guide:** See `BULK_IMPORT_FRONTEND_GUIDE.md`
- **Admin Dashboard:** Navigate to `/admin/products/bulk-import`

### Support
- Check import history for past imports
- Download error reports for detailed error information
- Contact system administrator for technical issues

---

## ✨ Pro Tips

1. **Test First:** Always test with 10-20 products before bulk importing
2. **Backup Data:** Keep a backup of your CSV file
3. **Validate IDs:** Double-check category and brand IDs
4. **Unique SKUs:** Use a consistent SKU naming convention
5. **Image URLs:** Test image URLs in browser before importing
6. **Batch Processing:** Split large files for better performance
7. **Off-Peak Hours:** Import during low-traffic times
8. **Monitor Progress:** Don't close the page during import
9. **Error Reports:** Always review error reports
10. **Incremental Updates:** Update products in small batches

---

## 🎉 Success Checklist

Before uploading, verify:
- [ ] CSV file is less than 10MB
- [ ] All required fields are filled (name, category_id, price)
- [ ] Category IDs exist in your system
- [ ] Brand IDs exist (if used)
- [ ] SKUs are unique
- [ ] Prices are valid numbers
- [ ] Status values are: active, inactive, or draft
- [ ] Image URLs are accessible
- [ ] File is saved as CSV with UTF-8 encoding
- [ ] Tested with small batch first

---

**Ready to import? Let's go! 🚀**

Navigate to: **[Admin → Products → Bulk Import](http://localhost:3000/admin/products/bulk-import)**
