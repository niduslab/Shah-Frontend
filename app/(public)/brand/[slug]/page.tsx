import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DynamicHeroSection } from "@/app/(public)/_components/brand/DynamicHeroSection";
import { DynamicCategoriesSection } from "@/app/(public)/_components/brand/DynamicCategoriesSection";
import { DynamicBehindTheWorkSection } from "@/app/(public)/_components/brand/DynamicBehindTheWorkSection";
import { DynamicShopBySection } from "@/app/(public)/_components/brand/DynamicShopBySection";
import { DynamicPromoBanner } from "@/app/(public)/_components/brand/DynamicPromoBanner";
import { DynamicFeatureSection } from "@/app/(public)/_components/brand/DynamicFeatureSection";
import { DynamicWhyChooseSection } from "@/app/(public)/_components/brand/DynamicWhyChooseSection";
import { DynamicProductsSection } from "@/app/(public)/_components/brand/DynamicProductsSection";

import { API_ORIGIN } from '@/lib/config/api';
interface BrandPageContent {
  hero: {
    enabled: boolean;
    backgroundImage: string;
    title: string;
    highlightedText: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
  categories: {
    enabled: boolean;
    sectionTitle: string;
    items: Array<{
      id: string;
      name: string;
      image: string;
      href: string;
    }>;
  };
  behindTheWork: {
    enabled: boolean;
    title: string;
    description: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
    images: {
      left: string;
      center: string;
      right: string;
    };
  };
  shopBy: {
    enabled: boolean;
    cards: Array<{
      id: string;
      image: string;
      title: string;
      buttonText: string;
      buttonUrl: string;
      badge?: {
        enabled: boolean;
        value: string;
        label: string;
      };
    }>;
  };
  promoBanner?: {
    enabled: boolean;
    badge: string;
    title: string;
    highlightedText: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    backgroundColor: string;
    textColor: string;
  };
  featureSection1?: {
    enabled: boolean;
    layout: "image-left" | "image-right";
    image: string;
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    backgroundColor: string;
  };
  featureSection2?: {
    enabled: boolean;
    layout: "image-left" | "image-right";
    image: string;
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    backgroundColor: string;
  };
}

interface BrandData {
  id: number;
  name: string;
  slug: string;
  logo: string;
  is_active: boolean;
}

async function getBrandBySlug(slug: string): Promise<BrandData | null> {
  try {
    const apiUrl = API_ORIGIN;
    console.log(`[Brand Page] Fetching brands from: ${apiUrl}/api/catalog/brands`);
    console.log(`[Brand Page] Looking for slug: ${slug}`);
    
    const response = await fetch(`${apiUrl}/api/catalog/brands`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      console.error(`[Brand Page] API response not OK: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`[Brand Page] Received ${data.data?.length || 0} brands from API`);
    
    const brands = data.data || [];
    const brand = brands.find((b: BrandData) => b.slug === slug);
    
    if (brand) {
      console.log(`[Brand Page] Found brand:`, brand);
    } else {
      console.log(`[Brand Page] Brand not found with slug: ${slug}`);
      console.log(`[Brand Page] Available slugs:`, brands.map((b: BrandData) => b.slug));
    }
    
    return brand || null;
  } catch (error) {
    console.error("[Brand Page] Error fetching brand:", error);
    return null;
  }
}

async function getBrandPageContent(
  brandId: number
): Promise<BrandPageContent | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/brand-pages/${brandId}`,
      {
        cache: 'no-store', // Always fetch fresh content
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    console.log(`[Brand Page] Content loaded for brand ${brandId}:`, data.content ? 'Found' : 'Not found');
    return data.content || null;
  } catch (error) {
    console.error("Error fetching brand page content:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return {
      title: "Brand Not Found",
    };
  }

  return {
    title: `${brand.name} - Home Fitness Equipment`,
    description: `Explore ${brand.name}'s innovative fitness equipment and solutions.`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const content = await getBrandPageContent(brand.id);

  // If no content found, show a default page
  if (!content) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">{brand.name}</h1>
            <p className="mt-4 text-gray-600">
              Brand page content is being prepared. Please check back soon.
            </p>
          </div>
        </div>
        {/* Still show products even if no custom content */}
        <DynamicProductsSection brandId={brand.id} brandName={brand.name} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      {content.hero?.enabled && (
        <DynamicHeroSection data={content.hero} />
      )}

      {/* Categories Section */}
      {content.categories?.enabled && (
        <DynamicCategoriesSection data={content.categories} />
      )}

      {/* Behind The Work Section */}
      {content.behindTheWork?.enabled && (
        <DynamicBehindTheWorkSection data={content.behindTheWork} />
      )}

      {/* Products Section */}
      <DynamicProductsSection brandId={brand.id} brandName={brand.name} />

      {/* Shop By Section */}
      {content.shopBy?.enabled && (
        <DynamicShopBySection data={content.shopBy} />
      )}

      {/* Promo Banner */}
      {content.promoBanner?.enabled && (
        <DynamicPromoBanner data={content.promoBanner} />
      )}

      {/* Feature Sections */}
      <section className="w-full bg-[#FFFBF0] flex justify-center">
        <div className="bg-[#FFFBF0]">
          {/* Feature Section 1 */}
          {content.featureSection1?.enabled && (
            <DynamicFeatureSection data={content.featureSection1} />
          )}

          {/* Feature Section 2 */}
          {content.featureSection2?.enabled && (
            <DynamicFeatureSection data={content.featureSection2} />
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <DynamicWhyChooseSection brandName={brand.name} />

      
    </main>
  );
}
