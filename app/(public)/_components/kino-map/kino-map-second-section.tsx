import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const RUNNING_FEATURES = [
  "Auto Resistance",
  "Real-Time Stats",
  "GPS Tracking",
  "Heart Rate Zones",
];

const ROWING_FEATURES = [
  "Auto Resistance",
  "Real-Time Stats",
  "GPS Tracking",
  "Heart Rate Zones",
];

const CYCLING_FEATURES = [
  "Auto Resistance",
  "Real-Time Stats",
  "GPS Tracking",
  "Heart Rate Zones",
];

export function KinoMapSecondSection() {
  return (
    <section className="bg-[#FFFBF0] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* First Row: Running */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-black sm:text-4xl md:text-5xl">
              Sprint Through Forests & City Streets
            </h2>
            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
              Feel the forest floor beneath your feet or the pulse of a city run.
              Your treadmill&apos;s incline changes automatically to mirror the
              real route&apos;s elevation.
            </p>

            <div className="grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
              {RUNNING_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#FFB81E]" />
                  <span className="text-base font-medium text-gray-800">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 relative lg:order-2">
            <div className="relative aspect-[4/4] w-full rounded-[32px]">
              <div className="relative h-full w-full overflow-hidden rounded-[20px]">
                <Image
                  src="/images/kino-map/second-section/second-img.png"
                  alt="Running on Kinomap"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Rowing */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <div className="relative aspect-[4/4] w-full rounded-[32px]">
              <div className="relative h-full w-full overflow-hidden rounded-[20px]">
                <Image
                  src="/images/kino-map/second-section/third-img.png"
                  alt="Rowing on Kinomap"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-black sm:text-4xl md:text-5xl">
              Row Along Rivers & Open Waters
            </h2>
            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
              Glide through scenic waterways from around the world. Your rower&apos;s
              resistance adapts to simulate real water currents and conditions.
            </p>

            <div className="grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
              {ROWING_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#FFB81E]" />
                  <span className="text-base font-medium text-gray-800">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third Row: Cycling */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-black sm:text-4xl md:text-5xl">
              Conquer Mountain Passes & Coastal Roads
            </h2>
            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
              Experience the thrill of climbing alpine switchbacks and cruising seaside
              routes. Kinomap automatically adjusts your bike&apos;s resistance to match the
              terrain in real-time.
            </p>

            <div className="grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
              {CYCLING_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#FFB81E]" />
                  <span className="text-base font-medium text-gray-800">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 relative lg:order-2">
            <div className="relative aspect-[4/4] w-full rounded-[32px]">
              <div className="relative h-full w-full overflow-hidden rounded-[20px]">
                <Image
                  src="/images/kino-map/second-section/first-img.png"
                  alt="Cycling on Kinomap"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
