import { ContactHero } from "@/app/(public)/_components/contact/contact-hero";
import { GetInTouchSection } from "@/app/(public)/_components/contact/get-in-touch-section";
import { ContactFormSection } from "@/app/(public)/_components/contact/contact-form-section";
import { LocationMapSection } from "@/app/(public)/_components/contact/location-map-section";

export default function ContactPage() {
  return (
    <div className="bg-surface">
      <ContactHero />
      <GetInTouchSection />
      <ContactFormSection />
      <LocationMapSection />
    </div>
  );
}
