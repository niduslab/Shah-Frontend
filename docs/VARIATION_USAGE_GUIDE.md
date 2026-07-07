# Product Variation System - Usage Guide

## Overview
The product variation system allows you to create different versions of a product (e.g., different colors, sizes, materials) with unique SKU, price, and stock levels.

## How It Works

### 1. Create Variation Types (Optional but Recommended)
First, go to the **Variations** page in the admin panel to set up variation types:

- **Variation Types**: Categories like "Color", "Size", "Material", etc.
- **Variation Options**: Specific values like "Red", "Blue", "Large", "Small", etc.

**Example:**
- Type: "Color" → Options: "Red", "Blue", "Green"
- Type: "Size" → Options: "Small", "Medium", "Large"

### 2. Add Product Variations
When creating or editing a product:

1. Scroll to the **Product Variations** section
2. Click **"Add Variation"** button
3. Fill in the variation details:
   - **SKU**: Unique identifier (e.g., TSHIRT-RED-L)
   - **Price**: Price for this specific variation
   - **Stock**: Quantity available

4. Click **"Add Attribute"** to specify what makes this variation unique:
   - **Option A**: Select from predefined variation types (if you created them)
   - **Option B**: Add custom attributes manually

### 3. Understanding the UI

#### When Variation Types Exist:
- You'll see buttons for each variation option (e.g., "Red", "Blue", "Large")
- Click any button to quickly add that attribute to your variation
- You can still add custom attributes if needed

#### When No Variation Types Exist:
- You'll see a message: "No variation types configured yet"
- You can still create variations using custom attributes
- Consider creating variation types for faster workflow

### 4. Example Workflow

**Scenario**: Adding a T-shirt with different colors and sizes

**Step 1**: Create variation types (one-time setup)
- Go to Variations page
- Create "Color" type with options: Red, Blue, Green
- Create "Size" type with options: S, M, L, XL

**Step 2**: Add product variations
1. Add Variation #1:
   - SKU: TSHIRT-RED-S
   - Price: $19.99
   - Stock: 50
   - Attributes: Color=Red, Size=S

2. Add Variation #2:
   - SKU: TSHIRT-RED-M
   - Price: $19.99
   - Stock: 75
   - Attributes: Color=Red, Size=M

3. Continue for all combinations...

## Key Features

### Previously Created Variations
- When editing a product, all existing variations are automatically loaded
- You can modify SKU, price, stock, or attributes
- You can add new variations or remove existing ones
- Changes are saved when you submit the form

### Attribute Management
- **Add Attribute**: Opens a selector to choose from predefined types or add custom
- **Edit Attribute**: Click on the attribute value to modify it
- **Remove Attribute**: Click the × button next to the attribute

### Visual Indicators
- **Color attributes**: Show color swatches when color codes are defined
- **Loading state**: Shows spinner while fetching variation types
- **Empty state**: Clear message when no variations exist
- **Warnings**: Alerts when no variation types are configured

## Best Practices

1. **Unique SKUs**: Each variation must have a unique SKU
   - Good: PROD-RED-L, PROD-BLUE-L, PROD-RED-M
   - Bad: PROD-001, PROD-001, PROD-001

2. **Consistent Naming**: Use a consistent format for SKUs
   - Format: PRODUCT-ATTRIBUTE1-ATTRIBUTE2
   - Example: TSHIRT-RED-LARGE

3. **Set Up Variation Types First**: Create variation types before adding products
   - Saves time when adding multiple products
   - Ensures consistency across products
   - Easier to manage and update

4. **Price Strategy**: 
   - Base product price is used when no variations exist
   - Each variation can have its own price
   - Use compare_price for showing discounts

## Troubleshooting

### "No variations added" message
- This is normal for new products
- Click "Add Variation" to create your first variation
- Product will use base price and SKU if no variations exist

### "No variation types configured yet"
- You can still add variations using custom attributes
- Go to Variations page to create types for faster workflow
- This is just a convenience feature, not required

### Variations not showing when editing
- Make sure the product was saved with variations
- Check that the API is returning variation data
- Refresh the page if data seems stale

### Can't select predefined attributes
- Verify variation types exist in the Variations page
- Check that variation types have options defined
- Ensure variation types are marked as active

## Technical Notes

- Variations are saved as part of the product data
- Each variation is linked to the parent product
- Attributes are stored as key-value pairs (flexible structure)
- Variation types are optional but recommended for better UX
- The system supports unlimited variations per product
- Images can be shared across variations (product-level)

## Summary

The variation system is designed to be flexible:
- **Quick Setup**: Use predefined variation types for common attributes
- **Custom Attributes**: Add any attribute on-the-fly
- **Edit Anytime**: Modify existing variations when editing products
- **No Limits**: Add as many variations as needed

The system works whether or not you've created variation types - they just make the process faster and more consistent!
