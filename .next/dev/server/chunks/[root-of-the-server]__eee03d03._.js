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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/admin/hero-sections/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
const CONTENT_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public/content/landing-page.json");
// Ensure directory exists
function ensureDirectoryExists() {
    const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(CONTENT_FILE);
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dir)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(dir, {
            recursive: true
        });
    }
}
// Get default data if file doesn't exist
function getDefaultData() {
    return {
        sections: [
            {
                id: "main",
                position: "main",
                title: "Elevate Your\nFitness Journey",
                buttonText: "Shop Now",
                buttonUrl: "/shop",
                image: "/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png",
                discountBadge: {
                    enabled: true,
                    text: "Up to",
                    percentage: "40%"
                }
            },
            {
                id: "topRight",
                position: "topRight",
                title: "Perfect Gear\nAwaits",
                buttonText: "Shop Now",
                buttonUrl: "/shop",
                image: "/images/landing/hero-section/d7c609f1a7f9028a48f85f6b588e7ae4e6803c45.png"
            },
            {
                id: "bottomRight",
                position: "bottomRight",
                title: "Shine Bright with\nWeights",
                buttonText: "Shop Now",
                buttonUrl: "/shop",
                image: "/images/landing/hero-section/efc3fc0e7c591b4a8aaa86acf5dae5a7e6ef5118.png"
            },
            {
                id: "tallRight",
                position: "tallRight",
                title: "TOP\nPICKS",
                buttonText: "Shop Now",
                buttonUrl: "/shop",
                image: "/images/landing/hero-section/e2e807f93cc803b571ae315331b10d75e097223b.png"
            }
        ],
        preOrderSection: {
            id: "preorder",
            enabled: true,
            sectionTitle: "Pre-Order Now & Save Big",
            viewAllText: "View All Preorder Products",
            viewAllUrl: "/pre-order",
            mainFeature: {
                image: "/images/landing/pre-order/c7b139cd4aecc159bde32e9387c0dcb372021ab9.png",
                title: "Nordictrack T Series\n10 Treadmill",
                buttonText: "Preorder Now",
                buttonUrl: "/pre-order",
                saveBadge: {
                    enabled: true,
                    text: "Save",
                    percentage: "30%"
                }
            },
            gridImages: [
                {
                    id: "grid1",
                    image: "/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png",
                    alt: "Fitness Equipment 1"
                },
                {
                    id: "grid2",
                    image: "/images/landing/pre-order/63594412e77df42c02a5f16d3a2eceb8d4f91d99.png",
                    alt: "Fitness Equipment 2"
                },
                {
                    id: "grid3",
                    image: "/images/landing/pre-order/a1d135ac0387f5fbbc33cdd695d09e992dc2d274.png",
                    alt: "Fitness Equipment 3"
                },
                {
                    id: "grid4",
                    image: "/images/landing/pre-order/a9bf5425dbad371e93771b044cfeaccd4402283d.png",
                    alt: "Fitness Equipment 4"
                }
            ]
        },
        promoCardsSection: {
            id: "promo-cards",
            enabled: true,
            cards: [
                {
                    id: "cardio",
                    title: "Cardio Equipment's",
                    description: "Burn calories and boost endurance with our premium cardio machines",
                    buttonText: "Shop Now",
                    buttonUrl: "/shop/cardio",
                    image: "/images/landing/discounts/a50664626eecf2cf40632e0dbb9e6575a1f03777.jpg",
                    badge: {
                        enabled: true,
                        text: "Sale off",
                        percentage: "45%"
                    }
                },
                {
                    id: "free-weight",
                    title: "Free Weight Equipment's",
                    description: "Burn calories and boost endurance with our premium cardio machines",
                    buttonText: "Shop Now",
                    buttonUrl: "/shop/free-weights",
                    image: "/images/landing/discounts/90712f9864d66ccaf16d572f3692189ac2991659.jpg",
                    badge: {
                        enabled: true,
                        text: "Up to",
                        percentage: "30%"
                    }
                }
            ]
        }
    };
}
async function GET(request) {
    try {
        ensureDirectoryExists();
        // If file doesn't exist, create it with default data
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(CONTENT_FILE)) {
            const defaultData = getDefaultData();
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(CONTENT_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(defaultData);
        }
        // Read existing file
        const fileContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(CONTENT_FILE, "utf-8");
        const data = JSON.parse(fileContent);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (error) {
        console.error("Error fetching hero sections:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        ensureDirectoryExists();
        const body = await request.json();
        // Save to file
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(CONTENT_FILE, JSON.stringify(body, null, 2), "utf-8");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Landing page sections saved successfully!",
            data: body
        });
    } catch (error) {
        console.error("Error saving hero sections:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__eee03d03._.js.map