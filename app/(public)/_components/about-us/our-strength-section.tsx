import Image from "next/image";
import { Award, Truck, Wrench, CheckCircle } from "lucide-react";

const stats = [
  {
    number: "81 +",
    title: "Years of Excellence",
    description:
      "Serving athletes and fitness communities with trusted quality for decades.",
  },
  {
    number: "2000 +",
    title: "Satisfied Customers",
    description:
      "Trusted by individuals, gyms, schools, and sports academies across Bangladesh.",
  },
  {
    number: "98 %",
    title: "Positive Customer Feedback",
    description:
      "Consistently delivering reliable products and service that exceed expectations.",
  },
  {
    number: "21 +",
    title: "Expert Team Members",
    description:
      "A dedicated team committed to helping you choose the right equipment for your performance goals.",
  },
  {
    number: "02 +",
    title: "Showrooms Nationwide",
    description:
      "Visit our showrooms to experience premium fitness and sports equipment firsthand.",
  },
];

const features = [
  {
    icon: Award,
    title: "Authorized Dealer",
    description: "Official distributor of 24+ international fitness brands in Bangladesh.",
  },
  {
    icon: Wrench,
    title: "Expert Service",
    description: "Skilled technicians for installation, maintenance, and repairs.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast and reliable shipping across all 64 districts of Bangladesh.",
  },
  {
    icon: CheckCircle,
    title: "Genuine Products",
    description: "100% authentic equipment with manufacturer warranty and support.",
  },
];

export function OurStrengthSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 uppercase tracking-wide">
          Our Strength, Our Partners
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.slice(0, 3).map((stat, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-sm">
              <div className="text-5xl font-serif italic font-medium mb-6">
                {stat.number}
              </div>
              <h3 className="text-lg font-bold mb-3">{stat.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
          {stats.slice(3).map((stat, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-sm">
              <div className="text-5xl font-serif italic font-medium mb-6">
                {stat.number}
              </div>
              <h3 className="text-lg font-bold mb-3">{stat.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Service Promise Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-sm">
            <Image
              src="/images/about-us/products-of-service.png"
              alt="Gym Interior"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              More Than Products — A Promise of Service
            </h2>
            <p className="text-gray-600 leading-relaxed">
              With over 81 years of experience, Shah Sports takes pride not only
              in the products it provides but also in the service that stands
              behind them. Skilled technicians, reliable after-sales support,
              and a commitment to genuine products ensure lasting value for
              every customer. What began as a humble family venture has grown
              into a nationwide symbol of trust. As sports and fitness evolve,
              so will Shah Sports—continuing to serve Bangladesh with integrity,
              dedication, and passion.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="space-y-3">
                    <div className="w-12 h-12 bg-[#fff5e6] rounded-md flex items-center justify-center text-[#ffb81e]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
