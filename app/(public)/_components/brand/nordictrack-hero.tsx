import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NordicTrackHero() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-black md:h-[700px] lg:h-[800px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/brand-page/brand-page-hero-img.png"
          alt="NordicTrack Fitness Equipment"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(89.44deg, rgba(0, 0, 0, 0.82) 21.48%, rgba(102, 102, 102, 0) 67.89%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex h-full items-center mx-auto px-4 md:px-0 max-w-[1400px]">
        <div className="max-w-xl md:max-w-2xl">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-[64px]">
            Turn Your Home <br />
            Into A Complete <br />
            <span className="italic text-[#FFC107]">Fitness Space</span>
          </h1>
          <p className="mb-8 max-w-lg text-sm text-gray-300 sm:text-base md:text-lg">
            NordicTrack is a leader in home fitness equipment, known for
            innovative treadmills, ellipticals, and exercise bikes with iFIT
            technology integration.
          </p>
          <Link
            href="/shop"
            className="group inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-transform hover:scale-105 hover:bg-[#FFC107]/90"
          >
            Shop Nordictrack
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-4">
        <div className="h-1.5 w-12 rounded-full bg-white/40"></div>
        <div className="h-1.5 w-12 rounded-full bg-[#FFC107]"></div>
        <div className="h-1.5 w-12 rounded-full bg-white/40"></div>
      </div>
    </div>
  );
}
