import { AboutHero } from "@/app/(public)/_components/about-us/about-hero";
import { FounderSection } from "@/app/(public)/_components/about-us/founder-section";
import { JourneySection } from "@/app/(public)/_components/about-us/journey-section";
import { OurStrengthSection } from "@/app/(public)/_components/about-us/our-strength-section";

export default function AboutUsPage() {
  return (
    <main>
      <AboutHero />
      <FounderSection />
      <JourneySection />
      <OurStrengthSection />
    </main>
  );
}
