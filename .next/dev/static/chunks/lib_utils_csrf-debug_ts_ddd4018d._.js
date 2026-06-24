(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils/csrf-debug.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * CSRF Token Debugging Utility
 * Use this to diagnose CSRF token issues
 */ __turbopack_context__.s([
    "debugCSRFToken",
    ()=>debugCSRFToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function debugCSRFToken() {
    if (typeof document === 'undefined') {
        console.log('Running on server side - no cookies available');
        return;
    }
    console.group('🔍 CSRF Token Debug Info');
    // Get all cookies
    const allCookies = document.cookie;
    console.log('All Cookies:', allCookies || 'No cookies found');
    // Get XSRF-TOKEN specifically
    const xsrfToken = getCookie('XSRF-TOKEN');
    console.log('XSRF-TOKEN:', xsrfToken || 'Not found');
    if (xsrfToken) {
        console.log('XSRF-TOKEN (decoded):', decodeURIComponent(xsrfToken));
        console.log('XSRF-TOKEN length:', xsrfToken.length);
    }
    // Check Laravel session cookie
    const laravelSession = getCookie('laravel_session');
    console.log('Laravel Session:', laravelSession ? 'Present' : 'Not found');
    // Check API URL
    console.log('API URL:', ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000');
    // Check current domain
    console.log('Current Domain:', window.location.hostname);
    console.log('Current Protocol:', window.location.protocol);
    console.groupEnd();
}
function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}
// Auto-run on import in development
if ("TURBOPACK compile-time truthy", 1) {
    // Run after a short delay to ensure cookies are loaded
    setTimeout(()=>{
        console.log('📌 CSRF Debug utility loaded. Call debugCSRFToken() to see token info.');
    }, 1000);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_utils_csrf-debug_ts_ddd4018d._.js.map