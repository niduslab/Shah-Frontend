import React from "react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const timelineData: TimelineItem[] = [
  {
    year: "1943",
    title: "Building the Founded",
    description:
      "Shah Sports established — beginning a journey in the heart of Dhaka's sports community.",
  },
  {
    year: "1960s",
    title: "Cricket Era",
    description:
      "Brought premium cricket brands like CA, Ihsan & Kookaburra to Bangladesh.",
  },
  {
    year: "1990s",
    title: "Fitness Expansion",
    description:
      "Entered the fitness industry with globally recognised equipment brands.",
  },
  {
    year: "Today",
    title: "Leading the Market",
    description:
      "Brought premium cricket brands like CA, Ihsan & Kookaburra to Bangladesh.",
  },
];

export function JourneySection() {
  return (
    <section className="py-20 bg-[#461802] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-0 max-w-[1400px]">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 md:mb-24">
          Our Journey So Far
        </h2>

        <div className="relative max-w-5xl mx-auto">
          {/* Central Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#ffb81e] to-transparent -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {timelineData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Dot (Desktop) */}
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-[#ffb81e] bg-white z-10 hidden md:block shadow-[0_0_0_4px_rgba(70,24,2,1)]" />

                  {/* Content Card Side */}
                  <div className="w-full md:w-1/2 px-4 md:px-12">
                    <div
                      className={`relative bg-[#7c2d12]/40 backdrop-blur-sm border border-[#ffb81e]/20 p-8 rounded-xl transition-transform hover:scale-105 duration-300 group
                      ${isEven ? "text-left" : "text-left md:text-right"}`}
                    >
                      {/* Arrow for Desktop */}
                      <div
                        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#7c2d12]/40 border-t border-r border-[#ffb81e]/20 rotate-45
                        ${
                          isEven
                            ? "-right-2 border-l-0 border-b-0 bg-[#5d2005]" // Right side arrow for left card
                            : "-left-2 border-t-0 border-r-0 rotate-[225deg] bg-[#5d2005]" // Left side arrow for right card
                        }`}
                      />

                      <div className="flex flex-col gap-2">
                        <div
                          className={`flex items-baseline gap-3 ${
                            !isEven ? "md:flex-row-reverse" : ""
                          }`}
                        >
                          <span className="text-3xl font-black text-[#ffb81e]">
                            {item.year}
                          </span>
                          <span className="text-lg font-bold text-white/90">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-white/70 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Empty Side for Layout Balance */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
