# 📘 Bulk Product Import - User Guide

## Welcome to Bulk Product Import! 🎉

This guide will help you import hundreds or thousands of products into your Shah Sports store quickly and easily using CSV files.

---

## 🎯 What Can You Do?

- ✅ Import multiple products at once (up to thousands)
- ✅ Add product images via URLs
- ✅ Create product variations (colors, sizes, etc.)
- ✅ Track import progress in real-time
- ✅ Download error reports if something goes wrong
- ✅ View history of all your imports

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Navigate to Bulk Import
1. Log in to your admin panel
2. Click **"Products"** in the sidebar
3. Click the **"Bulk Import"** button (top right, next to "Add Product")

### Step 2: Download the Template
1. On the Bulk Import page, find the **"CSV Template"** card on the right
2. Click **"Download Template"** button
3. The template will download to your computer

### Step 3: Fill in Your Products
1. Open the downloaded CSV file in Excel, Google Sheets, or any spreadsheet software
2. Fill in your product information (see Required Fields below)
3. Save the file as CSV

### Step 4: Upload Your File
1. Back on the Bulk Import page, drag your CSV file into the upload area
   - OR click the upload area to browse and select your file
2. Click **"Start Import"** button
3. Watch the progress bar as your products are imported!

### Step 5: Check Results
- View the progress card showing:
  - Total products
  - Successfully imported
  - Failed imports (if any)
- If there are errors, click **"Download Error Report"** to see what went wrong

---

## 📋 CSV File Format

### Required Fields (Must Include)

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Product name | "Treadmill Pro 3000" |
| `category_id` | Category ID (must exist in your system) | 5 |
| `price` | Product price | 1299.99 |

### Common Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| `sku` | Product SKU (auto-generated if empty) | "TM-3000" |
| `brand_id` | Brand ID | 3 |
| `description` | Full product description | "Professional grade treadmill..." |
| `short_description` | Brief description | "High-performance treadmill" |
| `quantity` | Stock quantity | 25 |
| `compare_price` | Original price (for showing discounts) | 1599.99 |
| `status` | Product status | "active", "inactive", or "draft" |
| `is_featured` | Featured product | 1 (yes) or 0 (no) |
| `weight` | Product weight | 85.5 |
| `weight_unit` | Weight unit | "kg", "lb", or "g" |
| `image_1` to `image_10` | Image URLs | "https://example.com/image.jpg" |

### Example CSV Content

```csv
name,sku,category_id,brand_id,price,compare_price,quantity,status,is_featured
"Treadmill Pro 3000","TM-3000",5,3,1299.99,1599.99,25,"active",1
"Yoga Mat Premium","YM-PREM",8,7,49.99,69.99,150,"active",0
"Dumbbell Set 20kg","DB-20KG",6,4,89.99,99.99,50,"active",1
```

---

## 🎨 Page Layout Guide

### Main Upload Area (Top Left)
- **Drag & Drop Zone:** Drag your CSV file here
- **Or Click to Browse:** Click to select file from your computer
- **File Preview:** See selected file name and size
- **Start Import Button:** Click to begin the import

### Active Import Progress (Middle Left)
- **Progress Bar:** Shows percentage complete
- **Statistics:**
  - Total: Total number of products
  - Processed: How many have been processed
  - Success: Successfully imported products
  - Failed: Products that failed to import
- **Cancel Button:** Stop the import if needed
- **Download Errors:** Get a report of failed products

### Import History (Bottom Left)
- **Table of All Imports:** See all your past imports
- **Status Badges:** Visual indicators of import status
- **Actions:**
  - 👁️ View: See detailed information
  - 📥 Download: Get error report
  - ❌ Cancel: Stop in-progress import
  - 🗑️ Delete: Remove import record

### Instructions & Tips (Right Side)
- **CSV Template:** Download button for template
- **Step-by-Step Instructions:** How to use the feature
- **Requirements:** What you need to know
- **Best Practices:** Tips for successful imports

---

## 📊 Understanding Import Status

### Status Indicators

| Status | Icon | Color | What It Means |
|--------|------|-------|---------------|
| **Pending** | 🕐 | Yellow | Import is queued, waiting to start |
| **Processing** | ⚙️ | Blue | Currently importing your products |
| **Completed** | ✅ | Green | Import finished successfully |
| **Failed** | ❌ | Red | Import failed with a critical error |
| **Cancelled** | ⛔ | Gray | You stopped the import |

### What to Do for Each Status

**Pending:**
- Wait for processing to start (usually a few seconds)
- You can cancel if you change your mind

**Processing:**
- Watch the progress bar
- Don't close the page (but you can if needed - import continues in background)
- You can cancel if needed

**Completed:**
- Review the success/failure counts
- Download error report if there are failed products
- Fix errors and re-upload if needed

**Failed:**
- Read the error message
- Check your CSV file format
- Contact support if you need help

**Cancelled:**
- You can delete this import record
- Re-upload your file when ready

---

## 🔍 Common Scenarios

### Scenario 1: First Time Import (Small Test)

**Goal:** Test the system with a few products

