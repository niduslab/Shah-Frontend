import { Zap, Gauge, Volume2, Smartphone } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Powerful Motor",
    description: "3.75 CHP DurX™ Commercial Plus Motor delivers smooth, consistent power for intense workouts."
  },
  {
    icon: Gauge,
    title: "Advanced Incline",
    description: "-3% decline to 15% incline simulates real-world terrain for effective training."
  },
  {
    icon: Volume2,
    title: "Quiet Operation",
    description: "Advanced cushioning and motor design for whisper-quiet performance at home."
  },
  {
    icon: Smartphone,
    title: "Smart Connectivity",
    description: "iFIT® enabled with personalized training programs and global workouts."
  }
];

export function ProductPerformance() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl">
            Built for Performance
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            Discover our most popular fitness equipment loved by
            thousands of athletes and fitness enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center rounded-xl border border-gray-100 bg-[#FAFAFA] p-8 text-center transition-shadow hover:shadow-lg"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[#3E1C00] text-[#FFB800]">
                <feature.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-black">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
