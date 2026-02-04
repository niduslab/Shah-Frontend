import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BANNER_IMAGE = "/images/landing/image-shop-now/d8ee05acccb81fd87e969eab4722138dbc94e119.jpg";

export function ShopNowBanner() {
  return (
    <section className="w-full bg-white px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="relative h-[360px] w-full overflow-hidden rounded-xs md:h-[520px] lg:h-[600px]">
          <Image
            src={BANNER_IMAGE}
            alt="Gym Equipment"
            fill
            className="object-cover"
            priority
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-12 left-6 max-w-[456px] md:bottom-20 md:left-16">
            <h2 className="mb-8 text-xl font-medium leading-snug text-white sm:text-2xl md:text-3xl">
              We provide durable, high-quality fitness and{" "}
              <span className="font-bold text-primary italic">sports equipment</span>{" "}
              designed for comfort, performance, and results you can trust every day.
            </h2>
            
            <Link
              href="/shop"
              className="inline-flex h-12 items-center gap-2 rounded-xs bg-primary px-8 text-[16px] font-semibold text-black transition-colors hover:bg-primary/90"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