**Steps:**
1. Download template
2. Add 5-10 test products
3. Upload and verify results
4. If successful, proceed with full import

**Example CSV:**
```csv
name,category_id,price,quantity,status
"Test Product 1",5,99.99,10,"draft"
"Test Product 2",5,149.99,20,"draft"
"Test Product 3",5,199.99,15,"draft"
```

### Scenario 2: Large Product Catalog

**Goal:** Import 1000+ products

**Steps:**
1. Split into batches of 500 products each
2. Import first batch
3. Wait for completion
4. Review results
5. Import next batch
6. Repeat until done

**Why:** Smaller batches are faster and easier to troubleshoot

### Scenario 3: Products with Images

**Goal:** Import products with multiple images

**Steps:**
1. Upload images to your CDN or image hosting
2. Get public URLs for each image
3. Add URLs to CSV in image_1, image_2, etc. columns
4. Upload CSV

**Example CSV:**
```csv
name,category_id,price,image_1,image_2,image_3
"Product A",5,99.99,"https://cdn.example.com/img1.jpg","https://cdn.example.com/img2.jpg","https://cdn.example.com/img3.jpg"
```

### Scenario 4: Products with Variations

**Goal:** Import products with different colors, sizes, etc.

**Steps:**
1. Add variation columns to CSV
2. Format: `variation_1_sku`, `variation_1_attributes`, `variation_1_price`, `variation_1_quantity`
3. Attributes format: `key:value|key:value`

**Example CSV:**
```csv
name,category_id,price,variation_1_sku,variation_1_attributes,variation_1_price,variation_1_quantity
"T-Shirt",10,29.99,"TS-BLK-M","color:Black|size:Medium",29.99,50
```

### Scenario 5: Updating Existing Products

**Goal:** Update prices or stock for existing products

**Steps:**
1. Export current products (if available)
2. Update the fields you want to change
3. Keep SKUs the same (system will update instead of create)
4. Upload CSV

**Example CSV:**
```csv
sku,price,quantity
"EXISTING-SKU-1",89.99,100
"EXISTING-SKU-2",149.99,75
```

---

## ❌ Handling Errors

### Common Errors and Solutions

#### Error: "Category ID is required"
**Solution:** Make sure every product has a valid category_id

#### Error: "Price must be a positive number"
**Solution:** Check that prices are numbers without currency symbols (e.g., 99.99, not $99.99)

#### Error: "Duplicate entry for key 'products.sku'"
**Solution:** Each SKU must be unique. Check for duplicates in your CSV

#### Error: "Category ID does not exist"
**Solution:** Verify the category ID exists in your system. Go to Categories page to check

#### Error: "File must be a file of type: csv"
**Solution:** Save your file as CSV format, not Excel (.xlsx)

#### Error: "The file may not be greater than 10240 kilobytes"
**Solution:** Your file is too large. Split it into smaller files (500-1000 rows each)

### How to Use Error Reports

1. **Download the Error Report**
   - Click "Download Error Report" button
   - CSV file will download

2. **Open the Error Report**
   - Open in Excel or Google Sheets
   - You'll see two columns: Row Number and Errors

3. **Fix the Errors**
   - Go back to your original CSV
   - Find the row numbers mentioned
   - Fix the issues listed

4. **Re-upload**
   - Save your corrected CSV
   - Upload again

**Example Error Report:**
```csv
Row Number,Errors
15,"Category ID is required; Price must be a positive number"
23,"Database error: Duplicate entry 'SKU-123' for key 'products.sku'"
45,"Brand ID does not exist"
```

---

## 💡 Pro Tips

### Before Uploading

1. **Test with Small Batch**
   - Always test with 10-20 products first
   - Verify everything works before full import

2. **Validate Your Data**
   - Check category IDs exist
   - Check brand IDs exist
   - Verify all SKUs are unique
   - Test image URLs in browser

3. **Use Consistent Formatting**
   - Same date format throughout
   - Same number format (decimal point, not comma)
   - Same text encoding (UTF-8)

### During Upload

1. **Don't Close the Page**
   - Keep the page open while importing
   - You can minimize the browser, but don't close it

2. **Monitor Progress**
   - Watch for errors as they appear
   - Note the success/failure ratio

3. **Be Patient**
   - Large imports take time
   - 1000 products ≈ 10-20 minutes

### After Upload

1. **Review Results**
   - Check success count matches expected
   - Download error report if any failures
   - Verify a few products in the Products page

2. **Fix and Re-import**
   - Fix errors in original CSV
   - Re-upload only the failed products
   - Or re-upload entire file (duplicates will be updated)

3. **Clean Up**
   - Delete old import records
   - Keep successful imports for reference

---

## 📱 Mobile & Tablet Support

The Bulk Import page works on all devices:

- **Desktop:** Full layout with all features
- **Tablet:** Adjusted layout, all features available
- **Mobile:** Simplified layout, may need to scroll horizontally for tables

**Recommendation:** Use desktop for best experience, especially for large imports.

---

## ⏱️ Expected Processing Times

