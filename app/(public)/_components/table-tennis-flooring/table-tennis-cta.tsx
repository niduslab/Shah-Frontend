'use client';

import Image from 'next/image';
import { Phone, Mail, ArrowRight, ShieldCheck, Star, CheckCircle } from 'lucide-react';

export default function TableTennisCTA() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi, I'm interested in your ITTF certified table tennis flooring. Can you provide more information?");
    const phoneNumber = "8801615550098";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-black">
      <Image
        src="/images/flooring-solution-page/joyfull/table-tennis/table-tennis-flooring-scaled-1-768x384.jpg"
        alt="Contact us for table tennis flooring"
        fill
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90" />
      
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Install Professional{' '}
              <span className="text-[#ffb81e]">Table Tennis Flooring?</span>
            </h2>
            
            <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Contact our team today to get a free quote and professional consultation for your table tennis facility.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="tel:01615550098"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#ffb81e] px-8 text-base font-semibold text-black transition-all hover:bg-[#ffb81e]/90"
              >
                <Phone className="h-4 w-4" />
                01615550098
              </a>
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-white/10 border border-white/20 px-8 text-base font-semibold text-white transition-all hover:bg-white/20"
              >
                <Mail className="h-4 w-4" />
                Request a Quote
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-sm bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-10 h-10 text-[#ffb81e] mb-3 mx-auto" />
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-gray-400 text-sm font-medium">ITTF Certified</div>
            </div>
            <div className="text-center p-6 rounded-sm bg-white/5 border border-white/10 backdrop-blur-sm">
              <Star className="w-10 h-10 text-[#ffb81e] mb-3 mx-auto" />
              <div className="text-3xl font-bold text-white mb-1">15+</div>
              <div className="text-gray-400 text-sm font-medium">Years of Excellence</div>
            </div>
            <div className="text-center p-6 rounded-sm bg-white/5 border border-white/10 backdrop-blur-sm">
              <CheckCircle className="w-10 h-10 text-[#ffb81e] mb-3 mx-auto" />
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-gray-400 text-sm font-medium">Completed Projects</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
