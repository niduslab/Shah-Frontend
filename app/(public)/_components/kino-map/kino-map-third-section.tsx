import Image from "next/image";
import { Globe, Target, Map, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Globe,
    title: "Scenic Videos",
    description:
      "Explore 40,000+ real-life training routes from every corner of the world. Mountains, coastlines, cities — ride them all",
  },
  {
    icon: Target,
    title: "Coaching Sessions",
    description:
      "Follow expert coaches with structured workout programs designed to push your limits and track your progress",
  },
  {
    icon: Map,
    title: "GPS Tracks",
    description:
      "Upload your own GPS routes or challenge other users on public tracks. Your outdoor routes, indoors.",
  },
  {
    icon: Users,
    title: "Multiplayer Mode",
    description:
      "Challenge friends, join live sessions, and compete in real-time with riders and runners worldwide",
  },
];

export function KinoMapThirdSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1400px] items-stretch gap-12 px-4 md:grid-cols-2 md:px-8 lg:gap-20">
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Tablet Image (Background) */}
          <div className="relative z-10 h-full w-full overflow-hidden rounded-[24px] shadow-2xl">
            <Image
              src="/images/kino-map/third-section/left-img.jpg"
              alt="Kinomap Tablet Interface"
              fill
              className="object-cover"
            />
          </div>

          {/* Phone Image (Foreground Overlay) */}
          <div className="absolute -bottom-6 -right-2 z-20 w-[38%] overflow-hidden sm:-bottom-10 sm:-right-6 sm:w-[35%] md:-bottom-8 md:-right-4 lg:-bottom-12 lg:-right-8 xl:-right-12">
            <div className="relative aspect-[9/19.5] w-full">
              {/* Notch Simulation */}
              <div className="absolute left-1/2 top-0 z-30 h-6 w-1/3 -translate-x-1/2 rounded-b-xl" />
              
              <Image
                src="/images/kino-map/third-section/left-mobile-img.png"
                alt="Kinomap Mobile Interface"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center py-8">
          <h2 className="mb-6 text-3xl font-bold leading-tight text-black sm:text-4xl md:text-5xl uppercase">
            Everything You Need To Train Smarter
          </h2>
          <p className="mb-12 text-base leading-relaxed text-gray-600 sm:text-lg">
            Kinomap transforms your cardio equipment into an immersive,
            interactive training experience.
          </p>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col items-start">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FFFBF0]">
                  <feature.icon className="h-7 w-7 text-[#FFB81E]" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-black">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
