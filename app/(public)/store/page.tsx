import { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Store | Shah Sports",
  description:
    "Visit the Shah Sports showroom in Tejgaon, Dhaka to explore our full range of fitness and sports equipment in person, or reach our team directly.",
};

const storeDetails = [
  {
    icon: MapPin,
    title: "Address",
    value: "223/A, Tejgaon Industrial Area, Gulshan Link Road, Dhaka-1208",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "880-1615550080 / 880-1615550079 / 880-1615550014",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@shahsports.com.bd",
  },
  {
    icon: Clock,
    title: "Store Hours",
    value: "Saturday – Thursday: 10:00 AM – 8:00 PM | Friday: 3:00 PM – 8:00 PM",
  },
];

export default function OurStorePage() {
  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-black py-16 text-white md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80" />
        <div className="container relative z-10 mx-auto max-w-[1000px] px-4">
          <h1 className="text-3xl font-bold tracking-tight uppercase md:text-5xl">
            Our <span className="text-[#ffb81e] italic font-serif">Store</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-300 md:text-lg">
            Come see, touch, and try our fitness and sports equipment in
            person at our Dhaka showroom — our team will be happy to help you
            find the right fit.
          </p>
        </div>
      </section>

      {/* Store details + map */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-[1100px] px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {/* Details */}
            <div className="flex flex-col gap-5">
              {storeDetails.map((detail) => (
                <div
                  key={detail.title}
                  className="flex items-start gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#F3EFE9]">
                    <detail.icon className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 md:text-base">
                      {detail.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {detail.value}
                    </p>
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 md:text-base">
                  Can't visit in person?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Shop our full range online anytime, with delivery across
                  Bangladesh, or reach out via our{" "}
                  <a href="/contact" className="font-medium text-[#a56a00] underline">
                    Contact page
                  </a>{" "}
                  for personalised assistance.
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="h-[350px] w-full overflow-hidden rounded-xl border border-border bg-gray-100 shadow-sm md:h-full md:min-h-[420px]">
              <iframe
                src="https://maps.google.com/maps?q=223/A,+Bir+Uttam+Mir+Shawkat+Sarak,+Dhaka+1208&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shah Sports Store Location"
                className="h-full w-full grayscale transition-all duration-500 hover:grayscale-0"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
