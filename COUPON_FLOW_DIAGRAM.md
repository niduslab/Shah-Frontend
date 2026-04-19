# Coupon System - Flow Diagram

## 🔄 Complete User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

1. CART PAGE - APPLY COUPON
   ┌──────────────────────────────────────────────────────────┐
   │  User enters: "BOISHAK"                                  │
   │  ┌────────────────────────┬──────────┐                   │
   │  │ Enter coupon code      │  Apply   │                   │
   │  └────────────────────────┴──────────┘                   │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Frontend validates input                                │
   │  - Not empty                                             │
   │  - Converts to uppercase                                 │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  API Call: POST /api/cart/validate-coupon               │
   │  {                                                       │
   │    code: "BOISHAK",                                      │
   │    items: [...],                                         │
   │    subtotal: 1500.00                                     │
   │  }                                                       │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Backend validates:                                      │
   │  ✓ Coupon exists                                         │
   │  ✓ Not expired                                           │
   │  ✓ Minimum order met                                     │
   │  ✓ Applies to products                                   │
   │  ✓ Usage limit not exceeded                              │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Response: { success: true, data: { discount: 150 } }   │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Frontend stores in CartContext                          │
   │  setAppliedCoupon({                                      │
   │    code: "BOISHAK",                                      │
   │    discount_amount: 150,                                 │
   │    coupon: { ...full details }                           │
   │  })                                                      │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Saved to localStorage                                   │
   │  key: "applied_coupon"                                   │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  UI Updates - Green Success Box                          │
   │  ┌────────────────────────────────────────────────────┐  │
   │  │ ┌─────────┐ Coupon Applied                         │  │
   │  │ │BOISHAK  │ BOISHAK                                │  │
   │  │ └─────────┘ You saved $150.00           Remove     │  │
   │  └────────────────────────────────────────────────────┘  │
   │                                                          │
   │  Order Summary:                                          │
   │  Subtotal:    $1,500.00                                  │
   │  Discount:    -$150.00  ← NEW                            │
   │  Total:       $1,350.00  ← UPDATED                       │
   └──────────────────────────────────────────────────────────┘

2. NAVIGATE TO CHECKOUT
   ┌──────────────────────────────────────────────────────────┐
   │  User clicks "Proceed to Checkout"                       │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Checkout page loads                                     │
   │  const { appliedCoupon } = useCart()                     │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Coupon automatically loaded from CartContext            │
   │  (No need to re-enter)                                   │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Order Summary displays:                                 │
   │  Subtotal:    $1,500.00                                  │
   │  Discount:    -$150.00 ┌─────────┐                       │
   │                        │BOISHAK  │                       │
   │                        └─────────┘                       │
   │  Shipping:    $50.00                                     │
   │  Total:       $1,400.00                                  │
   └──────────────────────────────────────────────────────────┘

3. COMPLETE CHECKOUT
   ┌──────────────────────────────────────────────────────────┐
   │  User fills shipping/payment info                        │
   │  Clicks "Place Order"                                    │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  API Call: POST /api/checkout                            │
   │  {                                                       │
   │    items: [...],                                         │
   │    coupon_code: "BOISHAK",  ← INCLUDED                   │
   │    shipping_method: "standard",                          │
   │    payment_method: "cod"                                 │
   │  }                                                       │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Backend processes order with discount                   │
   │  - Creates order                                         │
   │  - Applies coupon discount                               │
   │  - Updates coupon usage count                            │
   └──────────────────────────────────────────────────────────┘
                          ↓
   ┌──────────────────────────────────────────────────────────┐
   │  Order successful                                        │
   │  - Clear cart: clearCart()                               │
   │  - Clear coupon: setAppliedCoupon(null)                  │
   │  - Redirect to invoice page                              │
   └──────────────────────────────────────────────────────────┘
```

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                             │
└─────────────────────────────────────────────────────────────────┘

CartContext (Global State)
    │
    ├─ appliedCoupon: AppliedCoupon | null
    │   ├─ code: string
    │   ├─ discount_amount: number
    │   └─ coupon: object
    │
    └─ setAppliedCoupon: (coupon) => void
         │
         ├─ Updates state
         ├─ Saves to localStorage
         └─ Triggers re-render

localStorage
    │
    └─ "applied_coupon": JSON string
         │
         ├─ Persists across page refresh
         ├─ Loaded on app mount
         └─ Cleared on cart clear

Component Usage
    │
    ├─ Cart Page
    │   ├─ Reads: appliedCoupon
    │   ├─ Writes: setAppliedCoupon()
    │   └─ Displays: Coupon box + discount
    │
    └─ Checkout Page
        ├─ Reads: appliedCoupon
        ├─ Uses: In calculations
        └─ Displays: Discount line
```

