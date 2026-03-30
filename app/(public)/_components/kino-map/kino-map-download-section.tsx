import Image from "next/image";
import { Play } from "lucide-react";

export function KinoMapDownloadSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-[#3C1900] px-8 py-12 shadow-2xl md:px-16 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="max-w-[580px]">
              <h2 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Download <span className="text-[#FFB81E]">Kinomap</span>
                <br />
                Today
              </h2>
              <p className="mb-10 text-base font-light leading-relaxed text-white/80 sm:text-lg">
                Available on iOS, Android, Apple TV, and Android TV. Connect your
                equipment and start exploring the world from home.
              </p>

              <div className="flex flex-wrap gap-4">
                {/* App Store Button */}
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-black/40 px-6 py-3 transition-all hover:bg-black/60 hover:shadow-lg"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 text-white"
                  >
                    <path d="M15.5 17h-2.1l-1.4-2.5h-4l-1.4 2.5h-2.1l4.8-8.5h1.4l4.8 8.5zm-4.2-3.8l-1.3-2.3-1.3 2.3h2.6z" />
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase leading-none text-white/80">
                      Download on the
                    </span>
                    <span className="text-lg font-medium leading-none text-white">
                      App Store
                    </span>
                  </div>
                </a>

                {/* Google Play Button */}
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-black/40 px-6 py-3 transition-all hover:bg-black/60 hover:shadow-lg"
                >
                  <Play className="h-7 w-7 fill-white text-white" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase leading-none text-white/80">
                      Get it on
                    </span>
                    <span className="text-lg font-medium leading-none text-white">
                      Google Play
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Visuals */}
            <div className="relative flex h-[300px] items-center justify-center lg:h-[400px]">
              {/* Tablet Image (Behind) */}
              <div className="absolute left-0 top-1/2 z-10 w-[70%] -translate-y-1/2 overflow-hidden rounded-[20px] border-[8px] border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] md:w-[65%]">
                <div className="relative aspect-[4/3] w-full bg-black">
                  <Image
                    src="/images/kino-map/download-kinomap/right-img.jpg"
                    alt="Kinomap Tablet Interface"
                    fill
                    className="object-cover opacity-95 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Phone Image (Front) */}
              <div className="absolute right-0 top-1/2 z-20 w-[28%] -translate-y-1/2 overflow-hidden md:w-[25%] lg:right-12">
                <div className="relative aspect-[9/19] w-full">
                   {/* Notch Simulation */}
                  {/* <div className="absolute left-1/2 top-0 z-30 h-5 w-1/3 -translate-x-1/2 rounded-b-xl bg-black" /> */}
                  <Image
                    src="/images/kino-map/download-kinomap/right-mobile-img.png"
                    alt="Kinomap Mobile Interface"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
