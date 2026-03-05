import Image from "next/image";

interface FounderProps {
  name: string;
  title: string;
  heading: string;
  description: string;
  imageSrc: string;
  reverse?: boolean;
}

function FounderCard({
  name,
  title,
  heading,
  description,
  imageSrc,
  reverse = false,
}: FounderProps) {
  return (
    <div
      className={`flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 lg:items-center ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Image Section */}
      <div className="w-full lg:w-[38%] flex-shrink-0">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm shadow-2xl group bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover object-top transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 38vw"
            priority
          />
        </div>
        
        {/* Name and Title Below Image - No Card */}
        <div className="mt-6 space-y-1">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
            {name}
          </h3>
          <p className="text-xs lg:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase">
            {title}
          </p>
        </div>
      </div>

      {/* Text Section */}
      <div className="w-full lg:w-[62%] flex flex-col justify-center">
        <div className="space-y-5 lg:space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              {heading}
            </h2>
            <div className="w-16 lg:w-20 h-1 bg-[#ffb81e] rounded-full" />
          </div>
          <p className="text-base lg:text-lg text-gray-700 leading-relaxed lg:leading-loose">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FounderSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="space-y-16 sm:space-y-20 lg:space-y-28 xl:space-y-36">
          {/* First Founder */}
          <FounderCard
            name="Syed Fida Hussain"
            title="FOUNDER"
            heading="The Beginning: A Father's Vision"
            description="The roots of Shah Sports trace back to 1943, when Syed Fida Hussain established the foundation of what would become one of Bangladesh's most respected sports enterprises. With limited resources but limitless determination, he began building a business grounded in honesty, discipline, and a deep respect for sport."
            imageSrc="/images/about-us/sayed fida hussain.png"
          />

          {/* Second Founder */}
          <FounderCard
            name="Syed Ghazanfar Ali"
            title="FOUNDER"
            heading="The Craftsman Who Built the Legacy"
            description="It was his son, Syed Ghazanfar Ali, who transformed that foundation into a powerful national legacy. In the early years, he personally hand-sewed footballs, pouring skill, patience, and pride into every stitch. Those footballs were not just products—they were symbols of resilience and commitment. Through relentless hard work and uncompromising quality, he expanded the business significantly. By the early 1970s, Shah Sports had become a trusted supplier to the Bangladesh Armed Forces and numerous elite commercial institutions. From the 1960s onward, his effort and vision left a lasting mark on Bangladesh's sporting landscape, including introducing premium cricket equipment and establishing Shah Sports' own home-brand cricket gear trusted by elite players."
            imageSrc="/images/about-us/syed ghazanfar ali.png"
            reverse={true}
          />

          {/* Third Founder */}
          <FounderCard
            name="Syed Nadeem Ali"
            title="DIRECTOR"
            heading="Expanding the Vision: Entering the Fitness Era"
            description="In the late 1980s and early 1990s, the third generation stepped forward. Syed Nadeem Ali, holding his father's hand and vision, began a new chapter for Shah Sports. Recognising the evolving needs of a growing nation, he expanded the company beyond traditional sports equipment into the fitness and wellness industry. He became one of the first to introduce internationally recognised fitness brands to Bangladesh. From home users to professional gyms, Shah Sports began offering comprehensive fitness solutions including equipment, service, maintenance, and long-term support—setting new standards for the industry."
            imageSrc="/images/about-us/sayeed nadeen ali.png"
          />
        </div>
      </div>
    </section>
  );
}
