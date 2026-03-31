'use client';

import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function FloorMatCTA() {
  const handleWhatsAppClick = () => {
    window.open(
      `https://web.whatsapp.com/send?phone=8801615550080&text=${encodeURIComponent('Hello! I would like to get a custom quotation for gym flooring solutions. Can you please help me?')}`,
      '_blank'
    );
  };

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Main CTA Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-gray-900 to-black p-8 md:p-12 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          
          <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold text-primary">
                    Get Started Today
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl leading-tight">
                  Ready to Transform <br />
                  <span className="text-primary">Your Space?</span>
                </h2>
                
                <p className="text-base text-gray-300 md:text-lg leading-relaxed">
                  Inbox or call for a custom quotation. Our team will help you choose the perfect flooring solution for your facility.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-3">
                <a
                  href="tel:01615550098"
                  className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-primary/50 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Call us directly</p>
                    <p className="text-sm font-semibold text-white">01615550098</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                </a>

                <button
                  onClick={handleWhatsAppClick}
                  className="flex w-full items-center gap-3 rounded-lg bg-[#25D366] p-4 transition-all hover:bg-[#20BA5A] hover:shadow-lg group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs text-white/80">Chat on WhatsApp</p>
                    <p className="text-sm font-semibold text-white">Get Instant Response</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href="/contact"
                  className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-primary/50 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Send us an email</p>
                    <p className="text-sm font-semibold text-white">Contact Form</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>

            {/* Right Info Cards */}
            <div className="space-y-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Business Hours</h3>
                    <p className="text-sm text-gray-400">Saturday - Thursday: 9:00 AM - 8:00 PM</p>
                    <p className="text-sm text-gray-400">Friday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Visit Our Showroom</h3>
                    <p className="text-sm text-gray-400">123 Fitness Street, Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 backdrop-blur-sm">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">What You'll Get:</h3>
                  <ul className="space-y-2">
                    {[
                      'Free consultation & site visit',
                      'Custom quotation within 24 hours',
                      'Professional installation support',
                      'Quality guarantee & warranty',
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-black mb-1">500+</p>
            <p className="text-sm text-gray-600">Facilities Served</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-black mb-1">10+</p>
            <p className="text-sm text-gray-600">Years Experience</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-3xl font-bold text-black mb-1">100%</p>
            <p className="text-sm text-gray-600">Quality Guaranteed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
