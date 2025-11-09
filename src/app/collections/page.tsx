"use client";

import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

// --- Data for our collection cards ---
const collectionsData = [
  {
    title: "Atheris",
    imageUrl: "/collections/Atheris.png",
    href: "/products/atheris", // Links to the Atheris product page
    isFeatured: true,
  },
  {
    title: "B'elysium",
    imageUrl: "/collections/BV.png",
    href: "/products/belysium",
    isFeatured: false,
  },
  {
    title: "Lumivase",
    imageUrl: "/lumii2.png",
    href: "/products/lumivase",
    isFeatured: false,
  },
];

// --- Reusable Collection Card Component ---
interface CollectionCardProps {
  title: string;
  imageUrl: string;
  href: string;
}

function CollectionCard({ title, imageUrl, href }: CollectionCardProps) {
  const isComingSoon = title === "Atheris"; // 👈 Special case

  const CardContent = (
    <div
      className={`group relative aspect-[4/3] w-full rounded-lg overflow-hidden ${
        isComingSoon ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={`A piece from the ${title} collection`}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/50" />

      {/* Centered Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-2xl font-semibold tracking-widest text-white">
          {title}
        </span>

        {/* 👇 “Coming Soon” text only appears on hover for Atheris */}
        {isComingSoon && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-300 mt-2">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );

  // 👇 Make Atheris unclickable (no link)
  return isComingSoon ? CardContent : <Link href={href}>{CardContent}</Link>;
}

// --- Main Page Component ---
export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-8">
        <main className="pt-28 pb-20 md:pt-32 md:pb-28 text-center">
          <h2 className="font-serif text-5xl md:text-6xl text-brand-gold mb-4">
            Collections
          </h2>

          <p className="max-w-xl mx-auto text-muted-foreground mb-16">
            Explore our curated collections, each with a distinct narrative and
            aesthetic, designed to bring timeless elegance to your space.
          </p>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {collectionsData.map((collection, index) => (
              <CollectionCard
                key={index}
                title={collection.title}
                imageUrl={collection.imageUrl}
                href={collection.href}
              />
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-3">
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-brand-gold rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
          </div>
        </main>

        <footer className="py-8 border-t border-border text-center text-xs text-muted-foreground">
          © 2025 Biscenic. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
