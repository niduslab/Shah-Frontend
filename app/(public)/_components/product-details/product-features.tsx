import Image from "next/image";
import { Check } from "lucide-react";

export function ProductFeatures() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex flex-col gap-24">
          
          {/* Section 1: Transform your home */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative h-[550px] w-full max-w-[630px] overflow-hidden rounded-[2px]">
              <Image
                src="/images/product-details/class-gym.png"
                alt="Man running on treadmill in a modern living room"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold leading-tight text-black md:text-4xl">
                Transform your home into a world class gym
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                The COMMERCIAL 1750 brings professional-grade training to your living
                space. With whisper-quiet operation and a space-saving folding design, you
                can push your limits without disturbing your household. The Reflex™
                cushioning system reduces impact by up to 30%, protecting your joints
                while you chase your goals.
              </p>
              
              <ul className="flex flex-col gap-4 mt-2">
                {[
                  "Spacesaver® Design with EasyLift™ Assist",
                  "Runners Flex™ Cushioning",
                  "Automatic Trainer Control"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8B4513] text-white">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 2: Immersive training */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6 order-2 lg:order-1">
              <h2 className="text-3xl font-bold leading-tight text-black md:text-4xl">
                Immersive training with iFIT® technology
              </h2>
              <div className="flex flex-col gap-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Stream thousands of on-demand workouts led by world-class trainers. The
                  14” HD touchscreen brings you to exotic locations worldwide, from
                  mountain trails to beach runs. Your trainer automatically adjusts your speed
                  and incline, so you can focus on the experience.
                </p>
                <p>
                  Track your progress with personalized recommendations that adapt to your
                  fitness level. Whether you’re a beginner or marathon runner, iFIT creates a
                  program tailored just for you.
                </p>
              </div>
            </div>
            <div className="relative h-[550px] w-full max-w-[630px] overflow-hidden rounded-[2px] order-1 lg:order-2">
              <Image
                src="/images/product-details/ifit.png"
                alt="Close up of the treadmill console showing workout metrics"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
