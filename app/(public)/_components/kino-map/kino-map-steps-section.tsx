import { Bike, Download, Smartphone, Play } from "lucide-react";

const STEPS = [
  {
    icon: Bike,
    step: "01",
    title: "Get Equipment",
    description: "Purchase a Kinomap-compatible machine from Shah Sports",
  },
  {
    icon: Download,
    step: "02",
    title: "Download App",
    description: "Install Kinomap on your smartphone, tablet, or smart TV",
  },
  {
    icon: Smartphone,
    step: "03",
    title: "Connect via Bluetooth",
    description: "Pair your equipment with the app for auto-resistance control",
  },
  {
    icon: Play,
    step: "04",
    title: "Start Training",
    description: "Choose a route, hit play, and explore the world from home",
  },
];

export function KinoMapStepsSection() {
  return (
    <section className="bg-[#F8F9FA] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold uppercase text-black sm:text-4xl">
          Up & Running in 4 Steps
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="group relative flex flex-col rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md h-full"
            >
              <div className="mb-8 flex items-start justify-between">
                <item.icon
                  className="h-10 w-10 text-[#FF8A00]"
                  strokeWidth={1.5}
                />
                <span className="text-4xl font-light text-gray-200">
                  {item.step}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-black">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
