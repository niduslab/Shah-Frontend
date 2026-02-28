import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NordicTrackFitnessDiscounts() {
  return (
    <section className="relative w-full py-24 md:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* <Image
          src="/images/brand-page/fitness-discounts.png"
          alt="Fitness Discounts Background"
          fill
          className="object-cover object-center"
        /> */}
        {/* Overlay to ensure text readability matching the design color #461802 with opacity if needed, 
            but based on the prompt, the background IS the image. 
            However, the prompt mentioned "background: #461802", which might be a fallback or overlay color.
            Let's apply a slight overlay if the image is too bright, but usually these banners have built-in dimming.
            For now, I'll add a background color behind the image as fallback.
        */}
        <div className="absolute inset-0 -z-10 bg-[#361605]" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
        <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-gray-300 sm:text-base">
          Limited-Time Event
        </span>
        
        <h2 className="mb-2 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          Fitness <span className="italic text-[#FFC107]">30% off</span>
        </h2>
        
        <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          Essentials
        </h2>
        
        <p className="mx-auto mb-10 max-w-2xl text-base text-gray-200 sm:text-lg">
          Save on select NordicTrack equipment during the <br className="hidden sm:block" />
          Winter Sale Event
        </p>
        
        <Link
          href="/shop"
          className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-transform hover:scale-105 hover:bg-[#FFC107]/90"
        >
          Shop Now
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
