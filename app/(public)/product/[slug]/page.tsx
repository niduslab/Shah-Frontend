import { ProductInfo } from "../../_components/product-details/product-info";
import { ProductFeatures } from "../../_components/product-details/product-features";
import { ProductPerformance } from "../../_components/product-details/product-performance";
import { RecommendedProducts } from "../../_components/product-details/recommended-products";

export default function ProductDetailsPage() {
  return (
    <div className="flex flex-col bg-white">
      <ProductInfo />
      <ProductFeatures />
      <ProductPerformance />
      <RecommendedProducts />
    </div>
  );
}
      

