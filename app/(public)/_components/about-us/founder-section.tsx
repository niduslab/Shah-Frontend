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
      className={`flex flex-col md:flex-row gap-6 md:gap-12 items-center ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Image Section */}
      <div className={`w-full md:w-1/2 flex justify-center ${reverse ? "md:justify-center" : "md:justify-center"} relative group`}>
        <div className="relative aspect-[3/4] w-full max-w-[450px] overflow-hidden bg-gray-100 shadow-xl rounded-sm">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          {/* Name Card Overlay */}
          <div className="absolute bottom-6 left-6 right-6 bg-white p-6 shadow-sm border-l-4 border-[#ffb81e]">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 font-serif tracking-tight">
              {name}
            </h3>
            <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
              {title}
            </p>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
          {heading}
        </h2>
        <div className="w-16 h-1 bg-[#ffb81e] mx-auto md:mx-0 opacity-80" />
        <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">
          {description}
        </p>
      </div>
    </div>
  );
}

export function FounderSection() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
        <div className="space-y-24 md:space-y-32">
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
