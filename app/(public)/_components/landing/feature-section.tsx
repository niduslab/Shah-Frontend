import { Truck, RotateCcw, CreditCard } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    description: "Fast, reliable delivery to your doorstep. Start training sooner.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns & Exchanges",
    description: "Shop with confidence with easy returns or exchanges within 7-30 days, as per policy.",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Shop safely—your payments and personal info are fully protected.",
  },
];

export function FeatureSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center">
                <feature.icon className="h-12 w-12 text-[#3E4C24]" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-black">
                {feature.title}
              </h3>
              <p className="max-w-[300px] text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
