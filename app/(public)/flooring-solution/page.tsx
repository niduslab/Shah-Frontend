import { Metadata } from 'next';
import FlooringSolutionHero from '../_components/flooring-solution/flooring-solution-hero';
import FlooringSolutionTypes from '../_components/flooring-solution/flooring-solution-types';
import FlooringSolutionSeries from '../_components/flooring-solution/flooring-solution-series';
import FlooringSolutionFeatures from '../_components/flooring-solution/flooring-solution-features';
import FlooringSolutionGallery from '../_components/flooring-solution/flooring-solution-gallery';
import FlooringSolutionCTA from '../_components/flooring-solution/flooring-solution-cta';

export const metadata: Metadata = {
  title: 'Premium Flooring Solutions for Gyms, Tennis Courts & Sports Facilities | Shah Sports',
  description: 'Comprehensive flooring solutions for gyms, tennis courts, and outdoor sports facilities. High-quality, durable, and safe flooring systems tailored to your needs.',
};

export default function FlooringSolutionPage() {
  return (
    <main className="min-h-screen">
      <FlooringSolutionHero />
      <FlooringSolutionSeries />
      <FlooringSolutionTypes />
      <FlooringSolutionFeatures />
      <FlooringSolutionGallery />
      <FlooringSolutionCTA />
    </main>
  );
}
