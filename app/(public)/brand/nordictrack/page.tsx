import { NordicTrackHero } from "@/app/(public)/_components/brand/nordictrack-hero";
import { NordicTrackCategories } from "@/app/(public)/_components/brand/nordictrack-categories";
import { NordicTrackBehindTheWork } from "@/app/(public)/_components/brand/nordictrack-behind-the-work";
import { NordicTrackRecommendedProducts } from "@/app/(public)/_components/brand/nordictrack-recommended-products";
import { NordicTrackShopBy } from "@/app/(public)/_components/brand/nordictrack-shop-by";
import { NordicTrackFitnessDiscounts } from "@/app/(public)/_components/brand/nordictrack-fitness-discounts";
import { NordicTrackShopRowers } from "@/app/(public)/_components/brand/nordictrack-shop-rowers";
import { NordicTrackWhyChoose } from "@/app/(public)/_components/brand/nordictrack-why-choose";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NordicTrack - Home Fitness Equipment",
  description:
    "Turn your home into a complete fitness space with NordicTrack's innovative treadmills, ellipticals, and exercise bikes.",
};

export default function NordicTrackPage() {
  return (
    <main className="min-h-screen bg-black">
      <NordicTrackHero />
      <NordicTrackCategories />
      <NordicTrackBehindTheWork />
      <NordicTrackRecommendedProducts />
      <NordicTrackShopBy />
      <NordicTrackFitnessDiscounts />
      <NordicTrackShopRowers />
      <NordicTrackWhyChoose />
    </main>
  );
}
