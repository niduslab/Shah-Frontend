import { Metadata } from 'next';
import MultipurposeHero from '../_components/multipurpose-flooring/multipurpose-hero';
import MultipurposeOverview from '../_components/multipurpose-flooring/multipurpose-overview';
import MultipurposeProducts from '../_components/multipurpose-flooring/multipurpose-products';
import MultipurposeFeatures from '../_components/multipurpose-flooring/multipurpose-features';
import MultipurposeSpecifications from '../_components/multipurpose-flooring/multipurpose-specifications';
import MultipurposeCTA from '../_components/multipurpose-flooring/multipurpose-cta';

export const metadata: Metadata = {
  title: 'Multipurpose Sports Flooring | Shah Sports',
  description: 'Versatile multipurpose flooring solutions for schools, training gyms, sports clubs, and recreational venues. Durable, safe, and easy to maintain.',
};

export default function MultipurposeFlooringPage() {
  return (
    <main className="min-h-screen bg-white">
      <MultipurposeHero />
      <MultipurposeOverview />
      <MultipurposeProducts />
      <MultipurposeFeatures />
      <MultipurposeSpecifications />
      <MultipurposeCTA />
    </main>
  );
}
