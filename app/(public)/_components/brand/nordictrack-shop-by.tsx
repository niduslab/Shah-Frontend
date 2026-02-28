import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NordicTrackShopBy() {
  return (
    <section className="w-full bg-white pb-16 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Card - T Series */}
          <div className="group relative h-[400px] w-full overflow-hidden rounded-sm bg-gradient-to-b from-[#EAEAEA] to-[#B8B8B8] md:h-[500px]">
            {/* Background Image */}
            <Image
              src="/images/brand-page/shop-by/t-series.png"
              alt="T Series 16 Treadmill"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-8 text-center">
              {/* Speed Badge */}
              {/* <div className="absolute bottom-[140px] right-8 flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-[#1A1A1A] text-white shadow-lg md:right-12">
                <span className="text-3xl font-bold">12</span>
                <span className="text-xs font-medium uppercase tracking-wider">MPH</span>
                <span className="text-xs font-medium uppercase tracking-wider">Speed</span>
              </div> */}

              <h3 className="mb-6 text-2xl font-bold text-white md:text-3xl">
                T Series 16 Treadmill
              </h3>
              
              <Link
                href="/shop?category=treadmill"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-colors hover:bg-[#FFC107]/90"
              >
                Shop Treadmill
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Right Card - Step Climber */}
          <div className="group relative h-[400px] w-full overflow-hidden rounded-sm bg-gradient-to-b from-[#A4C8F0] to-[#6B9AC4] md:h-[500px]">
            {/* Background Image */}
            <Image
              src="/images/brand-page/shop-by/setp-climb-xl.png"
              alt="Step Climber XL"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-8 text-center">
              <h3 className="mb-6 text-2xl font-bold text-white md:text-3xl">
                Step Climber XL
              </h3>
              
              <Link
                href="/shop?category=elliptical"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black transition-colors hover:bg-[#FFC107]/90"
              >
                Shop Ellipticals
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
