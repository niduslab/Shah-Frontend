import { Clock, Shield, Waves, Home } from "lucide-react";

const FEATURES = [
  {
    title: "Build To Last",
    description: "Premium materials and solid construction for years of reliability",
    icon: Clock,
  },
  {
    title: "Trusted Legacy",
    description: "Over four decades of innovation in performance and design.",
    icon: Shield,
  },
  {
    title: "Engineered Comfort",
    description: "Engineered Comfort - Smooth mechanics and ergonomic design for natural movement.",
    icon: Waves,
  },
  {
    title: "Refined Aesthetics",
    description: "Elegant form that enhances any home environment",
    icon: Home,
  },
];

export function NordicTrackWhyChoose() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Why Choose Nordictrack
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black p-3">
                <feature.icon className="h-8 w-8 text-black" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-black">
                {feature.title}
              </h3>
              <p className="max-w-[250px] text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
