import { Metadata } from 'next';
import TrioflexMultipurposeHero from '../_components/trioflex-multipurpose-flooring/trioflex-multipurpose-hero';
import TrioflexMultipurposeOverview from '../_components/trioflex-multipurpose-flooring/trioflex-multipurpose-overview';
import TrioflexMultipurposeProducts from '../_components/trioflex-multipurpose-flooring/trioflex-multipurpose-products';
import TrioflexMultipurposeFeatures from '../_components/trioflex-multipurpose-flooring/trioflex-multipurpose-features';
import TrioflexMultipurposeSpecifications from '../_components/trioflex-multipurpose-flooring/trioflex-multipurpose-specifications';
import TrioflexMultipurposeCTA from '../_components/trioflex-multipurpose-flooring/trioflex-multipurpose-cta';

export const metadata: Metadata = {
  title: 'Trioflex Multipurpose Flooring | Shah Sports',
  description: 'Trioflex multipurpose flooring solutions for schools, training gyms, sports clubs, and recreational venues. Eco-friendly, durable, and safe.',
};

export default function TrioflexMultipurposeFlooringPage() {
  return (
    <main className="min-h-screen bg-white">
      <TrioflexMultipurposeHero />
      <TrioflexMultipurposeOverview />
      <TrioflexMultipurposeProducts />
      <TrioflexMultipurposeFeatures />
      <TrioflexMultipurposeSpecifications />
      <TrioflexMultipurposeCTA />
    </main>
  );
}
