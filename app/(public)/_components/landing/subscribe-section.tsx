"use client";

import { ArrowRight } from "lucide-react";

export function SubscribeSection() {
  return (
    <section className="w-full bg-[#351C06] py-16">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-8 md:flex-row">
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Get <span className="text-[#FFC107] italic">20%</span> Off for Your First Order
          </h2>
        </div>

        <div className="w-full max-w-xl">
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="flex-1 rounded-sm bg-white px-6 py-4 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
            />
            <button className="flex items-center justify-center gap-2 rounded-sm bg-[#FFC107] px-8 py-4 font-medium text-black transition-colors hover:bg-[#FFC107]/90">
              Subscribe <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-sm text-white/90">
            By subscribing you agree to the Term of use & Privacy Policy
          </p>
        </div>
      </div>
    </section>
  );
}
