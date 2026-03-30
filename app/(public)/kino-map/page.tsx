import type { Metadata } from "next";
import { KinoMapHero } from "@/app/(public)/_components/kino-map/kino-map-hero";
import { KinoMapSecondSection } from "@/app/(public)/_components/kino-map/kino-map-second-section";
import { KinoMapThirdSection } from "@/app/(public)/_components/kino-map/kino-map-third-section";
import { KinoMapStepsSection } from "@/app/(public)/_components/kino-map/kino-map-steps-section";
import { KinoMapDownloadSection } from "@/app/(public)/_components/kino-map/kino-map-download-section";

export const metadata: Metadata = {
  title: "Indoor Interactive Training with Kinomap | Shah Sports",
  description:
    "Discover immersive indoor cycling, running, and rowing with Kinomap’s interactive training platform and real-world routes.",
};

export default function KinoMapPage() {
  return (
    <main className="min-h-screen bg-black">
      <KinoMapHero />
      <KinoMapSecondSection />
      <KinoMapThirdSection />
      <KinoMapStepsSection />
      <KinoMapDownloadSection />
    </main>
  );
}
