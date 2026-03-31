'use client';

import Image from 'next/image';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TrioflexMultipurposeHero() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi, I'm interested in your Trioflex multipurpose flooring solutions. Can you provide more details?");
    const phoneNumber = "8801615550098";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden bg-black py-20 md:py-32">
      <Image
        src="/images/flooring-solution-page/trioflex-series/multipurpose-2-700x350.jpg"
        alt="Trioflex Multipurpose Sports Flooring"
        fill
        priority
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 backdrop-blur-sm border border-yellow-400/30 mb-6">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400 tracking-wider uppercase">
              Trioflex Multipurpose
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Trioflex Multipurpose{' '}
            <span className="text-yellow-400">Flooring Solutions</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-200 mb-8 max-w-2xl leading-relaxed">
            Ideal for schools, training gyms, sports clubs, and recreational venues. Durability and easy maintenance coupled with protection and safety provide the best performance for your specific needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={handleWhatsAppClick}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#ffb81e] px-8 text-base font-semibold text-black transition-all hover:bg-[#ffb81e]/90"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="tel:01615550098"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-white/10 backdrop-blur-sm border border-white/20 px-8 text-base font-semibold text-white transition-all hover:bg-white/20"
            >
              <Phone className="w-4 h-4" />
              01615550098
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
