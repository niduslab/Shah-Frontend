"use client";

interface Stat {
  value: string;
  label: string;
}

interface DynamicBehindTheWorkSectionProps {
  data: {
    title: string;
    description: string;
    stats: Stat[];
    images: {
      left: string;
      center: string;
      right: string;
    };
  };
}

export function DynamicBehindTheWorkSection({
  data,
}: DynamicBehindTheWorkSectionProps) {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Content Side */}
          <div className="flex-1">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            <p className="mb-12 text-base leading-relaxed text-gray-600 sm:text-lg">
              {data.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {data.stats.map((stat, index) => (
                <div key={index}>
                  <div className="mb-2 text-3xl font-bold italic text-black sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images Side */}
          <div className="relative flex min-h-[400px] flex-1 items-center justify-center md:min-h-[500px]">
            {/* Left Image (Rower) - Behind */}
            {data.images.left && (
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[200px] max-w-[268px] -translate-x-[85%] -translate-y-1/2 overflow-hidden rounded-[2px] bg-blue-50 shadow-lg md:h-[400px] md:w-[268px]">
                <img
                  src={data.images.left}
                  alt="Left"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            )}

            {/* Right Image (Treadmill) - Behind */}
            {data.images.right && (
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[200px] max-w-[268px] -translate-x-[15%] -translate-y-1/2 overflow-hidden rounded-[2px] bg-gray-50 shadow-lg md:h-[400px] md:w-[268px]">
                <img
                  src={data.images.right}
                  alt="Right"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            )}

            {/* Center Image (Bike) - Front & Tallest */}
            {data.images.center && (
              <div className="absolute left-1/2 top-1/2 z-10 h-[360px] w-[220px] max-w-[268px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2px] bg-[#E5DCC5] shadow-2xl md:h-[480px] md:w-[268px]">
                <img
                  src={data.images.center}
                  alt="Center"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
