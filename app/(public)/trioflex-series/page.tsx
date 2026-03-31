import { Metadata } from 'next';
import TrioflexHero from '../_components/trioflex-series/trioflex-hero';
import TrioflexOverview from '../_components/trioflex-series/trioflex-overview';
import TrioflexShowcase from '../_components/trioflex-series/trioflex-showcase';
import TrioflexApplications from '../_components/trioflex-series/trioflex-applications';
import TrioflexFeatures from '../_components/trioflex-series/trioflex-features';
import TrioflexGallery from '../_components/trioflex-series/trioflex-gallery';
import TrioflexCTA from '../_components/trioflex-series/trioflex-cta';

export const metadata: Metadata = {
  title: 'Trioflex Series - Premium Indoor Sports Flooring | Shah Sports',
  description: 'Trioflex Series - High-end indoor sports flooring purpose built for professional performance. ITTF approved for table tennis and competitive sports.',
};

export default function TrioflexSeriesPage() {
  return (
    <main className="min-h-screen bg-white">
      <TrioflexHero />
      <TrioflexOverview />
      <TrioflexShowcase />
      <TrioflexApplications />
      <TrioflexFeatures />
      <TrioflexGallery />
      <TrioflexCTA />
    </main>
  );
}
