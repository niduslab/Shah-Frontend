"use client";

import { HeroSection } from "./_components/landing/hero-section";
import { ExploreCategories } from "./_components/landing/explore-categories";
import { PreOrderSection } from "./_components/landing/pre-order-section";
import { PromoCardsSection } from "./_components/landing/promo-cards-section";
import { RdxGallerySection } from "./_components/landing/rdx-gallery-section";
import { OurServicesSection } from "./_components/landing/our-services-section";
import { NewArrivalProducts } from "./_components/landing/new-arrival-products";
import { FlashDealSection } from "./_components/landing/flash-deal-section";
import { FloorSolution } from "./_components/landing/floor-solution";
import { SuccessStories } from "./_components/landing/success-stories";
import { PerformanceSection } from "./_components/landing/performance-section";
import { TrustedBrands } from "./_components/landing/trusted-brands";
import { DiscountedProducts } from "./_components/landing/discounted-products";
import { OurClients } from "./_components/landing/our-clients";
import { PerformanceFrameSection } from "./_components/landing/performance-frame-section";
import { usePageViewTracking } from "@/lib/hooks/useAnalytics";

export default function Home() {
  // Track home page view
  usePageViewTracking({
    page_type: 'home',
    page_title: 'Home Page',
  });
  return (
    <div>
      <HeroSection />
      <ExploreCategories />
      {/* add preorder now section */}
      <PreOrderSection />
      
      {/* <BestSellingProducts /> */}
      <NewArrivalProducts />
      {/* add new rdx gallery */}
      <RdxGallerySection />
      
      
      <FloorSolution />
      
      <TrustedBrands />

      <SuccessStories />

      {/* our services */}
      <OurServicesSection />

      {/* Promo Cards Section - Cardio & Free Weight Equipment */}
      <PromoCardsSection />
      <DiscountedProducts />
      <PerformanceSection />
     
      {/* add success stories */}
      
      {/* <FeatureSection />
      <ShopNowBanner /> */}
      <FlashDealSection />
      {/* floor solution  */}
    
      <OurClients />
      <PerformanceFrameSection />
    </div>
  );
}
