"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const topImages = [
  "/hero-slides/115.PNG",
  "/hero-slides/111.png",
  "/hero-slides/112.png",
];
const bottomImages = [
  "/hero-slides/lumivase/1.PNG",
  "/hero-slides/lumivase/2.png",
  "/hero-slides/lumivase/3.png",
];

export function HeroSection() {
  return (
    <section className="relative h-[100vh] w-full flex flex-col items-center justify-center text-center text-neutral-800 dark:text-white overflow-hidden">
      {/* === DESKTOP SLIDESHOW (Top images only) === */}
      <div className="absolute inset-0 z-[-2] hidden sm:block">
        {topImages.map((src, index) => (
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

      {/* === MOBILE DOUBLE SLIDESHOW === */}
      <div className="absolute inset-0 z-[-2] flex flex-col sm:hidden">
        {/* Top half */}
        <div className="relative w-full h-1/2 overflow-hidden">
          {topImages.map((src, index) => (
            <div
              key={`top-${index}`}
              className="top-slide absolute inset-0 bg-center bg-cover opacity-0"
              style={{
                backgroundImage: `url(${src})`,
                animationDelay: `${index * 8}s`, // slower top sequence
              }}
            />
          ))}
        </div>

        {/* Bottom half (only mobile) */}
        <div className="relative w-full h-1/2 overflow-hidden">
          {bottomImages.map((src, index) => (
            <div
              key={`bottom-${index}`}
              className="bottom-slide absolute inset-0 bg-center bg-cover opacity-0"
              style={{
                backgroundImage: `url(${src})`,
                animationDelay: `${index * 8 + 4}s`, // 4s offset for staggered transition
              }}
            />
          ))}
        </div>
      </div>

      {/* === Overlay === */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/60 z-[-1]" />

      {/* === Hero Content === */}
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

      {/* === Footer === */}
      <footer className="absolute bottom-4 text-xs text-black dark:text-white z-10">
        &copy; 2025 Biscenic. All rights reserved.
      </footer>

      {/* === Animation Styles === */}
      <style jsx>{`
        .slide,
        .top-slide,
        .bottom-slide {
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
