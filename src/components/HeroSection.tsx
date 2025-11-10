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
    <section className="relative flex flex-col items-center justify-center text-center text-neutral-800 dark:text-white overflow-hidden min-h-[100vh] sm:min-h-[90vh] md:min-h-[95vh] lg:min-h-[100vh]">
      {/* Slideshow Background */}
      <div className="absolute inset-0 z-[-2]">
        {slideImages.map((src, index) => (
          <div
            key={src}
            className="slide"
            style={{
              backgroundImage: `url(${src})`,
              animationDelay: `${index * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/60 z-[-1]" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-10 lg:px-20 text-center">
        <h1 className="font-serif text-black dark:text-white text-3xl sm:text-4xl md:text-6xl font-semibold leading-snug sm:leading-tight md:leading-tight mb-6 drop-shadow-md">
          Beyond Living
        </h1>

        <Link href="/collections">
          <Button
            size="lg"
            className="bg-[#be9e44] text-black hover:bg-[#d1b56a] font-semibold px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base rounded-lg shadow-lg"
          >
            Explore Collections
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 md:bottom-6 text-xs sm:text-sm text-black dark:text-white z-10 px-4 text-center">
        &copy; 2025 Biscenic. All rights reserved.
      </footer>

      {/* Background Animation Styles */}
      <style jsx>{`
        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          opacity: 0;
          animation: fade 30s infinite;
          transition: all 0.5s ease;
        }

        /* Parallax for large screens */
        @media (min-width: 1024px) {
          .slide {
            background-attachment: fixed;
            background-size: cover;
          }
        }

        /* Mobile — shorter height, maintain good coverage */
        @media (max-width: 768px) {
          section {
            min-height: 80vh; /* shorter hero height on mobile */
          }

          .slide {
            height: 70vh;
            background-size: contain;
            background-position: center top; /* keep upper portion visible */
          }
        }

        @keyframes fade {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          30% {
            opacity: 1;
          }
          40% {
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