| Number of Products | Estimated Time | Notes |
|-------------------|----------------|-------|
| 10-50 | 1-2 minutes | Good for testing |
| 100 | 2-5 minutes | Small catalog |
| 500 | 5-10 minutes | Medium catalog |
| 1000 | 10-20 minutes | Large catalog |
| 2500+ | 25-50 minutes | Very large catalog |

**Factors that affect speed:**
- Number of images per product
- Number of variations per product
- Server load
- Database performance

---

## 🎓 Training Checklist

Use this checklist to train new team members:

- [ ] Show how to access Bulk Import page
- [ ] Demonstrate downloading template
- [ ] Explain required vs optional fields
- [ ] Show how to fill in CSV file
- [ ] Demonstrate file upload (drag & drop and browse)
- [ ] Explain progress tracking
- [ ] Show how to download error reports
- [ ] Demonstrate fixing errors and re-uploading
- [ ] Show import history and actions
- [ ] Explain status indicators
- [ ] Practice with test import (5-10 products)
- [ ] Review best practices and tips

---

## 📞 Getting Help

### Self-Service Resources

1. **This User Guide:** Complete instructions and examples
2. **Quick Start Guide:** `BULK_IMPORT_QUICK_START.md`
3. **API Documentation:** `BULK_PRODUCT_IMPORT_API.md` (for developers)
4. **Error Reports:** Download from the import page

### When to Contact Support

- Import stuck in "Pending" for more than 10 minutes
- Repeated failures with same error
- Can't download template or error reports
- Questions about category or brand IDs
- Need help with CSV formatting

### What to Include When Asking for Help

1. **Import ID:** Found in import history table
2. **Error Message:** Copy the exact error text
3. **CSV File:** Attach your CSV file (or sample rows)
4. **Error Report:** Attach downloaded error report
5. **Screenshots:** Show what you're seeing

---

## 🎯 Success Metrics

Track your import success:

- **Success Rate:** Aim for 95%+ successful imports
- **Error Rate:** Keep below 5%
- **Processing Time:** Monitor for performance issues
- **Re-import Rate:** How often you need to re-upload

**Good Performance:**
- ✅ 95%+ success rate
- ✅ Errors are mostly data issues (not system issues)
- ✅ Processing time is consistent
- ✅ Minimal re-imports needed

---

## 🔄 Workflow Examples

### Daily Product Updates

**Frequency:** Daily  
**Volume:** 50-100 products  
**Purpose:** Update prices and stock

**Workflow:**
1. Export current products (if available)
2. Update prices/stock in spreadsheet
3. Save as CSV
4. Upload via Bulk Import
5. Verify updates in Products page

### New Product Launch

**Frequency:** Weekly/Monthly  
**Volume:** 100-500 products  
**Purpose:** Add new products

**Workflow:**
1. Prepare product data in spreadsheet
2. Add images to CDN
3. Get image URLs
4. Fill in CSV template
5. Test with 10 products
6. Upload full batch
7. Review and publish

### Seasonal Catalog Update

**Frequency:** Quarterly  
**Volume:** 1000+ products  
**Purpose:** Major catalog refresh

**Workflow:**
1. Plan import schedule (off-peak hours)
2. Split into batches of 500
3. Import first batch
4. Verify results
5. Import next batch
6. Repeat until complete
7. Final review and QA

---

## 📚 Additional Resources

### Documentation Files

- **Quick Start:** `BULK_IMPORT_QUICK_START.md`
- **Frontend Guide:** `BULK_IMPORT_FRONTEND_GUIDE.md`
- **API Documentation:** `BULK_PRODUCT_IMPORT_API.md`
- **Architecture:** `BULK_IMPORT_ARCHITECTURE.md`
- **Implementation:** `BULK_IMPORT_IMPLEMENTATION_COMPLETE.md`

### Video Tutorials (Coming Soon)

- How to download and fill the template
- Uploading your first import
- Handling errors and re-importing
- Advanced features (variations, images)

---

## ✅ Pre-Import Checklist

Before every import, verify:

- [ ] CSV file is less than 10MB
- [ ] File is saved as CSV (not Excel)
- [ ] UTF-8 encoding is used
- [ ] All required fields are filled (name, category_id, price)
- [ ] Category IDs exist in system
- [ ] Brand IDs exist (if used)
- [ ] All SKUs are unique
- [ ] Prices are valid numbers (no currency symbols)
- [ ] Status values are correct (active, inactive, draft)
- [ ] Image URLs are accessible (test in browser)
- [ ] Tested with small batch first (10-20 products)

---

## 🎉 You're Ready!

You now know everything you need to successfully import products in bulk. Start with a small test import, and you'll be importing thousands of products in no time!

**Next Steps:**
1. Go to [Admin → Products → Bulk Import](http://localhost:3000/admin/products/bulk-import)
2. Download the template
3. Add 5-10 test products
4. Upload and verify
5. Scale up to your full catalog

**Happy Importing! 🚀**

---

**Document Version:** 1.0.0  
**Last Updated:** April 21, 2026  
**For:** Shah Sports Admin Users
