import { Metadata } from 'next';
import BasketballHero from '../_components/basketball-flooring/basketball-hero';
import BasketballOverview from '../_components/basketball-flooring/basketball-overview';
import BasketballProducts from '../_components/basketball-flooring/basketball-products';
import BasketballFeatures from '../_components/basketball-flooring/basketball-features';
import BasketballSpecifications from '../_components/basketball-flooring/basketball-specifications';
import BasketballCTA from '../_components/basketball-flooring/basketball-cta';

export const metadata: Metadata = {
  title: 'Professional Basketball Court Flooring | Shah Sports',
  description: 'High-performance basketball flooring with superior ball rebound and shock absorption. Professional-grade surfaces for competitive and recreational courts.',
};

export default function BasketballFlooringPage() {
  return (
    <main className="min-h-screen bg-white">
      <BasketballHero />
      <BasketballOverview />
      <BasketballProducts />
      <BasketballFeatures />
      <BasketballSpecifications />
      <BasketballCTA />
    </main>
  );
}
