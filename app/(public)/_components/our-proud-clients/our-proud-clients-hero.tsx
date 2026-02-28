import Image from "next/image";

export function OurProudClientsHero() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/our-proud-clients/hero-img.png"
          alt="Athlete running on a treadmill in a modern gym setting"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay - Dark fade from left to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-[64px] leading-tight">
            Our Valued <span className="italic text-primary">Clients</span> <br />
            <span className="italic text-primary">& Partners</span>
          </h1>
          
          <p className="text-lg text-gray-200 sm:text-xl leading-relaxed max-w-2xl">
            Over the years, Shah Sports has partnered with respected
            organizations and fitness professionals who demand excellence.
            From professional training centers to schools and corporate
            wellness facilities, our clients rely on us for durable, high-
            performance sports equipment and dependable service.
          </p>
        </div>
      </div>
    </div>
  );
}
