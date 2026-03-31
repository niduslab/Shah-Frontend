import { Metadata } from 'next';
import FloorMatHero from '../_components/floor-mat/floor-mat-hero';
import FloorMatCategories from '../_components/floor-mat/floor-mat-categories';
import FloorMatFeatures from '../_components/floor-mat/floor-mat-features';
import FloorMatBenefits from '../_components/floor-mat/floor-mat-benefits';
import FloorMatInstallation from '../_components/floor-mat/floor-mat-installation';
import FloorMatCTA from '../_components/floor-mat/floor-mat-cta';

export const metadata: Metadata = {
  title: 'Premium Rubber Floor Mats for Gyms & Indoor Sports | Shah Sports',
  description: 'Transform your gym and sports facility with Shah Sports\' premium rubber floor mats. Superior durability, enhanced safety, and optimal comfort for all fitness environments.',
};

export default function FloorMatPage() {
  return (
    <main className="min-h-screen">
      <FloorMatHero />
      <FloorMatCategories />
      <FloorMatFeatures />
      <FloorMatBenefits />
      <FloorMatInstallation />
      <FloorMatCTA />
    </main>
  );
}
