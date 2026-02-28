import { FlashSaleHero } from "@/app/(public)/_components/flash-sale/flash-sale-hero";
import { FlashSaleProducts } from "@/app/(public)/_components/flash-sale/flash-sale-products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flash Sale - Limited Time Offers",
  description: "Don't miss out on our flash sale! Up to 40% off on premium fitness equipment.",
};

export default function FlashSalePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <FlashSaleHero />
      <FlashSaleProducts />
    </main>
  );
}
