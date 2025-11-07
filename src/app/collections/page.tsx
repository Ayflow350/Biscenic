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
    isFeatured: true, // Flag for the wide layout
  },
  {
    title: "B'elysium",
    imageUrl: "/collections/BV.png",
    href: "/products/belysium", // Links to the B'elysium product page
    isFeatured: false,
  },
  {
    title: "Lumivase",
    imageUrl: "/products/lumivase/image1.jpg",
    href: "/products/lumivase", // Links to the Lumivase product page
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
  return (
    <Link
      href={href}
      className="group relative aspect-[4/3] w-full rounded-lg overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={`A piece from the ${title} collection`}
        fill={true}
        sizes="(max-width: 640px) 100vw, 50vw"
        // ✅ THE ONLY CHANGE IS HERE: from 'object-contain' to 'object-cover'
        className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/50" />

      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-serif text-2xl font-semibold tracking-widest text-white">
          {title}
        </span>
      </div>
    </Link>
  );
}

// --- Main Page Component ---
export default function CollectionsPage() {
  return (
    // CHANGED: Using theme variables for proper light/dark mode
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-8">
        {/* ADDED: Padding-top to avoid content hiding under the fixed header */}
        <main className="pt-28 pb-20 md:pt-32 md:pb-28 text-center">
          {/* CHANGED: Using custom brand color class */}
          <h2 className="font-serif text-5xl md:text-6xl text-brand-gold mb-4">
            Collections
          </h2>

          {/* CHANGED: Using theme variable for muted text */}
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

        {/* Simplified Footer for consistency */}
        <footer className="py-8 border-t border-border text-center text-xs text-muted-foreground">
          © 2025 Biscenic. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
