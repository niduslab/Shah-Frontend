import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "public/content/landing-page.json");

// Ensure directory exists
function ensureDirectoryExists() {
  const dir = path.dirname(CONTENT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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
          percentage: "40%",
        },
      },
      {
        id: "topRight",
        position: "topRight",
        title: "Perfect Gear\nAwaits",
        buttonText: "Shop Now",
        buttonUrl: "/shop",
        image: "/images/landing/hero-section/d7c609f1a7f9028a48f85f6b588e7ae4e6803c45.png",
      },
      {
        id: "bottomRight",
        position: "bottomRight",
        title: "Shine Bright with\nWeights",
        buttonText: "Shop Now",
        buttonUrl: "/shop",
        image: "/images/landing/hero-section/efc3fc0e7c591b4a8aaa86acf5dae5a7e6ef5118.png",
      },
      {
        id: "tallRight",
        position: "tallRight",
        title: "TOP\nPICKS",
        buttonText: "Shop Now",
        buttonUrl: "/shop",
        image: "/images/landing/hero-section/e2e807f93cc803b571ae315331b10d75e097223b.png",
      },
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
          percentage: "30%",
        },
      },
      gridImages: [
        { id: "grid1", image: "/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png", alt: "Fitness Equipment 1" },
        { id: "grid2", image: "/images/landing/pre-order/63594412e77df42c02a5f16d3a2eceb8d4f91d99.png", alt: "Fitness Equipment 2" },
        { id: "grid3", image: "/images/landing/pre-order/a1d135ac0387f5fbbc33cdd695d09e992dc2d274.png", alt: "Fitness Equipment 3" },
        { id: "grid4", image: "/images/landing/pre-order/a9bf5425dbad371e93771b044cfeaccd4402283d.png", alt: "Fitness Equipment 4" },
      ],
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
            percentage: "45%",
          },
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
            percentage: "30%",
          },
        },
      ],
    },
    exploreCategoriesSection: {
      id: "explore-categories",
      enabled: true,
      sectionTitle: "Explore Our Categories",
      categories: [
        {
          id: "fitness-cardio",
          name: "Cardio",
          image: "/images/landing/explore-categories/image-1.png",
          href: "/shop?category=fitness-cardio",
        },
        {
          id: "strength",
          name: "Strength",
          image: "/images/landing/explore-categories/image-3.png",
          href: "/shop?category=strength",
        },
        {
          id: "free-weight",
          name: "Free Weight",
          image: "/images/landing/explore-categories/image-4.png",
          href: "/shop?category=free-weight",
        },
        {
          id: "sports",
          name: "Sports",
          image: "/images/landing/explore-categories/image-2.png",
          href: "/shop?category=sports",
        },
      ],
    },
    flashDealSection: {
      id: "flash-deal",
      enabled: true,
      backgroundImage: "/images/landing/flash-deal/flash-deal.png",
      badgeText: "Flash Deal",
      heading: "Grab it before\nit ends.",
      subtext: "Up to 50% off on premium fitness equipment.",
      buttonText: "Shop Now",
      buttonUrl: "/shop?has_flash_deal=true",
      endsAt: "",
      discountBadge: {
        enabled: true,
        text: "Up to",
        percentage: "40%",
      },
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    ensureDirectoryExists();

    // If file doesn't exist, create it with default data
    if (!fs.existsSync(CONTENT_FILE)) {
      const defaultData = getDefaultData();
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
      return NextResponse.json(defaultData);
    }

    // Read existing file
    const fileContent = fs.readFileSync(CONTENT_FILE, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching hero sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDirectoryExists();

    const body = await request.json();

    // Save to file
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Landing page sections saved successfully!",
      data: body,
    });
  } catch (error) {
    console.error("Error saving hero sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
