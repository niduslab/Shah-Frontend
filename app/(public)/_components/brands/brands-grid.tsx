import Image from "next/image";

// Generate array of image paths for brands
// Based on the files: brand-1 (1).png to brand-1 (24).png
const BRAND_IMAGES = Array.from({ length: 24 }, (_, i) => 
  `/images/all-brands/brand-1 (${i + 1}).png`
);

export function BrandsGrid() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
          Trusted Brands We Carry
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {BRAND_IMAGES.map((src, index) => (
            <div 
              key={index} 
              className="group relative flex aspect-[3/2] w-full items-center justify-center bg-gray-50 p-6 transition-all hover:bg-gray-100 hover:shadow-sm"
            >
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={`Brand Partner ${index + 1}`}
                  fill
                  className="object-contain transition-all duration-300 group-hover:grayscale"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
