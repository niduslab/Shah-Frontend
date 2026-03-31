import { Metadata } from 'next';
import TableTennisHero from '../_components/table-tennis-flooring/table-tennis-hero';
import TableTennisOverview from '../_components/table-tennis-flooring/table-tennis-overview';
import TableTennisProducts from '../_components/table-tennis-flooring/table-tennis-products';
import TableTennisFeatures from '../_components/table-tennis-flooring/table-tennis-features';
import TableTennisSpecifications from '../_components/table-tennis-flooring/table-tennis-specifications';
import TableTennisCTA from '../_components/table-tennis-flooring/table-tennis-cta';

export const metadata: Metadata = {
  title: 'ITTF Certified Table Tennis Flooring | Shah Sports',
  description: 'Professional ITTF certified table tennis flooring with superior grip and shock absorption. Engineered for optimal performance and player safety.',
};

export default function TableTennisFlooringPage() {
  return (
    <main className="min-h-screen bg-white">
      <TableTennisHero />
      <TableTennisOverview />
      <TableTennisProducts />
      <TableTennisFeatures />
      <TableTennisSpecifications />
      <TableTennisCTA />
    </main>
  );
}
