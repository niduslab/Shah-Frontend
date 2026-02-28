import { HeroSection } from "./_components/landing/hero-section";
import { ExploreCategories } from "./_components/landing/explore-categories";
import { PreOrderSection } from "./_components/landing/pre-order-section";
import { RdxGallerySection } from "./_components/landing/rdx-gallery-section";
import { OurServicesSection } from "./_components/landing/our-services-section";
import { NewArrivalProducts } from "./_components/landing/new-arrival-products";
import { FlashDealSection } from "./_components/landing/flash-deal-section";
import { FloorSolution } from "./_components/landing/floor-solution";
import { SuccessStories } from "./_components/landing/success-stories";
import { PerformanceSection } from "./_components/landing/performance-section";
import { TrustedBrands } from "./_components/landing/trusted-brands";
import { DiscountsSection } from "./_components/landing/discounts-section";
import { DiscountedProducts } from "./_components/landing/discounted-products";
import { FeatureSection } from "./_components/landing/feature-section";
import { ShopNowBanner } from "./_components/landing/shop-now-banner";
import { OurClients } from "./_components/landing/our-clients";
import { PerformanceFrameSection } from "./_components/landing/performance-frame-section";
import { SubscribeSection } from "./_components/landing/subscribe-section";

export default function Home() {
  return (
    <div className="px-6 lg:px-0">
      <HeroSection />
      <ExploreCategories />
      {/* add preorder now section */}
      <PreOrderSection />
      
      {/* <BestSellingProducts /> */}
      <NewArrivalProducts />
      {/* add new rdx gallery */}
      <RdxGallerySection />
      
      <FlashDealSection />
      {/* floor solution  */}
      <FloorSolution />
      <TrustedBrands />

      <SuccessStories />

      {/* our services */}
      <OurServicesSection />

      <DiscountsSection />
      <DiscountedProducts />
      <PerformanceSection />
     
      {/* add success stories */}
      
      {/* <FeatureSection />
      <ShopNowBanner /> */}
    
      <OurClients />
      <PerformanceFrameSection />
    </div>
  );
}
