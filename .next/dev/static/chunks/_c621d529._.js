(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/services/otpAuthService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "otpAuthService",
    ()=>otpAuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/axios.ts [app-client] (ecmascript)");
;
const API_BASE = '/api/auth';
const otpAuthService = {
    // Send OTP to email
    sendOtp: async (email)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE}/send-otp`, {
            email
        });
        return response.data;
    },
    // Send Registration OTP
    sendRegistrationOtp: async (email)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE}/send-registration-otp`, {
            email
        });
        return response.data;
    },
    // Verify OTP code (optional step)
    verifyOtp: async (email, otp)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE}/verify-otp`, {
            email,
            otp
        });
        return response.data;
    },
    // Reset password with OTP
    resetPassword: async (email, otp, password, passwordConfirmation)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE}/reset-password-otp`, {
            email,
            otp,
            password,
            password_confirmation: passwordConfirmation
        });
        return response.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils/image.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Get the full URL for an image stored on the backend
 * @param path - The relative path from the backend (e.g., "brands/logo.png" or "/storage/brands/logo.png")
 * @returns Full URL to the image
 */ __turbopack_context__.s([
    "getAllImageUrls",
    ()=>getAllImageUrls,
    "getImageUrl",
    ()=>getImageUrl,
    "getPlaceholderImage",
    ()=>getPlaceholderImage,
    "getPrimaryImageUrl",
    ()=>getPrimaryImageUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function getImageUrl(path) {
    if (!path) return '';
    // If it's already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    const apiUrl = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
    // If path already starts with /storage, just prepend the API URL
    if (path.startsWith('/storage/')) {
        return `${apiUrl}${path}`;
    }
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Construct full URL - backend serves storage files at /storage/{path}
    return `${apiUrl}/storage/${cleanPath}`;
}
function getPlaceholderImage(text = 'No Image') {
    const encodedText = encodeURIComponent(text.slice(0, 20));
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E${encodedText}%3C/text%3E%3C/svg%3E`;
}
function getPrimaryImageUrl(images) {
    if (!images || images.length === 0) return getPlaceholderImage();
    const primaryImage = images.find((img)=>img.is_primary);
    const imageToUse = primaryImage || images[0];
    // Use full_url if available, otherwise fall back to image_path
    const imagePath = imageToUse.full_url || imageToUse.image_path;
    const url = getImageUrl(imagePath);
    return url || getPlaceholderImage();
}
function getAllImageUrls(images) {
    if (!images || images.length === 0) return [];
    return images.map((img)=>{
        const imagePath = img.full_url || img.image_path;
        return getImageUrl(imagePath);
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/components/OtpInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OtpInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function OtpInput({ length = 6, value, onChange, disabled = false }) {
    _s();
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Array(length).fill(''));
    const inputRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OtpInput.useEffect": ()=>{
            const newOtp = new Array(length).fill('');
            if (value) {
                const chars = value.split('');
                chars.forEach({
                    "OtpInput.useEffect": (char, i)=>{
                        if (i < length) newOtp[i] = char;
                    }
                }["OtpInput.useEffect"]);
            }
            setOtp(newOtp);
        }
    }["OtpInput.useEffect"], [
        value,
        length
    ]);
    const handleChange = (element, index)=>{
        if (isNaN(Number(element.value))) return;
        const newOtp = [
            ...otp
        ];
        newOtp[index] = element.value;
        setOtp(newOtp);
        // Call parent onChange
        onChange(newOtp.join(''));
        // Focus next input
        if (element.value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const setInputRef = (index)=>(ref)=>{
            inputRefs.current[index] = ref;
        };
    const handleKeyDown = (e, index)=>{
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    const handlePaste = (e)=>{
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length);
        const newOtp = pastedData.split('');
        setOtp(newOtp);
        onChange(newOtp.join(''));
        // Focus last filled input
        const lastIndex = Math.min(newOtp.length - 1, length - 1);
        inputRefs.current[lastIndex]?.focus();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-2 justify-center",
        children: otp.map((digit, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: setInputRef(index),
                type: "text",
                inputMode: "numeric",
                maxLength: 1,
                value: digit,
                onChange: (e)=>handleChange(e.target, index),
                onKeyDown: (e)=>handleKeyDown(e, index),
                onPaste: handlePaste,
                disabled: disabled,
                autoFocus: index === 0,
                className: "w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 border-border bg-gray-50/50 outline-none transition-all focus:border-[#0B3B2D] focus:ring-2 focus:ring-[#0B3B2D]/10 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            }, index, false, {
                fileName: "[project]/lib/components/OtpInput.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/lib/components/OtpInput.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_s(OtpInput, "WbtLqFRLv4b+9uuvzVsTpZ9ripE=");
_c = OtpInput;
var _c;
__turbopack_context__.k.register(_c, "OtpInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/services/analyticsService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Analytics Service
 * 
 * Tracks user behavior and interactions across the e-commerce platform.
 * All tracking is done asynchronously and failures are logged without disrupting user experience.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/axios.ts [app-client] (ecmascript)");
;
class AnalyticsService {
    isEnabled = true;
    debugMode = false;
    constructor(){
        // Enable debug mode in development
        if ("TURBOPACK compile-time truthy", 1) {
            this.debugMode = true;
        }
    }
    /**
   * Internal method to send tracking data to the backend
   */ async track(endpoint, data) {
        if (!this.isEnabled) {
            return;
        }
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/api/analytics/track/${endpoint}`, data);
            if (this.debugMode) {
                console.log(`[Analytics] ${endpoint}:`, data, response.data);
            }
        } catch (error) {
            // Silently fail - analytics should never disrupt user experience
            if (this.debugMode) {
                console.error(`[Analytics] Error tracking ${endpoint}:`, error);
            }
        }
    }
    /**
   * Track page views
   * Call this on every page load
   */ async trackPageView(data) {
        await this.track('page-view', data);
    }
    /**
   * Track product views
   * Call this when a product page is viewed
   */ async trackProductView(data) {
        await this.track('product-view', data);
    }
    /**
   * Track cart events (add, update, remove)
   * Call this when cart is modified
   */ async trackCartEvent(data) {
        await this.track('cart-event', data);
    }
    /**
   * Track checkout funnel stages
   * Call this at each step of the checkout process
   */ async trackCheckout(data) {
        await this.track('checkout', data);
    }
    /**
   * Track search queries
   * Call this when users search for products
   */ async trackSearch(data) {
        await this.track('search', data);
    }
    /**
   * Convenience method: Track add to cart
   */ async trackAddToCart(productId, quantity, price, variationId) {
        await this.trackCartEvent({
            event_type: 'added',
            product_id: productId,
            quantity,
            price,
            variation_id: variationId
        });
    }
    /**
   * Convenience method: Track remove from cart
   */ async trackRemoveFromCart(productId, quantity, price) {
        await this.trackCartEvent({
            event_type: 'removed',
            product_id: productId,
            quantity,
            price
        });
    }
    /**
   * Convenience method: Track cart quantity update
   */ async trackUpdateCartQuantity(productId, quantity, price, variationId) {
        await this.trackCartEvent({
            event_type: 'updated',
            product_id: productId,
            quantity,
            price,
            variation_id: variationId
        });
    }
    /**
   * Enable or disable analytics tracking
   */ setEnabled(enabled) {
        this.isEnabled = enabled;
    }
    /**
   * Check if analytics is enabled
   */ isAnalyticsEnabled() {
        return this.isEnabled;
    }
}
// Export singleton instance
const analyticsService = new AnalyticsService();
const __TURBOPACK__default__export__ = analyticsService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/hooks/useAnalytics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnalytics",
    ()=>useAnalytics,
    "usePageViewTracking",
    ()=>usePageViewTracking,
    "useProductViewTracking",
    ()=>useProductViewTracking
]);
/**
 * useAnalytics Hook
 * 
 * React hook for easy analytics integration in components
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/analyticsService.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
function useAnalytics() {
    _s();
    return {
        trackPageView: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useAnalytics.useCallback": (data)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackPageView(data);
            }
        }["useAnalytics.useCallback"], []),
        trackProductView: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useAnalytics.useCallback": (data)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackProductView(data);
            }
        }["useAnalytics.useCallback"], []),
        trackCartEvent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useAnalytics.useCallback": (data)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackCartEvent(data);
            }
        }["useAnalytics.useCallback"], []),
        trackCheckout: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useAnalytics.useCallback": (data)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackCheckout(data);
            }
        }["useAnalytics.useCallback"], []),
        trackSearch: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useAnalytics.useCallback": (data)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackSearch(data);
            }
        }["useAnalytics.useCallback"], []),
        // Convenience methods
        trackAddToCart: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useAnalytics.useCallback": (productId, quantity, price, variationId)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackAddToCart(productId, quantity, price, variationId);
            }
        }["useAnalytics.useCallback"], []),
        trackRemoveFromCart: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useAnalytics.useCallback": (productId, quantity, price)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackRemoveFromCart(productId, quantity, price);
            }
        }["useAnalytics.useCallback"], []),
        trackUpdateCartQuantity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useAnalytics.useCallback": (productId, quantity, price, variationId)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackUpdateCartQuantity(productId, quantity, price, variationId);
            }
        }["useAnalytics.useCallback"], [])
    };
}
_s(useAnalytics, "6Icu0EDfe9oXLCo4O3D76y89TOk=");
function usePageViewTracking(data) {
    _s1();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePageViewTracking.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackPageView(data);
        }
    }["usePageViewTracking.useEffect"], [
        data.page_type,
        data.page_title,
        data.product_id,
        data.category_id
    ]);
}
_s1(usePageViewTracking, "OD7bBpZva5O2jO+Puf00hKivP7c=");
function useProductViewTracking(productId) {
    _s2();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProductViewTracking.useEffect": ()=>{
            if (productId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$analyticsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].trackProductView({
                    product_id: productId
                });
            }
        }
    }["useProductViewTracking.useEffect"], [
        productId
    ]);
}
_s2(useProductViewTracking, "OD7bBpZva5O2jO+Puf00hKivP7c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(public)/checkout/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CheckoutPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/context/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/hooks/user/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useAddresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hooks/user/useAddresses.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useCheckout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hooks/user/useCheckout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$otpAuthService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/otpAuthService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$image$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/image.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$components$2f$OtpInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/components/OtpInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$useAnalytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hooks/useAnalytics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building.js [app-client] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
const addressTypeConfig = {
    user_address: {
        label: 'Home',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
        color: 'text-blue-600 bg-blue-50'
    },
    shipping_address: {
        label: 'Shipping',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"],
        color: 'text-green-600 bg-green-50'
    },
    billing_address: {
        label: 'Billing',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
        color: 'text-purple-600 bg-purple-50'
    }
};
function CheckoutPage() {
    _s();
    const { user, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { items, getCartCount, clearCart, appliedCoupon, setAppliedCoupon } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const { data: addressesData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useAddresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddresses"])();
    const createAddressMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useAddresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateAddress"])();
    const processCheckout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useCheckout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProcessCheckout"])();
    const getShippingMethods = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useCheckout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetShippingMethods"])();
    const sendRegistrationOtp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useCheckout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSendRegistrationOtp"])();
    const analytics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$useAnalytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalytics"])();
    const [paymentMethod, setPaymentMethod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("cod");
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shippingMethods, setShippingMethods] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedShipping, setSelectedShipping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Email OTP verification states
    const [emailVerified, setEmailVerified] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [otpSent, setOtpSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sendingOtp, setSendingOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [verifyingOtp, setVerifyingOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [otpTimer, setOtpTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Address management
    const [selectedAddressId, setSelectedAddressId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddressForm, setShowAddressForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [addressFormData, setAddressFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        address_line_1: '',
        address_line_2: '',
        contact_no: '',
        city: '',
        state: '',
        zip_code: '',
        address_type: 'shipping_address',
        is_default: false
    });
    // Guest user form data
    const [guestData, setGuestData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        street: "",
        city: "",
        district: "",
        zipCode: "",
        createAccount: true
    });
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const addresses = addressesData?.data || [];
    // Calculate totals
    const subTotal = items.reduce((acc, item)=>{
        const price = item.variation ? parseFloat(item.variation.price) : parseFloat(item.product?.price || 0);
        return acc + price * item.quantity;
    }, 0);
    const totalItems = getCartCount();
    const selectedShippingMethod = shippingMethods.find((m)=>m.code === selectedShipping);
    const shipping = selectedShippingMethod?.cost || 0;
    const discount = appliedCoupon?.discount_amount || 0;
    const totalPrice = subTotal - discount + shipping;
    // Set client-side flag
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            setIsClient(true);
        }
    }["CheckoutPage.useEffect"], []);
    // OTP timer countdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            if (otpTimer > 0) {
                const timer = setTimeout({
                    "CheckoutPage.useEffect.timer": ()=>setOtpTimer(otpTimer - 1)
                }["CheckoutPage.useEffect.timer"], 1000);
                return ({
                    "CheckoutPage.useEffect": ()=>clearTimeout(timer)
                })["CheckoutPage.useEffect"];
            }
        }
    }["CheckoutPage.useEffect"], [
        otpTimer
    ]);
    // Auto-verify email for authenticated users
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            if (user) {
                setEmailVerified(true);
            }
        }
    }["CheckoutPage.useEffect"], [
        user
    ]);
    // Auto-select default address for authenticated users
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            if (user && addresses.length > 0 && !selectedAddressId) {
                const defaultAddress = addresses.find({
                    "CheckoutPage.useEffect.defaultAddress": (addr)=>addr.is_default
                }["CheckoutPage.useEffect.defaultAddress"]);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id);
                } else {
                    setSelectedAddressId(addresses[0].id);
                }
            }
        }
    }["CheckoutPage.useEffect"], [
        user,
        addresses,
        selectedAddressId
    ]);
    // Redirect to cart if empty (but not during processing)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            if (!authLoading && items.length === 0 && isClient && !isProcessing) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Your cart is empty');
                window.location.href = '/cart';
            }
        }
    }["CheckoutPage.useEffect"], [
        items,
        authLoading,
        isClient,
        isProcessing
    ]);
    // Fetch shipping methods
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            if (items.length > 0 && isClient) {
                fetchShippingMethods();
            }
        }
    }["CheckoutPage.useEffect"], [
        items,
        isClient,
        subTotal,
        selectedAddressId
    ]);
    const fetchShippingMethods = async ()=>{
        try {
            const response = await getShippingMethods.mutateAsync({
                items: items.map((item)=>({
                        product_id: item.product_id,
                        variation_id: item.variation_id || null,
                        quantity: item.quantity
                    })),
                address_id: selectedAddressId || undefined,
                subtotal: subTotal
            });
            if (response.success && response.data) {
                setShippingMethods(response.data);
                // Auto-select cheapest method
                if (response.data.length > 0) {
                    const cheapest = response.data.reduce((min, method)=>method.cost < min.cost ? method : min);
                    setSelectedShipping(cheapest.code);
                }
            }
        } catch (error) {
            console.error('Failed to fetch shipping methods:', error);
            // Set default shipping if API fails
            setShippingMethods([
                {
                    code: 'standard',
                    name: 'Standard Shipping',
                    description: 'Standard delivery',
                    cost: 50,
                    base_shipping_cost: 50,
                    custom_shipping_cost: 0,
                    delivery_time: '3-5 business days',
                    free_shipping_min_order: 1000,
                    is_free: false
                }
            ]);
            setSelectedShipping('standard');
        }
    };
    // Handle input change
    const handleInputChange = (field, value)=>{
        setGuestData((prev)=>({
                ...prev,
                [field]: value
            }));
        if (errors[field]) {
            setErrors((prev)=>({
                    ...prev,
                    [field]: ''
                }));
        }
        // Reset email verification if email changes
        if (field === 'email' && typeof value === 'string') {
            setEmailVerified(false);
            setOtpSent(false);
            setOtp("");
        }
    };
    // Send OTP to email
    const handleSendOtp = async ()=>{
        // Validate email first
        if (!guestData.email.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please enter your email address');
            return;
        }
        if (!isValidEmail(guestData.email)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please enter a valid email address');
            return;
        }
        setSendingOtp(true);
        try {
            const data = await sendRegistrationOtp.mutateAsync({
                email: guestData.email
            });
            if (data.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Verification code sent to your email');
                setOtpSent(true);
                setOtpTimer(120); // 2 minutes
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(data.message || 'Failed to send verification code');
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to send verification code. Please try again.';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage);
        } finally{
            setSendingOtp(false);
        }
    };
    // Verify OTP
    const handleVerifyOtp = async ()=>{
        if (otp.length !== 6) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please enter the 6-digit verification code');
            return;
        }
        setVerifyingOtp(true);
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$otpAuthService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["otpAuthService"].verifyOtp(guestData.email, otp);
            if (data.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Email verified successfully!');
                setEmailVerified(true);
                setOtpTimer(0);
                setErrors((prev)=>({
                        ...prev,
                        email: ''
                    }));
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(data.message || 'Invalid or expired verification code');
            // Don't clear OTP on error, let user try again
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to verify code. Please try again.';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage);
        // Don't clear OTP on error, let user try again
        } finally{
            setVerifyingOtp(false);
        }
    };
    // Handle OTP input change (only update state, don't auto-verify)
    const handleOtpChange = (value)=>{
        setOtp(value);
    };
    // Handle address form change
    const handleAddressFormChange = (field, value)=>{
        setAddressFormData((prev)=>({
                ...prev,
                [field]: value
            }));
    };
    // Handle create new address
    const handleCreateAddress = async ()=>{
        try {
            const response = await createAddressMutation.mutateAsync(addressFormData);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Address added successfully');
                setShowAddressForm(false);
                setSelectedAddressId(response.data.id);
                // Reset form
                setAddressFormData({
                    address_line_1: '',
                    address_line_2: '',
                    contact_no: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    address_type: 'shipping_address',
                    is_default: false
                });
            }
        } catch (error) {
            console.error('Failed to create address:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to add address');
        }
    };
    // Validate email
    const isValidEmail = (email)=>{
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    // Validate phone
    const isValidPhone = (phone)=>{
        return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };
    // Validate form
    const validateForm = ()=>{
        const newErrors = {};
        if (!user) {
            // Guest validation
            if (!guestData.fullName.trim()) {
                newErrors.fullName = 'Full name is required';
            } else if (guestData.fullName.trim().length < 3) {
                newErrors.fullName = 'Name must be at least 3 characters';
            }
            if (!guestData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!isValidEmail(guestData.email)) {
                newErrors.email = 'Please enter a valid email address';
            } else if (!emailVerified) {
                newErrors.email = 'Please verify your email address';
            }
            if (!guestData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (!isValidPhone(guestData.phone)) {
                newErrors.phone = 'Please enter a valid phone number (min 10 digits)';
            }
            if (guestData.createAccount) {
                if (!guestData.password) {
                    newErrors.password = 'Password is required';
                } else if (guestData.password.length > 8) {
                    newErrors.password = 'Password must be 1-8 characters';
                }
                if (!guestData.confirmPassword) {
                    newErrors.confirmPassword = 'Please confirm your password';
                } else if (guestData.password !== guestData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
            }
            if (!guestData.street.trim()) {
                newErrors.street = 'Street address is required';
            } else if (guestData.street.trim().length < 5) {
                newErrors.street = 'Please enter a complete address';
            }
            if (!guestData.city) {
                newErrors.city = 'City is required';
            }
            if (!guestData.district) {
                newErrors.district = 'District is required';
            }
        } else {
            // Authenticated user validation
            if (!selectedAddressId) {
                newErrors.address = 'Please select a shipping address';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Handle checkout
    const handleCheckout = async ()=>{
        if (isProcessing) return;
        // Validate form
        if (!validateForm()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please fill in all required fields correctly');
            // Scroll to first error
            const firstErrorField = Object.keys(errors)[0];
            const element = document.querySelector(`[name="${firstErrorField}"]`);
            element?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            return;
        }
        setIsProcessing(true);
        try {
            // Validate shipping method selected
            if (!selectedShipping) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please select a shipping method');
                return;
            }
            // Track shipping info entered
            analytics.trackCheckout({
                status: 'shipping_info_entered'
            });
            // Track payment info entered
            analytics.trackCheckout({
                status: 'payment_info_entered'
            });
            const checkoutData = {
                items: items.map((item)=>({
                        product_id: item.product_id,
                        variation_id: item.variation_id || null,
                        quantity: item.quantity,
                        price: item.variation ? parseFloat(item.variation.price) : parseFloat(item.product?.price || '0')
                    })),
                shipping_method: selectedShipping,
                payment_method: paymentMethod === 'ssl' ? 'ssl_commerz' : 'cash_on_delivery'
            };
            // Add coupon if applied
            if (appliedCoupon) {
                checkoutData.coupon_code = appliedCoupon.code;
            }
            if (user) {
                // Authenticated user checkout
                checkoutData.shipping_address_id = selectedAddressId;
                checkoutData.billing_address_id = selectedAddressId;
            } else {
                // Guest checkout
                checkoutData.guest_name = guestData.fullName;
                checkoutData.guest_email = guestData.email;
                checkoutData.guest_phone = guestData.phone;
                checkoutData.shipping_address = {
                    address_line_1: guestData.street,
                    city: guestData.city,
                    state: guestData.district,
                    zip_code: guestData.zipCode || '',
                    country: 'Bangladesh',
                    phone: guestData.phone
                };
                if (guestData.createAccount) {
                    checkoutData.create_account = true;
                    checkoutData.password = guestData.password;
                }
            }
            const response = await processCheckout.mutateAsync(checkoutData);
            console.log('Checkout response:', response);
            if (response.success) {
                // Track order completed
                const orderNumber = response.data?.order_number || response.data?.order?.order_number;
                const orderId = response.data?.id || response.data?.order?.id;
                const productIds = items.map((item)=>item.product_id);
                analytics.trackCheckout({
                    status: 'order_completed',
                    order_id: orderId,
                    product_ids: productIds
                });
                // Show success message
                if (!user && guestData.createAccount) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Order placed! Account created successfully.');
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Order placed successfully!');
                }
                // Handle payment redirect
                if (paymentMethod === 'ssl') {
                    // Check for redirect URL in various possible locations
                    const redirectUrl = response.data?.payment?.redirect_url || response.data?.redirect_url || response.data?.payment_url || response.data?.gatewayPageURL;
                    if (redirectUrl) {
                        console.log('Redirecting to SSL Commerce:', redirectUrl);
                        // Don't clear cart - it will be cleared after successful payment
                        // Use a small delay to ensure state is saved
                        setTimeout(()=>{
                            window.location.href = redirectUrl;
                        }, 100);
                        return; // Don't continue execution
                    } else {
                        console.error('SSL Commerce redirect URL not found in response:', response);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Payment gateway URL not received. Please try again.');
                        setIsProcessing(false);
                        return;
                    }
                } else {
                    // For COD, clear cart and coupon, then redirect to invoice page
                    clearCart();
                    setAppliedCoupon(null);
                    if (orderNumber) {
                        setTimeout(()=>{
                            window.location.href = `/invoice/${orderNumber}`;
                        }, 100);
                    } else {
                        setTimeout(()=>{
                            window.location.href = '/';
                        }, 100);
                    }
                }
            } else {
                console.error('Checkout failed:', response);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(response.message || 'Failed to process checkout');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || 'Failed to process checkout. Please try again.';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage);
            setIsProcessing(false);
        }
    };
    // Show loading state
    if (authLoading || !isClient) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "h-8 w-8 animate-spin text-primary"
            }, void 0, false, {
                fileName: "[project]/app/(public)/checkout/page.tsx",
                lineNumber: 572,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(public)/checkout/page.tsx",
            lineNumber: 571,
            columnNumber: 7
        }, this);
    }
    // Redirect if cart is empty
    if (items.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-white pb-20 pt-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto w-full max-w-[1400px] px-4 md:px-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8 text-sm text-gray-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "hover:text-black",
                            children: "Home"
                        }, void 0, false, {
                            fileName: "[project]/app/(public)/checkout/page.tsx",
                            lineNumber: 587,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mx-2",
                            children: "/"
                        }, void 0, false, {
                            fileName: "[project]/app/(public)/checkout/page.tsx",
                            lineNumber: 588,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/cart",
                            className: "hover:text-black",
                            children: "Cart"
                        }, void 0, false, {
                            fileName: "[project]/app/(public)/checkout/page.tsx",
                            lineNumber: 589,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mx-2",
                            children: "/"
                        }, void 0, false, {
                            fileName: "[project]/app/(public)/checkout/page.tsx",
                            lineNumber: 590,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-black font-medium",
                            children: "Checkout"
                        }, void 0, false, {
                            fileName: "[project]/app/(public)/checkout/page.tsx",
                            lineNumber: 591,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(public)/checkout/page.tsx",
                    lineNumber: 586,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "mb-8 text-3xl font-bold text-black",
                    children: "Checkout"
                }, void 0, false, {
                    fileName: "[project]/app/(public)/checkout/page.tsx",
                    lineNumber: 594,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-8 lg:flex-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 space-y-6",
                            children: [
                                !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-sm border border-blue-200 bg-blue-50 p-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "mb-2 font-bold text-black",
                                                        children: "Already have an account?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                        lineNumber: 605,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600",
                                                        children: "Login to use saved addresses and faster checkout"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                        lineNumber: 606,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                lineNumber: 604,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/login?redirect=/checkout",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "rounded-sm bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors",
                                                    children: "Login"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                    lineNumber: 611,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                lineNumber: 610,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                        lineNumber: 603,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                    lineNumber: 602,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-sm border border-gray-100 bg-white p-6 shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "mb-6 text-xl font-bold text-black",
                                            children: user ? 'Shipping Information' : 'Contact & Shipping Information'
                                        }, void 0, false, {
                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                            lineNumber: 621,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-6",
                                            children: [
                                                user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "font-medium text-black",
                                                                    children: "Select Shipping Address"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 630,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setShowAddressForm(!showAddressForm),
                                                                    className: "inline-flex items-center px-3 py-2 text-sm font-medium text-[#00072D] bg-white border border-[#00072D] rounded-md hover:bg-[#00072D] hover:text-white transition-colors",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                            className: "w-4 h-4 mr-2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 635,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        "Add New Address"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 631,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 629,
                                                            columnNumber: 21
                                                        }, this),
                                                        addresses.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: addresses.map((address)=>{
                                                                const typeConfig = addressTypeConfig[address.address_type];
                                                                const TypeIcon = typeConfig?.icon || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"];
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: `flex cursor-pointer items-start p-4 border-2 rounded-lg transition-all ${selectedAddressId === address.id ? 'border-[#00072D] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "address",
                                                                            value: address.id,
                                                                            checked: selectedAddressId === address.id,
                                                                            onChange: ()=>setSelectedAddressId(address.id),
                                                                            className: "mt-1 h-4 w-4 text-[#00072D] focus:ring-[#00072D] border-gray-300"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 656,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "ml-3 flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center space-x-2 mb-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: `p-1 rounded ${typeConfig?.color || 'text-gray-600 bg-gray-50'}`,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypeIcon, {
                                                                                                className: "h-4 w-4"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                lineNumber: 667,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 666,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-medium text-black",
                                                                                            children: typeConfig?.label || 'Address'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 669,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        address.is_default && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
                                                                                            children: "Default"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 673,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 665,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-sm text-gray-600 space-y-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: address.address_line_1
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 679,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        address.address_line_2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: address.address_line_2
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 680,
                                                                                            columnNumber: 62
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: [
                                                                                                address.city,
                                                                                                ", ",
                                                                                                address.state,
                                                                                                " ",
                                                                                                address.zip_code
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 681,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "font-medium",
                                                                                            children: address.contact_no
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 682,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 678,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 664,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, address.id, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 648,
                                                                    columnNumber: 29
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 642,
                                                            columnNumber: 23
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center py-8 bg-gray-50 rounded-lg",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: "mx-auto h-12 w-12 text-gray-400 mb-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 691,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-medium text-gray-900 mb-2",
                                                                    children: "No addresses found"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 692,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-gray-500 mb-4",
                                                                    children: "Add your first address to continue with checkout."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 693,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setShowAddressForm(true),
                                                                    className: "inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                            className: "w-4 h-4 mr-2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 700,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        "Add Address"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 696,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 690,
                                                            columnNumber: 23
                                                        }, this),
                                                        errors.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-red-500",
                                                            children: errors.address
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 707,
                                                            columnNumber: 23
                                                        }, this),
                                                        showAddressForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "border border-gray-200 rounded-lg p-6 bg-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-medium text-black mb-4",
                                                                    children: "Add New Address"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 712,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                                                            children: "Address Line 1 *"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 716,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "text",
                                                                                            value: addressFormData.address_line_1,
                                                                                            onChange: (e)=>handleAddressFormChange('address_line_1', e.target.value),
                                                                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent",
                                                                                            placeholder: "House/Flat No, Street Name",
                                                                                            required: true
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 719,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 715,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                                                            children: "Address Line 2"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 729,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "text",
                                                                                            value: addressFormData.address_line_2,
                                                                                            onChange: (e)=>handleAddressFormChange('address_line_2', e.target.value),
                                                                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent",
                                                                                            placeholder: "Area, Landmark"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 732,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 728,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 714,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                                                            children: "City *"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 744,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "text",
                                                                                            value: addressFormData.city,
                                                                                            onChange: (e)=>handleAddressFormChange('city', e.target.value),
                                                                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent",
                                                                                            required: true
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 747,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 743,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                                                            children: "State *"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 756,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "text",
                                                                                            value: addressFormData.state,
                                                                                            onChange: (e)=>handleAddressFormChange('state', e.target.value),
                                                                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent",
                                                                                            required: true
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 759,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 755,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                                                            children: "ZIP Code *"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 768,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "text",
                                                                                            value: addressFormData.zip_code,
                                                                                            onChange: (e)=>handleAddressFormChange('zip_code', e.target.value),
                                                                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent",
                                                                                            required: true
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 771,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 767,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 742,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                                                    children: "Contact Number *"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 782,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "tel",
                                                                                    value: addressFormData.contact_no,
                                                                                    onChange: (e)=>handleAddressFormChange('contact_no', e.target.value),
                                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent",
                                                                                    required: true
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 785,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 781,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "checkbox",
                                                                                    id: "is_default",
                                                                                    checked: addressFormData.is_default,
                                                                                    onChange: (e)=>handleAddressFormChange('is_default', e.target.checked),
                                                                                    className: "h-4 w-4 text-[#00072D] focus:ring-[#00072D] border-gray-300 rounded"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 795,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    htmlFor: "is_default",
                                                                                    className: "ml-2 block text-sm text-gray-900",
                                                                                    children: "Set as default address"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 802,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 794,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center space-x-3 pt-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: handleCreateAddress,
                                                                                    disabled: createAddressMutation.isPending,
                                                                                    className: "inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors disabled:opacity-50",
                                                                                    children: [
                                                                                        createAddressMutation.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                            className: "w-4 h-4 mr-2 animate-spin"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 814,
                                                                                            columnNumber: 33
                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                            className: "w-4 h-4 mr-2"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 816,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        "Save Address"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 808,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: ()=>setShowAddressForm(false),
                                                                                    className: "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors",
                                                                                    children: "Cancel"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 820,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 807,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 713,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 711,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                    lineNumber: 628,
                                                    columnNumber: 19
                                                }, this),
                                                !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-sm bg-gray-50 p-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "mb-4 font-medium text-black",
                                                                    children: "Contact Information"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 836,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "text-sm font-medium text-gray-700",
                                                                                    children: [
                                                                                        "Full Name ",
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-red-500",
                                                                                            children: "*"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 840,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 839,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    name: "fullName",
                                                                                    placeholder: "Enter your full name",
                                                                                    value: guestData.fullName,
                                                                                    onChange: (e)=>handleInputChange('fullName', e.target.value),
                                                                                    className: `w-full rounded-sm border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 842,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                errors.fullName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-red-500",
                                                                                    children: errors.fullName
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 850,
                                                                                    columnNumber: 47
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 838,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "text-sm font-medium text-gray-700",
                                                                                    children: [
                                                                                        "Email Address ",
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-red-500",
                                                                                            children: "*"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 855,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 854,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex gap-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "email",
                                                                                            name: "email",
                                                                                            placeholder: "your.email@example.com",
                                                                                            value: guestData.email,
                                                                                            onChange: (e)=>handleInputChange('email', e.target.value),
                                                                                            disabled: emailVerified,
                                                                                            className: `flex-1 rounded-sm border ${errors.email ? 'border-red-500' : emailVerified ? 'border-green-500 bg-green-50' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors disabled:opacity-70`
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 858,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        !emailVerified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: handleSendOtp,
                                                                                            disabled: sendingOtp || !guestData.email || !isValidEmail(guestData.email) || otpTimer > 0,
                                                                                            className: "px-4 py-2.5 bg-[#0B3B2D] text-white text-sm font-medium rounded-sm hover:bg-[#0B3B2D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2",
                                                                                            children: sendingOtp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                                        className: "h-4 w-4 animate-spin"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                        lineNumber: 876,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    "Sending..."
                                                                                                ]
                                                                                            }, void 0, true) : otpTimer > 0 ? `Resend (${Math.floor(otpTimer / 60)}:${(otpTimer % 60).toString().padStart(2, '0')})` : otpSent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                                                        className: "h-4 w-4"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                        lineNumber: 883,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    "Resend Code"
                                                                                                ]
                                                                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                                                        className: "h-4 w-4"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                        lineNumber: 888,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    "Verify Email"
                                                                                                ]
                                                                                            }, void 0, true)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 868,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        emailVerified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "px-4 py-2.5 bg-green-100 text-green-700 text-sm font-medium rounded-sm flex items-center gap-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                                                    className: "h-4 w-4"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 896,
                                                                                                    columnNumber: 33
                                                                                                }, this),
                                                                                                "Verified"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 895,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 857,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-red-500",
                                                                                    children: errors.email
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 901,
                                                                                    columnNumber: 44
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `mt-4 p-4 border rounded-sm space-y-4 transition-all ${!otpSent ? 'hidden' : emailVerified ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-start gap-2",
                                                                                            children: [
                                                                                                emailVerified ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                                                    className: "h-5 w-5 text-green-600 mt-0.5"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 911,
                                                                                                    columnNumber: 33
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                                                    className: "h-5 w-5 text-blue-600 mt-0.5"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 913,
                                                                                                    columnNumber: 33
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex-1",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                                            className: `font-medium mb-1 ${emailVerified ? 'text-green-900' : 'text-blue-900'}`,
                                                                                                            children: emailVerified ? 'Email Verified Successfully!' : 'Verify Your Email'
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 916,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                            className: `text-sm ${emailVerified ? 'text-green-700' : 'text-blue-700'}`,
                                                                                                            children: emailVerified ? `Your email ${guestData.email} has been verified and you can now proceed with checkout.` : `We've sent a 6-digit verification code to ${guestData.email}`
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 921,
                                                                                                            columnNumber: 33
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 915,
                                                                                                    columnNumber: 31
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 909,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: `space-y-3 ${emailVerified ? 'hidden' : 'block'}`,
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                                            className: "block text-sm font-medium text-gray-700 mb-2 text-center",
                                                                                                            children: "Enter Verification Code"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 934,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$components$2f$OtpInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                                            length: 6,
                                                                                                            value: otp,
                                                                                                            onChange: handleOtpChange,
                                                                                                            disabled: verifyingOtp
                                                                                                        }, "checkout-otp", false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 937,
                                                                                                            columnNumber: 33
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 933,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                    type: "button",
                                                                                                    onClick: handleVerifyOtp,
                                                                                                    disabled: verifyingOtp || otp.length !== 6,
                                                                                                    className: "w-full px-4 py-2.5 bg-[#0B3B2D] text-white text-sm font-medium rounded-sm hover:bg-[#0B3B2D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                                                                                                    children: verifyingOtp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                                                className: "h-4 w-4 animate-spin"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                                lineNumber: 954,
                                                                                                                columnNumber: 37
                                                                                                            }, this),
                                                                                                            "Verifying..."
                                                                                                        ]
                                                                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                                                                className: "h-4 w-4"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                                lineNumber: 959,
                                                                                                                columnNumber: 37
                                                                                                            }, this),
                                                                                                            "Verify Code"
                                                                                                        ]
                                                                                                    }, void 0, true)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 946,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "text-center",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                        className: "text-xs text-gray-600",
                                                                                                        children: otpTimer > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                            children: [
                                                                                                                "Code expires in ",
                                                                                                                Math.floor(otpTimer / 60),
                                                                                                                ":",
                                                                                                                (otpTimer % 60).toString().padStart(2, '0')
                                                                                                            ]
                                                                                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                            children: [
                                                                                                                "Code expired. ",
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                                    type: "button",
                                                                                                                    onClick: handleSendOtp,
                                                                                                                    className: "text-[#0B3B2D] font-medium hover:underline",
                                                                                                                    children: "Resend code"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                                    lineNumber: 970,
                                                                                                                    columnNumber: 53
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                        lineNumber: 966,
                                                                                                        columnNumber: 33
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 965,
                                                                                                    columnNumber: 31
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 932,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 904,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 853,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "text-sm font-medium text-gray-700",
                                                                                    children: [
                                                                                        "Phone Number ",
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-red-500",
                                                                                            children: "*"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 980,
                                                                                            columnNumber: 42
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 979,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "tel",
                                                                                    name: "phone",
                                                                                    placeholder: "+880 1XXX-XXXXXX",
                                                                                    value: guestData.phone,
                                                                                    onChange: (e)=>handleInputChange('phone', e.target.value),
                                                                                    className: `w-full rounded-sm border ${errors.phone ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 982,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                errors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-red-500",
                                                                                    children: errors.phone
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 990,
                                                                                    columnNumber: 44
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 978,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 837,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 835,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-sm bg-gray-50 p-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-4 flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            id: "createAccount",
                                                                            checked: guestData.createAccount,
                                                                            onChange: (e)=>handleInputChange('createAccount', e.target.checked),
                                                                            className: "h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 998,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            htmlFor: "createAccount",
                                                                            className: "font-medium text-black cursor-pointer",
                                                                            children: "Create an account for faster checkout next time"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1005,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 997,
                                                                    columnNumber: 23
                                                                }, this),
                                                                guestData.createAccount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-4 border-t border-gray-200 pt-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-gray-600",
                                                                            children: "Your account will be created after successful payment"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1012,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "text-sm font-medium text-gray-700",
                                                                                    children: [
                                                                                        "Password ",
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-red-500",
                                                                                            children: "*"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1017,
                                                                                            columnNumber: 40
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1016,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "relative",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: showPassword ? "text" : "password",
                                                                                            name: "password",
                                                                                            placeholder: "Enter password (max 8 characters)",
                                                                                            value: guestData.password,
                                                                                            onChange: (e)=>handleInputChange('password', e.target.value),
                                                                                            className: `w-full rounded-sm border ${errors.password ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 pr-10 outline-none focus:border-black transition-colors`
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1020,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>setShowPassword(!showPassword),
                                                                                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                                                                                            children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                                                className: "h-4 w-4"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                lineNumber: 1033,
                                                                                                columnNumber: 49
                                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                                className: "h-4 w-4"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                lineNumber: 1033,
                                                                                                columnNumber: 82
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1028,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1019,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                errors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-red-500",
                                                                                    children: errors.password
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1036,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1015,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "text-sm font-medium text-gray-700",
                                                                                    children: [
                                                                                        "Confirm Password ",
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-red-500",
                                                                                            children: "*"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1041,
                                                                                            columnNumber: 48
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1040,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "relative",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: showConfirmPassword ? "text" : "password",
                                                                                            name: "confirmPassword",
                                                                                            placeholder: "Re-enter your password",
                                                                                            value: guestData.confirmPassword,
                                                                                            onChange: (e)=>handleInputChange('confirmPassword', e.target.value),
                                                                                            className: `w-full rounded-sm border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 pr-10 outline-none focus:border-black transition-colors`
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1044,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>setShowConfirmPassword(!showConfirmPassword),
                                                                                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                                                                                            children: showConfirmPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                                                className: "h-4 w-4"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                lineNumber: 1057,
                                                                                                columnNumber: 56
                                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                                className: "h-4 w-4"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                lineNumber: 1057,
                                                                                                columnNumber: 89
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1052,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1043,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                errors.confirmPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-red-500",
                                                                                    children: errors.confirmPassword
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1060,
                                                                                    columnNumber: 56
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1039,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1011,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 996,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-sm bg-gray-50 p-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "mb-4 font-medium text-black",
                                                                    children: "Shipping Address"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1067,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "text-sm font-medium text-gray-700",
                                                                                    children: [
                                                                                        "Street Address ",
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-red-500",
                                                                                            children: "*"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1071,
                                                                                            columnNumber: 44
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1070,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    name: "street",
                                                                                    placeholder: "House/Flat No, Street Name, Area",
                                                                                    value: guestData.street,
                                                                                    onChange: (e)=>handleInputChange('street', e.target.value),
                                                                                    className: `w-full rounded-sm border ${errors.street ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 outline-none focus:border-black transition-colors`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1073,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                errors.street && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-red-500",
                                                                                    children: errors.street
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1081,
                                                                                    columnNumber: 45
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1069,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "space-y-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                            className: "text-sm font-medium text-gray-700",
                                                                                            children: [
                                                                                                "City ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-red-500",
                                                                                                    children: "*"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 1087,
                                                                                                    columnNumber: 36
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1086,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "relative",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                                    name: "city",
                                                                                                    value: guestData.city,
                                                                                                    onChange: (e)=>handleInputChange('city', e.target.value),
                                                                                                    className: `w-full appearance-none rounded-sm border ${errors.city ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-black transition-colors`,
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "",
                                                                                                            children: "Select City"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1096,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Dhaka",
                                                                                                            children: "Dhaka"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1097,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Chittagong",
                                                                                                            children: "Chittagong"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1098,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Sylhet",
                                                                                                            children: "Sylhet"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1099,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Rajshahi",
                                                                                                            children: "Rajshahi"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1100,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Khulna",
                                                                                                            children: "Khulna"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1101,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Barisal",
                                                                                                            children: "Barisal"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1102,
                                                                                                            columnNumber: 33
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 1090,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                    className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 1104,
                                                                                                    columnNumber: 31
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1089,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        errors.city && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs text-red-500",
                                                                                            children: errors.city
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1106,
                                                                                            columnNumber: 45
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1085,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "space-y-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                            className: "text-sm font-medium text-gray-700",
                                                                                            children: [
                                                                                                "District ",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-red-500",
                                                                                                    children: "*"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 1111,
                                                                                                    columnNumber: 40
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1110,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "relative",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                                    name: "district",
                                                                                                    value: guestData.district,
                                                                                                    onChange: (e)=>handleInputChange('district', e.target.value),
                                                                                                    className: `w-full appearance-none rounded-sm border ${errors.district ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-black transition-colors`,
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "",
                                                                                                            children: "Select District"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1120,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Dhaka",
                                                                                                            children: "Dhaka"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1121,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Gazipur",
                                                                                                            children: "Gazipur"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1122,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Narayanganj",
                                                                                                            children: "Narayanganj"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1123,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Tangail",
                                                                                                            children: "Tangail"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1124,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                            value: "Manikganj",
                                                                                                            children: "Manikganj"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                            lineNumber: 1125,
                                                                                                            columnNumber: 33
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 1114,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                    className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                                    lineNumber: 1127,
                                                                                                    columnNumber: 31
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1113,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        errors.district && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs text-red-500",
                                                                                            children: errors.district
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1129,
                                                                                            columnNumber: 49
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1109,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "space-y-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                            className: "text-sm font-medium text-gray-700",
                                                                                            children: "Zip Code"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1133,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "text",
                                                                                            name: "zipCode",
                                                                                            placeholder: "1200",
                                                                                            value: guestData.zipCode,
                                                                                            onChange: (e)=>handleInputChange('zipCode', e.target.value),
                                                                                            className: "w-full rounded-sm border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-black transition-colors"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1136,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1132,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1084,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1068,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 1066,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                            lineNumber: 625,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                    lineNumber: 620,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-sm border border-gray-100 bg-white p-6 shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "mb-6 text-xl font-bold text-black",
                                            children: "Shipping Method"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                            lineNumber: 1154,
                                            columnNumber: 15
                                        }, this),
                                        getShippingMethods.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-center py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "h-6 w-6 animate-spin text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                    lineNumber: 1158,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 text-sm text-gray-500",
                                                    children: "Loading shipping options..."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                    lineNumber: 1159,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                            lineNumber: 1157,
                                            columnNumber: 17
                                        }, this) : shippingMethods.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-sm bg-gray-50 p-4 text-center text-sm text-gray-500",
                                            children: "No shipping methods available"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                            lineNumber: 1162,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: shippingMethods.map((method)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: `flex cursor-pointer items-start justify-between rounded-sm border-2 p-4 transition-all ${selectedShipping === method.code ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-3 flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative flex items-center justify-center mt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "radio",
                                                                        name: "shipping",
                                                                        value: method.code,
                                                                        className: "peer h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:border-black checked:bg-black",
                                                                        checked: selectedShipping === method.code,
                                                                        onChange: ()=>setSelectedShipping(method.code)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                        lineNumber: 1178,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                        lineNumber: 1186,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1177,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-start justify-between gap-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-2 font-medium text-black",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                                                                            className: "h-5 w-5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1192,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        method.name
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1191,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-gray-600 mt-1",
                                                                                    children: method.description
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1195,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-gray-500 mt-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-medium",
                                                                                            children: "Delivery:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1197,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        " ",
                                                                                        method.delivery_time
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1196,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                method.free_shipping_min_order > 0 && !method.is_free && subTotal < method.free_shipping_min_order && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded",
                                                                                    children: [
                                                                                        "Add $",
                                                                                        (method.free_shipping_min_order - subTotal).toFixed(2),
                                                                                        " more for free shipping"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1200,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1190,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-right",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `text-lg font-bold ${method.is_free ? 'text-green-600' : 'text-black'}`,
                                                                                    children: method.is_free ? 'FREE' : `$${method.cost.toFixed(2)}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1206,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                selectedShipping === method.code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "mt-1 inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-xs font-bold text-white",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                            className: "h-3 w-3"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                            lineNumber: 1211,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        "Selected"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1210,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1205,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1189,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1188,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                        lineNumber: 1176,
                                                        columnNumber: 23
                                                    }, this)
                                                }, method.code, false, {
                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                    lineNumber: 1168,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                            lineNumber: 1166,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                    lineNumber: 1153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-sm border border-gray-100 bg-white p-6 shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "mb-6 text-xl font-bold text-black",
                                            children: "Payment Method"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                            lineNumber: 1227,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: `flex cursor-pointer items-start justify-between rounded-sm border-2 p-4 transition-all ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-3 flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative flex items-center justify-center mt-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "payment",
                                                                            value: "cod",
                                                                            className: "peer h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:border-black checked:bg-black",
                                                                            checked: paymentMethod === 'cod',
                                                                            onChange: ()=>setPaymentMethod('cod')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1238,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1246,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1237,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 font-medium text-black",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                                                    className: "h-5 w-5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1250,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                "Cash on Delivery"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1249,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-gray-600 mt-1",
                                                                            children: "Pay with cash when your order is delivered to your doorstep"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1253,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1248,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 1236,
                                                            columnNumber: 19
                                                        }, this),
                                                        paymentMethod === 'cod' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1 inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-xs font-bold text-white",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                    className: "h-3 w-3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1260,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Selected"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 1259,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                    lineNumber: 1231,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: `flex cursor-pointer items-start justify-between rounded-sm border-2 p-4 transition-all ${paymentMethod === 'ssl' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-3 flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative flex items-center justify-center mt-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "payment",
                                                                            value: "ssl",
                                                                            className: "peer h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:border-black checked:bg-black",
                                                                            checked: paymentMethod === 'ssl',
                                                                            onChange: ()=>setPaymentMethod('ssl')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1274,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1282,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1273,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 font-medium text-black",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                                                    className: "h-5 w-5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1286,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                "Online Payment (SSL Commerce)"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1285,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-gray-600 mt-1",
                                                                            children: "Pay securely with credit/debit card, mobile banking, or internet banking"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1289,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 mt-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs bg-green-100 text-green-800 px-2 py-1 rounded",
                                                                                    children: "Secure"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1293,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded",
                                                                                    children: "Instant"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                    lineNumber: 1294,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                            lineNumber: 1292,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1284,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 1272,
                                                            columnNumber: 19
                                                        }, this),
                                                        paymentMethod === 'ssl' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1 inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-xs font-bold text-white",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                    className: "h-3 w-3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1300,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Selected"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 1299,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                    lineNumber: 1267,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                            lineNumber: 1229,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                    lineNumber: 1226,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(public)/checkout/page.tsx",
                            lineNumber: 598,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:w-96",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sticky top-8 space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-sm border border-gray-100 bg-white p-6 shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "mb-6 text-xl font-bold text-black",
                                                children: "Order Summary"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                lineNumber: 1314,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4 mb-6",
                                                children: items.map((item, index)=>{
                                                    const price = item.variation ? parseFloat(item.variation.price) : parseFloat(item.product?.price || '0');
                                                    const itemTotal = price * item.quantity;
                                                    // Get image URL - handle both API format (images array) and product card format (image string)
                                                    let imageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$image$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPlaceholderImage"])(item.product?.name || 'Product');
                                                    if (item.product?.images && item.product.images.length > 0) {
                                                        imageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$image$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrimaryImageUrl"])(item.product.images) || imageUrl;
                                                    } else if (item.product?.image) {
                                                        imageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$image$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(item.product.image) || item.product.image;
                                                    }
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-gray-100",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: imageUrl,
                                                                    alt: item.product?.name || 'Product',
                                                                    className: "h-full w-full object-cover",
                                                                    onError: (e)=>{
                                                                        e.currentTarget.src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$image$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPlaceholderImage"])(item.product?.name || 'Product');
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                    lineNumber: 1333,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1332,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-sm font-medium text-black line-clamp-2",
                                                                        children: item.product?.name || 'Unknown Product'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                        lineNumber: 1343,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-gray-500 mt-1",
                                                                        children: [
                                                                            item.variation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: item.variation.attribute_values?.map((attr)=>`${attr.attribute_name}: ${attr.value}`).join(', ')
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                lineNumber: 1348,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            item.product?.country_of_origin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "ml-1 text-black font-bold",
                                                                                children: [
                                                                                    "Origin: ",
                                                                                    item.product.country_of_origin
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                lineNumber: 1355,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                        lineNumber: 1346,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between mt-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm text-gray-600",
                                                                                children: [
                                                                                    "$",
                                                                                    price.toFixed(2),
                                                                                    " × ",
                                                                                    item.quantity
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                lineNumber: 1361,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm font-bold text-black",
                                                                                children: [
                                                                                    "$",
                                                                                    itemTotal.toFixed(2)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                                lineNumber: 1364,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                        lineNumber: 1360,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1342,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, `${item.product_id}-${item.variation_id || 'no-variation'}-${index}`, true, {
                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                        lineNumber: 1331,
                                                        columnNumber: 23
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                lineNumber: 1317,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 border-t border-gray-200 pt-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-600",
                                                                children: [
                                                                    "Subtotal (",
                                                                    totalItems,
                                                                    " items)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1377,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-black",
                                                                children: [
                                                                    "$",
                                                                    subTotal.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1378,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                        lineNumber: 1376,
                                                        columnNumber: 19
                                                    }, this),
                                                    appliedCoupon && discount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-600",
                                                                        children: "Discount"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                        lineNumber: 1384,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800",
                                                                        children: appliedCoupon.code
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                        lineNumber: 1385,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1383,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-green-600",
                                                                children: [
                                                                    "-$",
                                                                    discount.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1389,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                        lineNumber: 1382,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-600",
                                                                children: "Shipping"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1394,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-black",
                                                                children: selectedShippingMethod?.is_free ? 'FREE' : `$${shipping.toFixed(2)}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1395,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                        lineNumber: 1393,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between border-t border-gray-200 pt-3 text-lg font-bold",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-black",
                                                                children: "Total"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1401,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-black",
                                                                children: [
                                                                    "$",
                                                                    totalPrice.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                                lineNumber: 1402,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                                        lineNumber: 1400,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                lineNumber: 1375,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleCheckout,
                                                disabled: isProcessing || items.length === 0,
                                                className: "mt-6 w-full rounded-sm bg-black px-6 py-3 text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                                                children: isProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                            className: "h-5 w-5 animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 1414,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Processing..."
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                                            className: "h-5 w-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(public)/checkout/page.tsx",
                                                            lineNumber: 1419,
                                                            columnNumber: 23
                                                        }, this),
                                                        paymentMethod === 'ssl' ? 'Pay Now' : 'Place Order'
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                lineNumber: 1407,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 rounded-sm bg-gray-50 p-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-600 text-center",
                                                    children: "🔒 Your payment information is secure and encrypted"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(public)/checkout/page.tsx",
                                                    lineNumber: 1427,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                lineNumber: 1426,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                        lineNumber: 1313,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-sm border border-gray-100 bg-white p-4 shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-medium text-black mb-2",
                                                children: "Return Policy"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                lineNumber: 1435,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-600",
                                                children: "30-day return policy. Items must be in original condition with tags attached."
                                            }, void 0, false, {
                                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                                lineNumber: 1436,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(public)/checkout/page.tsx",
                                        lineNumber: 1434,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(public)/checkout/page.tsx",
                                lineNumber: 1311,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(public)/checkout/page.tsx",
                            lineNumber: 1310,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(public)/checkout/page.tsx",
                    lineNumber: 596,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(public)/checkout/page.tsx",
            lineNumber: 584,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(public)/checkout/page.tsx",
        lineNumber: 583,
        columnNumber: 5
    }, this);
}
_s(CheckoutPage, "jfgvm+nhlYv8W2wZrFAgfFgftis=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useAddresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddresses"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useAddresses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateAddress"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useCheckout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProcessCheckout"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useCheckout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetShippingMethods"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$user$2f$useCheckout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSendRegistrationOtp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hooks$2f$useAnalytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalytics"]
    ];
});
_c = CheckoutPage;
var _c;
__turbopack_context__.k.register(_c, "CheckoutPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_c621d529._.js.map