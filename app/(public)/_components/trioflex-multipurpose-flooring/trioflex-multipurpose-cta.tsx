'use client';

import { ArrowRight, Phone } from 'lucide-react';

export default function TrioflexMultipurposeCTA() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi, I'm interested in your Trioflex multipurpose flooring solutions. Can you provide more details?");
    const phoneNumber = "8801615550098";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Upgrade Your Facility?
          </h2>
          
          <p className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed">
            Get in touch with our team to discuss your flooring needs and find the perfect Trioflex multipurpose solution for your venue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
