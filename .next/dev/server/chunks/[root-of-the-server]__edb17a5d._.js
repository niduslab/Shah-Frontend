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
"[project]/lib/utils/pagination.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPaginatedResponse",
    ()=>createPaginatedResponse,
    "normalizePaginatedResponse",
    ()=>normalizePaginatedResponse
]);
const createPaginatedResponse = (data, page, perPage, total)=>{
    const lastPage = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, total);
    return {
        success: true,
        data,
        pagination: {
            total,
            per_page: perPage,
            current_page: page,
            last_page: lastPage,
            from: startIndex + 1,
            to: endIndex
        }
    };
};
const normalizePaginatedResponse = (response)=>{
    // If already in correct format, return as-is
    if (response.success && response.pagination) {
        return response;
    }
    // If it's Laravel-style pagination (has meta key), convert it
    if (response.meta) {
        return {
            success: true,
            data: response.data,
            pagination: response.meta
        };
    }
    // Fallback: assume it's just data array
    return {
        success: true,
        data: response.data || response,
        pagination: {
            total: (response.data || response).length,
            per_page: (response.data || response).length,
            current_page: 1,
            last_page: 1,
            from: 1,
            to: (response.data || response).length
        }
    };
};
}),
"[project]/app/api/catalog/brands/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$pagination$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/pagination.ts [app-route] (ecmascript)");
;
;
// Mock brands data - replace with actual database call
const BRANDS_DATA = [
    {
        id: 1,
        name: "NordicTrack",
        slug: "nordictrack",
        description: "Leading fitness equipment manufacturer known for innovative treadmills, ellipticals, and exercise bikes.",
        logo: "/images/all-brands/brand-1 (1).png",
        is_active: true,
        sort_order: 1,
        products_count: 45
    },
    {
        id: 2,
        name: "ProForm",
        slug: "proform",
        description: "Affordable home fitness equipment with professional-grade features.",
        logo: "/images/all-brands/brand-1 (2).png",
        is_active: true,
        sort_order: 2,
        products_count: 32
    },
    {
        id: 3,
        name: "Bowflex",
        slug: "bowflex",
        description: "Revolutionary home gym equipment and adjustable dumbbells.",
        logo: "/images/all-brands/brand-1 (3).png",
        is_active: true,
        sort_order: 3,
        products_count: 28
    },
    {
        id: 4,
        name: "Schwinn",
        slug: "schwinn",
        description: "Classic American bicycle and fitness equipment brand.",
        logo: "/images/all-brands/brand-1 (4).png",
        is_active: true,
        sort_order: 4,
        products_count: 22
    },
    {
        id: 5,
        name: "Nautilus",
        slug: "nautilus",
        description: "Premium strength training and cardio equipment.",
        logo: "/images/all-brands/brand-1 (5).png",
        is_active: true,
        sort_order: 5,
        products_count: 19
    },
    {
        id: 6,
        name: "Life Fitness",
        slug: "life-fitness",
        description: "Commercial-grade fitness equipment for home and gym use.",
        logo: "/images/all-brands/brand-1 (6).png",
        is_active: true,
        sort_order: 6,
        products_count: 38
    },
    {
        id: 7,
        name: "Precor",
        slug: "precor",
        description: "High-quality cardio and strength equipment.",
        logo: "/images/all-brands/brand-1 (7).png",
        is_active: true,
        sort_order: 7,
        products_count: 25
    },
    {
        id: 8,
        name: "Matrix",
        slug: "matrix",
        description: "Advanced fitness technology and equipment.",
        logo: "/images/all-brands/brand-1 (8).png",
        is_active: true,
        sort_order: 8,
        products_count: 31
    },
    {
        id: 9,
        name: "Horizon",
        slug: "horizon",
        description: "Reliable home fitness equipment at great value.",
        logo: "/images/all-brands/brand-1 (9).png",
        is_active: true,
        sort_order: 9,
        products_count: 18
    },
    {
        id: 10,
        name: "Sole",
        slug: "sole",
        description: "Premium treadmills and ellipticals for home use.",
        logo: "/images/all-brands/brand-1 (10).png",
        is_active: true,
        sort_order: 10,
        products_count: 15
    },
    {
        id: 11,
        name: "Spirit",
        slug: "spirit",
        description: "Quality fitness equipment for home and light commercial use.",
        logo: "/images/all-brands/brand-1 (11).png",
        is_active: true,
        sort_order: 11,
        products_count: 21
    },
    {
        id: 12,
        name: "Cybex",
        slug: "cybex",
        description: "Professional strength and cardio equipment.",
        logo: "/images/all-brands/brand-1 (12).png",
        is_active: true,
        sort_order: 12,
        products_count: 27
    },
    {
        id: 13,
        name: "TRX",
        slug: "trx",
        description: "Suspension training and functional fitness equipment.",
        logo: "/images/all-brands/brand-1 (13).png",
        is_active: true,
        sort_order: 13,
        products_count: 12
    },
    {
        id: 14,
        name: "Kettler",
        slug: "kettler",
        description: "German-engineered fitness and outdoor equipment.",
        logo: "/images/all-brands/brand-1 (14).png",
        is_active: true,
        sort_order: 14,
        products_count: 16
    },
    {
        id: 15,
        name: "Concept2",
        slug: "concept2",
        description: "World's leading rowing machine manufacturer.",
        logo: "/images/all-brands/brand-1 (15).png",
        is_active: true,
        sort_order: 15,
        products_count: 8
    },
    {
        id: 16,
        name: "Rogue",
        slug: "rogue",
        description: "Heavy-duty strength training and CrossFit equipment.",
        logo: "/images/all-brands/brand-1 (16).png",
        is_active: true,
        sort_order: 16,
        products_count: 42
    },
    {
        id: 17,
        name: "Rep Fitness",
        slug: "rep-fitness",
        description: "High-quality strength equipment at competitive prices.",
        logo: "/images/all-brands/brand-1 (17).png",
        is_active: true,
        sort_order: 17,
        products_count: 35
    },
    {
        id: 18,
        name: "PowerBlock",
        slug: "powerblock",
        description: "Space-saving adjustable dumbbells and accessories.",
        logo: "/images/all-brands/brand-1 (18).png",
        is_active: true,
        sort_order: 18,
        products_count: 14
    },
    {
        id: 19,
        name: "Marcy",
        slug: "marcy",
        description: "Affordable home gym equipment and accessories.",
        logo: "/images/all-brands/brand-1 (19).png",
        is_active: true,
        sort_order: 19,
        products_count: 29
    },
    {
        id: 20,
        name: "CAP Barbell",
        slug: "cap-barbell",
        description: "Complete line of strength training equipment.",
        logo: "/images/all-brands/brand-1 (20).png",
        is_active: true,
        sort_order: 20,
        products_count: 33
    },
    {
        id: 21,
        name: "Gold's Gym",
        slug: "golds-gym",
        description: "Iconic fitness brand with home equipment line.",
        logo: "/images/all-brands/brand-1 (21).png",
        is_active: true,
        sort_order: 21,
        products_count: 24
    },
    {
        id: 22,
        name: "Weider",
        slug: "weider",
        description: "Classic bodybuilding and fitness equipment brand.",
        logo: "/images/all-brands/brand-1 (22).png",
        is_active: true,
        sort_order: 22,
        products_count: 26
    },
    {
        id: 23,
        name: "Stamina",
        slug: "stamina",
        description: "Innovative fitness equipment for all fitness levels.",
        logo: "/images/all-brands/brand-1 (23).png",
        is_active: true,
        sort_order: 23,
        products_count: 17
    },
    {
        id: 24,
        name: "Body-Solid",
        slug: "body-solid",
        description: "Durable strength training equipment for home and commercial use.",
        logo: "/images/all-brands/brand-1 (24).png",
        is_active: true,
        sort_order: 24,
        products_count: 39
    }
];
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('per_page') || '24');
        const search = searchParams.get('search') || '';
        const active = searchParams.get('active');
        // Filter brands
        let filteredBrands = BRANDS_DATA;
        // Filter by active status
        if (active !== null) {
            const isActive = active === 'true';
            filteredBrands = filteredBrands.filter((brand)=>brand.is_active === isActive);
        }
        // Filter by search
        if (search) {
            filteredBrands = filteredBrands.filter((brand)=>brand.name.toLowerCase().includes(search.toLowerCase()) || brand.description.toLowerCase().includes(search.toLowerCase()));
        }
        // Sort by sort_order
        filteredBrands.sort((a, b)=>a.sort_order - b.sort_order);
        // Pagination
        const total = filteredBrands.length;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedBrands = filteredBrands.slice(startIndex, endIndex);
        const response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$pagination$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createPaginatedResponse"])(paginatedBrands, page, perPage, total);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response, {
            status: 200
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch brands'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__edb17a5d._.js.map