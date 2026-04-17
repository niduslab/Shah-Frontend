import Image from "next/image";

export function BrandsHero() {
  return (
    <div className="relative h-[700px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/all-brands/hero-section.png"
          alt="Runner on treadmill"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay - Dark fade from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-[1400px]">
        <div className="max-w-2xl">
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-[64px] leading-tight">
            Our Trusted <br />
            <span className="italic text-primary">Brand Partners</span>
          </h1>
          
          <p className="text-lg text-gray-200 sm:text-xl leading-relaxed max-w-xl">
            At Shah Sports, we partner with reputable sports and fitness brands
            known for innovation and excellence. Explore our curated brand
            collection and find the perfect gear designed to elevate your
            performance.
          </p>
        </div>
      </div>
    </div>
  );
}
