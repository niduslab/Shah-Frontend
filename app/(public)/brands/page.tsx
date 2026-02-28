import { BrandsGrid } from "../_components/brands/brands-grid";
import { BrandsHero } from "../_components/brands/brands-hero";

export const metadata = {
  title: "Our Trusted Brand Partners | Shah Sports",
  description:
    "Explore our curated collection of reputable sports and fitness brands known for innovation and excellence.",
};

export default function BrandsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <BrandsHero />

      {/* Brand Grid */}
      <BrandsGrid />
    </main>
  );
}
