"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const topImages = [
  "/hero-slides/lumivase/1.PNG", // mobile only
  "/hero-slides/Herobed.png",
  "/hero-slides/115.PNG",
  "/hero-slides/3.JPG",
];

export function HeroSection() {
  // Slice the array to skip the first image for desktop slideshow
  const desktopImages = topImages.slice(1);

  return (
    <section className="relative h-[100vh] w-full flex flex-col items-center justify-center text-center text-white dark:text-white overflow-hidden">
      {/* === DESKTOP SLIDESHOW (skip first image) === */}
      <div className="absolute inset-0 z-[-2] hidden sm:block">
        {desktopImages.map((src, index) => (
          <div
            key={src}
            className="slide bg-center bg-cover absolute inset-0 opacity-0"
            style={{
              backgroundImage: `url(${src})`,
              animationDelay: `${index * 6}s`,
            }}
          />
        ))}
      </div>

      {/* === MOBILE SINGLE IMAGE === */}
      <div
        className="absolute inset-0 z-[-2] sm:hidden bg-center bg-cover"
        style={{ backgroundImage: `url(${topImages[0]})` }} // mobile first image
      />

      {/* === Overlay === */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/60 z-[-1]" />

      {/* === Hero Content === */}
      <div className="z-10 px-4">
        <h1 className="font-serif text-white dark:text-white text-3xl sm:text-6xl font-semibold leading-tight mb-6">
          Beyond Living
        </h1>
        <Link href="/collections">
          <Button
            size="lg"
            className="bg-[#be9e44] text-black  hover:bg-[#d1b56a] font-semibold px-8 py-6 text-sm"
          >
            Explore Collections
          </Button>
        </Link>
      </div>

      {/* === Footer === */}
      <footer className="absolute bottom-4 text-xs text-black dark:text-white z-10">
        &copy; 2025 Biscenic. All rights reserved.
      </footer>

      {/* === Animation Styles === */}
      <style jsx>{`
        .slide {
          animation: fade 24s infinite ease-in-out;
        }

        @keyframes fade {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          35% {
            opacity: 1;
          }
          45% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
