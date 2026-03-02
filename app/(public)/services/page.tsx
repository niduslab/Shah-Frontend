import { ServicesHero } from "../_components/services/services-hero";
import { WhyChooseUs } from "../_components/services/why-choose-us";
import { ServicesList } from "../_components/services/services-list";
import { HowItWorks } from "../_components/services/how-it-works";

export const metadata = {
  title: "Expert Fitness Equipment Services | Shah Sports",
  description: "Professional repair and maintenance services for treadmills, ellipticals, and gym equipment. Certified technicians and genuine parts.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black">
      <ServicesHero />
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Services List Section */}
      <ServicesList />

      {/* How It Works Section */}
      <HowItWorks />
    </main>
  );
}
