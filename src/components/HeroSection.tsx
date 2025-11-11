"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const slideImages = [
  "/hero-slides/115.PNG",
  "/hero-slides/111.png",
  "/hero-slides/112.png",
  "/hero-slides/116.PNG",
  "/hero-slides/113.png",
];

export function HeroSection() {
  return (
    <section className="relative h-[500px] lg:h-[860px] w-full flex flex-col items-center justify-end text-center text-neutral-800 dark:text-white overflow-hidden pb-20 lg:pb-28">
      {/* Slideshow Container */}

      <div className="absolute top-0 left-0 w-full h-full z-[-2]">
        {slideImages.map((src, index) => (
          <div
            key={src}
            className="slide bg-center bg-no-repeat bg-contain sm:bg-cover transition-all duration-700 ease-in-out"
            style={{
              backgroundImage: `url(${src})`,
              animationDelay: `${index * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-white/30 dark:bg-black/60 z-[-1]" />

      {/* Hero Content */}
      <div className="z-10 px-4">
        <h1 className="font-serif text-black dark:text-white text-3xl sm:text-6xl font-semibold leading-tight mb-6">
          Beyond Living
        </h1>
        <Link href="/collections">
          <Button
            size="lg"
            className="bg-[#be9e44] text-black hover:bg-[#d1b56a] font-semibold px-8 py-6 text-sm"
          >
            Explore Collections
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-xs text-black dark:text-white z-10">
        &copy; 2025 Biscenic. All rights reserved.
      </footer>
    </section>
  );
}
