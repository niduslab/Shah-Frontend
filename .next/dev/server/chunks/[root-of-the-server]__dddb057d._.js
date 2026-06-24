module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/admin/analytics/visitors/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Mock visitor sessions data
function getMockVisitors(page = 1, limit = 20) {
    const visitors = [];
    const startId = (page - 1) * limit;
    for(let i = 0; i < limit; i++){
        const id = startId + i + 1;
        visitors.push({
            id: `visitor_${id}`,
            session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
            ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            device_type: [
                "mobile",
                "desktop",
                "tablet"
            ][Math.floor(Math.random() * 3)],
            browser: [
                "Chrome",
                "Firefox",
                "Safari",
                "Edge"
            ][Math.floor(Math.random() * 4)],
            os: [
                "Windows",
                "macOS",
                "iOS",
                "Android"
            ][Math.floor(Math.random() * 4)],
            country: [
                "US",
                "UK",
                "CA",
                "AU",
                "DE"
            ][Math.floor(Math.random() * 5)],
            city: [
                "New York",
                "London",
                "Toronto",
                "Sydney",
                "Berlin"
            ][Math.floor(Math.random() * 5)],
            referrer: [
                "google.com",
                "facebook.com",
                "direct",
                "instagram.com"
            ][Math.floor(Math.random() * 4)],
            landing_page: [
                "/",
                "/shop",
                "/products",
                "/about"
            ][Math.floor(Math.random() * 4)],
            pages_viewed: Math.floor(Math.random() * 10) + 1,
            session_duration: Math.floor(Math.random() * 600) + 30,
            is_returning: Math.random() > 0.6,
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            last_activity: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString()
        });
    }
    return visitors;
}
async function GET(request) {
    try {
        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const device = searchParams.get("device");
        const days = parseInt(searchParams.get("days") || "7");
        // TODO: Replace with actual database queries
        // For now, return mock data
        let visitors = getMockVisitors(page, limit);
        // Filter by device if specified
        if (device) {
            visitors = visitors.filter((v)=>v.device_type === device);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: visitors,
            pagination: {
                page,
                limit,
                total: 5234,
                pages: Math.ceil(5234 / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching visitors:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dddb057d._.js.map