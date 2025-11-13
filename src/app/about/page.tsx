// src/app/about/page.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      {/* --- HERO SECTION --- */}
      <div className="p-4 md:p-8">
        <section
          className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] flex flex-col justify-end p-6 sm:p-8 md:p-12 rounded-3xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('hero-slides/112.png')`,
          }}
        >
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-end">
            {/* Left Column */}
            <div className="max-w-md">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-light leading-tight tracking-wide text-white">
                Biscenic. Beyond Living.
              </h1>
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-4 sm:gap-6 max-w-sm justify-self-start md:justify-self-end text-left">
              <p className="text-base sm:text-lg md:text-xl font-extralight italic leading-relaxed text-white">
                Most homes are graveyards of objects. We resurrect matter into
                living artifacts, companions, not furniture.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* --- ABOUT US SECTION --- */}
      <section className="py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
              ABOUT US
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Founded on a refusal of lifeless luxury, Biscenic is a design
              atelier dedicated to resurrecting matter. We don&apos;t sell
              furniture; we create presence.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="mt-12 sm:mt-16 lg:mt-24">
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:gap-x-8 lg:grid-cols-2 lg:items-start">
              {/* Text Blocks */}
              <div className="space-y-8">
                {/* BLOCK 1 */}
                <div className="rounded-2xl bg-white dark:bg-black p-6 sm:p-8 shadow-sm ring-1 ring-black/10 dark:ring-white/10 transition-colors duration-300">
                  <h3 className="text-xs sm:text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Our Origins
                  </h3>
                  <p className="mt-2 sm:mt-3 text-lg sm:text-xl font-semibold text-black dark:text-white">
                    Founded in Lagos
                  </p>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    Biscenic was founded by Lomon Christopher, born from a
                    refusal of homes filled with objects that do not see their
                    inhabitants. Our journey began with a single question: what
                    if our surroundings were alive?
                  </p>
                </div>

                {/* BLOCK 2 */}
                <div className="rounded-2xl bg-white dark:bg-black p-6 sm:p-8 shadow-sm ring-1 ring-black/10 dark:ring-white/10 transition-colors duration-300">
                  <h3 className="text-xs sm:text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Our Philosophy
                  </h3>
                  <p className="mt-2 sm:mt-3 text-lg sm:text-xl font-semibold text-black dark:text-white">
                    Living Artifacts, Not Furniture
                  </p>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    We believe most homes are graveyards. Our work resurrects
                    matter into living artifacts that pulse with light and hold
                    memory. They are companions, not commodities.
                  </p>
                </div>

                {/* BLOCK 3 */}
                <div className="rounded-2xl bg-white dark:bg-black p-6 sm:p-8 shadow-sm ring-1 ring-black/10 dark:ring-white/10 transition-colors duration-300">
                  <h3 className="text-xs sm:text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Our Craft
                  </h3>
                  <p className="mt-2 sm:mt-3 text-lg sm:text-xl font-semibold text-black dark:text-white">
                    The Consecration of Matter
                  </p>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    This is not decoration; it is consecration. Each piece
                    integrates ritual, technology, and ancestral memory into
                    form, turning a house into a temple and a room into a
                    breathing presence.
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] lg:aspect-[5/6] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/About_us.png"
                  alt="The intricate craft of a Biscenic living artifact"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
