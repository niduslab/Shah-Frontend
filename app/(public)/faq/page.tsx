import { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/app/(public)/_components/shared/faq-accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Shah Sports",
  description:
    "Find answers to common questions about ordering, payment, shipping, returns, and warranty at Shah Sports — Bangladesh's trusted fitness and sports equipment store.",
};

export default function FaqPage() {
  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-black py-16 text-white md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80" />
        <div className="container relative z-10 mx-auto max-w-[1000px] px-4">
          <h1 className="text-3xl font-bold tracking-tight uppercase md:text-5xl">
            Frequently Asked{" "}
            <span className="text-[#ffb81e] italic font-serif">Questions</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-300 md:text-lg">
            Have a question about ordering, delivery, or returns? Find quick
            answers below, or reach out to our team directly.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-[900px] px-4">
          <FaqAccordion />

          {/* Still need help */}
          <div className="mt-12 rounded-xl border border-border bg-white p-6 text-center shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
              Still have questions?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 md:text-base">
              Our support team is happy to help with anything not covered
              here.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-md bg-[#ffb81e] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[#e5a61b]"
              >
                Contact Us
              </Link>
              <Link
                href="/track-order"
                className="rounded-md border border-gray-300 px-6 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100"
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
