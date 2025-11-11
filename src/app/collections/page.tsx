"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";

// --- Data for our collection cards ---
const collectionsData = [
  {
    title: "Atheris",
    imageUrl: "/collections/Atheris.png",
    href: "/products/atheris",
    isComingSoon: true, // Use a clear property name
  },
  {
    title: "B'elysium",
    imageUrl: "/collections/BV.png",
    href: "/products/belysium",
    isComingSoon: false,
  },
  {
    title: "Lumivase",
    imageUrl: "/lumii2.png",
    href: "/products/lumivase",
    isComingSoon: false,
  },
];

// --- Reusable Collection Card Component ---
interface CollectionCardProps {
  title: string;
  imageUrl: string;
  href: string;
  isComingSoon: boolean;
}

function CollectionCard({
  title,
  imageUrl,
  href,
  isComingSoon,
}: CollectionCardProps) {
  const CardContent = (
    // Set the whole image area as the group for hover effects
    <div
      className={`
        group relative aspect-[4/3] w-full rounded-lg overflow-hidden transition-shadow duration-300 shadow-md 
        ${
          isComingSoon
            ? "cursor-not-allowed"
            : "cursor-pointer group-hover:shadow-xl"
        }
      `}
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={`A piece from the ${title} collection`}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        // 🚨 SMOOTH TRANSITION: Scale and slight dimming
        className="object-cover w-full h-full transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-90"
      />

      {/* 🚨 HOVER-TO-REVEAL OVERLAY (The core transition) */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center transition-opacity duration-300 
          bg-black/30 opacity-0 group-hover:opacity-100 
        `}
      >
        {/* Content inside the Overlay */}
        {isComingSoon ? (
          // 🚨 FIX: Coming Soon - Mimics Button style (variant="outline" look) but is a non-clickable div
          <div className="bg-[#be9e44] text-black hover:bg-[#d1b56a] px-8 py-3 text-sm tracking-wide transition-colors duration-200">
            COMING SOON
          </div>
        ) : (
          // 🚨 FIX: View Details - Mimics the Hero Button hover style

          <Button
            className="bg-[#be9e44] rounded-none text-black hover:bg-[#d1b56a] px-8 py-3 tracking-wide transition-colors duration-200"
            asChild
          >
            <Link href={href}>VIEW DETAILS</Link>
          </Button>
        )}
      </div>
    </div>
  );

  // 🚨 Title is always outside the CardContent div
  return (
    <div className="group block">
      {/* Image Card (clickable if not coming soon) */}
      {isComingSoon ? (
        <div className="block">{CardContent}</div> // Non-clickable div for coming soon
      ) : (
        <Link href={href} className="block">
          {" "}
          {/* Clickable link */}
          {CardContent}
        </Link>
      )}

      {/* 🚨 Title Displayed BELOW the Card */}
      <div className="mt-4 text-left">
        <h3 className="text-xl font-medium text-foreground tracking-wide group-hover:text-foreground/80 transition-colors duration-200">
          {title}
        </h3>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-8">
        <main className="pt-28 pb-20 md:pt-32 md:pb-28 text-center">
          {/* Change gold to theme-aware foreground/black */}
          <h2 className="font-serif text-5xl md:text-6xl text-foreground mb-4">
            Collections
          </h2>

          <p className="max-w-xl mx-auto text-muted-foreground mb-16">
            Discover curated pieces, each with a distinctive narrative and
            graceful sense of elegance.
          </p>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {collectionsData.map((collection, index) => (
              <CollectionCard
                key={index}
                title={collection.title}
                imageUrl={collection.imageUrl}
                href={collection.href}
                isComingSoon={collection.isComingSoon} // Pass the correct prop
              />
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-3">
            <div className="w-2 h-2 bg-muted rounded-full transition-colors duration-300"></div>
            {/* Change active dot from gold to theme-aware foreground/black */}
            <div className="w-2.5 h-2.5 bg-foreground rounded-full transition-colors duration-300"></div>
            <div className="w-2 h-2 bg-muted rounded-full transition-colors duration-300"></div>
          </div>
        </main>

        <footer className="py-8 border-t border-border text-center text-xs text-muted-foreground">
          © 2025 Biscenic. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
