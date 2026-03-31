import { Metadata } from 'next';
import JoyfullHero from '../_components/joyfull-series/joyfull-hero';
import JoyfullOverview from '../_components/joyfull-series/joyfull-overview';
import JoyfullApplications from '../_components/joyfull-series/joyfull-applications';
import JoyfullFeatures from '../_components/joyfull-series/joyfull-features';
import JoyfullGallery from '../_components/joyfull-series/joyfull-gallery';
import JoyfullCTA from '../_components/joyfull-series/joyfull-cta';

export const metadata: Metadata = {
  title: 'Joyfull Series - Professional Indoor Sports Flooring | Shah Sports',
  description: 'Joyfull Series - High-performance indoor sports flooring built to international standards. Perfect for table tennis, badminton, basketball, and multipurpose courts.',
};

export default function JoyfullSeriesPage() {
  return (
    <main className="min-h-screen bg-white">
      <JoyfullHero />
      <JoyfullOverview />
      <JoyfullApplications />
      <JoyfullFeatures />
      <JoyfullGallery />
      <JoyfullCTA />
    </main>
  );
}
