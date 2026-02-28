import Image from "next/image";

export function AboutHero() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about-us/hero-section.png"
          alt="Gym Interior"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark Gradient Overlay - Left to Right to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto h-full px-6 md:px-12 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight uppercase">
            WE ARE <span className="text-[#ffb81e] italic font-serif">Shah</span>
            <br />
            <span className="text-[#ffb81e] italic font-serif">Sports</span>
          </h1>

          {/* Description Text */}
          <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-xl">
            81 years of serving Bangladesh with the finest sports & fitness
            equipment from around the globe. A wide variety of fitness goods and
            equipment from around to globe to meet the needs of our clients.
          </p>
        </div>
      </div>
    </section>
  );
}
