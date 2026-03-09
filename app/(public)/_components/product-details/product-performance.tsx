import { Zap, Gauge, Volume2, Smartphone, Package, Shield, Truck, Award } from "lucide-react";

interface ProductPerformanceProps {
  product: any;
}

const DEFAULT_FEATURES = [
  {
    icon: Package,
    title: "Quality Product",
    description: "Premium quality materials and construction for long-lasting performance."
  },
  {
    icon: Shield,
    title: "Warranty Included",
    description: "Comprehensive warranty coverage for your peace of mind."
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Quick and reliable delivery to your doorstep."
  },
  {
    icon: Award,
    title: "Trusted Brand",
    description: "From a reputable manufacturer known for excellence."
  }
];

export function ProductPerformance({ product }: ProductPerformanceProps) {
  const features = product.brand ? [
    {
      icon: Award,
      title: product.brand.name,
      description: product.brand.description || `Trusted brand known for quality products.`
    },
    ...DEFAULT_FEATURES.slice(1)
  ] : DEFAULT_FEATURES;

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl">
            Why Choose This Product
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            Discover the features that make this product stand out
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
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
