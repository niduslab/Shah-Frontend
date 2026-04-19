import Image from "next/image";

const STATS = [
  { value: "40K +", label: "Training Videos" },
  { value: "195 +", label: "Countries" },
  { value: "2M +", label: "Active Users" },
];

export function KinoMapHero() {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative h-[540px] w-full sm:h-[600px] lg:h-[660px]">
        <Image
          src="/images/kino-map/hero-img.jpg"
          alt="Indoor interactive training with Kinomap"
          fill
          priority
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(72% 80% at 100% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.75) 100%), linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.78) 30%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-end px-4 pb-10 md:px-8 lg:items-center lg:pb-0">
          <div className="max-w-[560px]">
            <h1 className="text-[42px] font-bold leading-[1.04] text-white sm:text-[56px] lg:text-[56px]">
              Indoor Interactive
              <br />
              Training with
              <br />
              <span
                className="text-[#FFB81E]"
                style={{
                  fontFamily: "Brush Script MT, Segoe Script, cursive",
                  fontWeight: 500,
                }}
              >
                Kinomap 
              </span>
              <p className="text-[24px]">Now in Bangladesh</p>
            </h1>
            <p className="mt-3 max-w-[540px] text-sm leading-relaxed text-white/90 sm:text-base">
              Less &apos;at home&apos;, more &apos;out there&apos;. Reimagine indoor training with
              Kinomap&apos;s interactive app — featuring 40,000+ real-life training videos
              from the world&apos;s most stunning routes.
            </p>

            <div className="mt-7 grid w-full grid-cols-3 gap-4 border-t border-white/20 pt-6 sm:max-w-[520px]">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-[34px] font-extrabold leading-none text-[#FFB81E]">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-base text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF8A1E]/80 to-transparent" />
      </div>
    </section>
  );
}
