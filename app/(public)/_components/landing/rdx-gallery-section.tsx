import Image from "next/image";
import Link from "next/link";

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Training",
    image: "/images/landing/rdx-gallery/9006e7dd80ecf645e78b83702112aee120de3a11.png",
    href: "/shop/training",
    className: "h-[300px]",
  },
  {
    id: 2,
    title: "Apparel",
    image: "/images/landing/rdx-gallery/12297c9eef97e322f7c7a0fa9318ed7d1d10ec28.png",
    href: "/shop/apparel",
    className: "h-[300px]",
  },
  {
    id: 3,
    title: "Boxing",
    image: "/images/landing/rdx-gallery/eed8082ab239304497367efe632ede29a9b94f41.png",
    href: "/shop/boxing",
    className: "h-[300px] md:row-span-2 md:h-full",
  },
  {
    id: 4,
    title: "Yoga",
    image: "/images/landing/rdx-gallery/09869b02227fe933f21baa27ed5b13a449885fed.png",
    href: "/shop/yoga",
    className: "h-[300px]",
  },
  {
    id: 5,
    title: "Weight Lifting",
    image: "/images/landing/rdx-gallery/9126b5c957ee5df27dff7a87011a99f338fd0203.png",
    href: "/shop/weight-lifting",
    className: "h-[300px]",
  },
];

export function RdxGallerySection() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
          Shop From Our New RDX Gallery
        </h2>

        {/* 
          Grid Layout:
          - Mobile: 1 column
          - Desktop: 3 columns with ratio 2fr 1fr 1fr
          - Item 3 (Boxing) spans 2 rows
        */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2">
          {GALLERY_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group relative block overflow-hidden rounded-xl bg-gray-100 ${item.className}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 z-10">
                <h3 className="text-2xl font-medium text-white">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
