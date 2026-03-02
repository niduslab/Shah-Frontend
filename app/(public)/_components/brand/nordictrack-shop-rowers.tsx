import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NordicTrackShopRowers() {
  return (
    <section className="w-full bg-[#FFFBF0]">
      {/* First Section: Blue Background Rower */}
      <div className="container py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16 mx-auto px-4 md:px-0 max-w-[1400px]">
          {/* Left: Image */}
          <div className="flex-1">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-[#A4C8F0]/30 md:aspect-[4/3]">
              <Image
                src="/images/brand-page/shop-rowers/img-1.png"
                alt="NordicTrack Smart Rower"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Smart Rowing. Full-Body Results. <br />
              Real Progress.
            </h2>
            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
              Experience a powerful, low-impact workout that engages your entire body.
              Smart rowing machines automatically adjust resistance to match your
              trainer's intensity, helping you build strength, endurance, and consistency—
              every session, every stroke.
            </p>
            <Link
              href="/shop?category=rower"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-colors hover:bg-[#FFC107]/90"
            >
              Shop Rowers
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Second Section: Lifestyle Treadmill */}
      <div className="container py-16">
        <div className="flex flex-col-reverse gap-12 lg:flex-row lg:items-center lg:gap-16 mx-auto px-4 md:px-0 max-w-[1400px]">
          {/* Left: Content */}
          <div className="flex-1">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Where Refined Design meets <br />
              uncompromising power.
            </h2>
            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
              Experience a powerful, low-impact workout that engages your entire body.
              Smart rowing machines automatically adjust resistance to match your
              trainer's intensity, helping you build strength, endurance, and consistency—
              every session, every stroke.
            </p>
            <Link
              href="/shop?category=rower"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-colors hover:bg-[#FFC107]/90"
            >
              Shop Rowers
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Right: Image */}
          <div className="flex-1">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm md:aspect-[4/3]">
              <Image
                src="/images/brand-page/shop-rowers/img-2.png"
                alt="NordicTrack Design Treadmill"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
