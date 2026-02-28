import Image from "next/image";

interface Client {
  name: string;
  image: string;
}

interface ClientCategorySectionProps {
  title: string;
  clients: Client[];
}

export function ClientCategorySection({ title, clients }: ClientCategorySectionProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-black">{title}</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(197px,1fr))] gap-6">
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-lg bg-[#F3F4F6] p-4 transition-shadow hover:shadow-md"
            >
              <div className="relative h-12 w-full">
                <Image
                  src={client.image}
                  alt={client.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              </div>
              <p className="text-center text-sm font-medium text-black">
                {client.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