## 🎯 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                │
└─────────────────────────────────────────────────────────────────┘

User Input
    ↓
┌─────────────┐
│ Cart Page   │ → validateCoupon API
└─────────────┘         ↓
                   ┌─────────────┐
                   │ Backend API │
                   └─────────────┘
                        ↓
                   Validation
                        ↓
                   ┌─────────────┐
                   │  Response   │
                   │  { success, │
                   │    data }   │
                   └─────────────┘
                        ↓
┌─────────────────────────────────┐
│      CartContext                │
│  setAppliedCoupon(data)         │
└─────────────────────────────────┘
         ↓                ↓
┌─────────────┐    ┌─────────────┐
│ localStorage│    │  UI Update  │
└─────────────┘    └─────────────┘
         ↓
┌─────────────────────────────────┐
│    Checkout Page                │
│  const { appliedCoupon }        │
│  = useCart()                    │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Checkout API                   │
│  { coupon_code: "BOISHAK" }     │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Order Complete                 │
│  clearCart()                    │
│  setAppliedCoupon(null)         │
└─────────────────────────────────┘
```

## 🎨 UI State Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                    UI STATE TRANSITIONS                         │
└─────────────────────────────────────────────────────────────────┘

INITIAL STATE (No Coupon)
┌────────────────────────────┐
│ ┌────────────┬──────────┐  │
│ │ Enter code │  Apply   │  │
│ └────────────┴──────────┘  │
└────────────────────────────┘

         ↓ User enters code

VALIDATING STATE
┌────────────────────────────┐
│ ┌────────────┬──────────┐  │
│ │ BOISHAK    │Applying..│  │
│ └────────────┴──────────┘  │
│ [Loading spinner]          │
└────────────────────────────┘

         ↓ API responds

SUCCESS STATE
┌────────────────────────────┐
│ ┌──────────────────────┐   │
│ │ ┌────────┐ Applied   │   │
│ │ │BOISHAK │ $150 saved│   │
│ │ └────────┘   Remove  │   │
│ └──────────────────────┘   │
└────────────────────────────┘

         ↓ User clicks Remove

REMOVED STATE (Back to Initial)
┌────────────────────────────┐
│ ┌────────────┬──────────┐  │
│ │ Enter code │  Apply   │  │
│ └────────────┴──────────┘  │
└────────────────────────────┘

ERROR STATE
┌────────────────────────────┐
│ ┌────────────┬──────────┐  │
│ │ INVALID    │  Apply   │  │
│ └────────────┴──────────┘  │
│ ⚠️ Invalid coupon code     │
└────────────────────────────┘
```

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY FLOW                              │
└─────────────────────────────────────────────────────────────────┘

Frontend
    │
    ├─ Input Validation
    │   ├─ Not empty
    │   ├─ Format check
    │   └─ Sanitization
    │
    └─ Send to Backend
         ↓
Backend API
    │
    ├─ Authentication (if required)
    ├─ Rate Limiting
    ├─ Input Validation
    │   ├─ Coupon exists
    │   ├─ Not expired
    │   ├─ Usage limits
    │   └─ Product eligibility
    │
    ├─ Calculate Discount
    │   ├─ Server-side only
    │   ├─ No client manipulation
    │   └─ Verified amounts
    │
    └─ Return Response
         ↓
Frontend
    │
    ├─ Display Only
    ├─ No price calculation
    └─ Trust backend data
         ↓
Checkout
    │
    ├─ Send coupon code
    ├─ Backend recalculates
    └─ Final verification
```

## 📊 Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                               │
└─────────────────────────────────────────────────────────────────┘

API Call
    ↓
Try/Catch Block
    │
    ├─ Success
    │   ├─ response.success === true
    │   ├─ Store coupon data
    │   └─ Show success toast
    │
    └─ Error
        │
        ├─ Network Error
        │   └─ Toast: "Connection failed"
        │
        ├─ Invalid Coupon
        │   └─ Toast: "Invalid coupon code"
        │
        ├─ Expired Coupon
        │   └─ Toast: "Coupon expired"
        │
        ├─ Minimum Not Met
        │   └─ Toast: "Minimum order not met"
        │
        └─ Generic Error
            └─ Toast: "Failed to apply coupon"
```

---

**Visual Guide Complete** ✅
