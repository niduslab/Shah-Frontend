import { Metadata } from 'next';
import BadmintonHero from '../_components/badminton-flooring/badminton-hero';
import BadmintonOverview from '../_components/badminton-flooring/badminton-overview';
import BadmintonProducts from '../_components/badminton-flooring/badminton-products';
import BadmintonFeatures from '../_components/badminton-flooring/badminton-features';
import BadmintonSpecifications from '../_components/badminton-flooring/badminton-specifications';
import BadmintonCTA from '../_components/badminton-flooring/badminton-cta';

export const metadata: Metadata = {
  title: 'Professional Badminton Court Flooring | Shah Sports',
  description: 'High-performance badminton flooring with superior traction and durability. Professional-grade surfaces for competitive and recreational courts.',
};

export default function BadmintonFlooringPage() {
  return (
    <main className="min-h-screen bg-white">
      <BadmintonHero />
      <BadmintonOverview />
      <BadmintonProducts />
      <BadmintonFeatures />
      <BadmintonSpecifications />
      <BadmintonCTA />
    </main>
  );
}
