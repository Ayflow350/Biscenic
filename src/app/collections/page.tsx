"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* --- Card props type (moved above the data so it can be referenced) --- */
interface CollectionCardProps {
  title: string;
  imageUrl: string;
  href: string;
  isComingSoon: boolean;
  variant?: "cover" | "contain";
  description?: string;
}

/* --- Data (add descriptions if you want richer cards) --- */
const collectionsData: CollectionCardProps[] = [
  {
    title: "Atheris",
    imageUrl: "/collections/lite.png",
    href: "/products/atheris",
    isComingSoon: true,
    variant: "contain", // "contain" shows full image, "cover" crops for dramatic fill
    description: "Material study in form and line.",
  },
  {
    title: "Lumivase",
    imageUrl: "/hero-slides/lumivase/Edition.PNG",
    href: "/products/lumivase",
    isComingSoon: false,
    variant: "cover",
    description: "Where light becomes a material.",
  },
  {
    title: "B'elysium",
    imageUrl: "/collections/Bed.png",
    href: "/products/belysium",
    isComingSoon: false,
    variant: "contain",
    description: "A meditation on scale and texture.",
  },
];

function CollectionCard({
  title,
  imageUrl,
  href,
  isComingSoon,
  variant = "cover",
  description,
}: CollectionCardProps) {
  const ImageStyle = variant === "contain" ? "object-contain" : "object-cover";

  const content = (
    <article
      aria-labelledby={`col-${title}`}
      className={`group relative w-full rounded-2xl overflow-hidden transition-transform duration-400 ease-out transform will-change-transform
        bg-gradient-to-b from-transparent to-black/3
        hover:-translate-y-1 hover:shadow-2xl focus-within:-translate-y-1 focus-within:shadow-2xl`}
      tabIndex={isComingSoon ? -1 : 0}
    >
      {/* Frame/Canvas — fixed aspect ratio for visual uniformity */}
      <div className="relative w-full aspect-[4/5] bg-muted/30 dark:bg-muted/20">
        <Image
          src={imageUrl}
          alt={`${title} collection`}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className={`${ImageStyle} w-full h-full transition-transform duration-700 group-hover:scale-[1.03] group-focus:scale-[1.03]`}
          loading="lazy"
        />

        <div className="relative w-full h-[560px] sm:h-[420px] md:h-[520px] lg:h-[640px] bg-muted/30 dark:bg-muted/20 overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${title} collection`}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            /* use object-cover so the image fills the width and no side gaps remain */
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.03] group-focus:scale-[1.03]"
            loading="lazy"
          />

          {/* subtle gradient for text readability */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 to-transparent" />
        </div>
        {/* subtle gradient for text readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      {/* overlay center CTA (appears on hover/focus) */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"
        aria-hidden={isComingSoon}
      >
        {isComingSoon ? (
          <div
            role="button"
            aria-disabled
            className="rounded-md bg-[#be9e44] text-black px-6 py-2 text-sm font-semibold hover:bg-[#d1b56a] hover:bg-[#d1b56a]focus:outline-none focus:ring-4 focus:ring-amber-300/30"
          >
            <span className="animate-pulse">COMING SOON</span>
          </div>
        ) : (
          <Button
            asChild
            className="rounded-md bg-[#be9e44] text-black px-6 py-2 text-sm font-semibold hover:bg-[#d1b56a] hover:bg-[#d1b56a]focus:outline-none focus:ring-4 focus:ring-amber-300/30"
          >
            <Link href={href}>View Details</Link>
          </Button>
        )}
      </div>

      {/* corner badge for small metadata */}
      <div className="absolute top-4 left-4 rounded-full bg-black/40 text-xs px-3 py-1 text-white/90 backdrop-blur-sm">
        {isComingSoon ? "Soon" : "New"}
      </div>

      {/* footer content inside card bottom */}
      <div className="px-4 pb-5 pt-4">
        <h3
          id={`col-${title}`}
          className="text-lg font-semibold text-foreground"
        >
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </article>
  );

  return (
    <div className="flex flex-col">
      {isComingSoon ? <div>{content}</div> : <Link href={href}>{content}</Link>}
    </div>
  );
}

/* --- Main Page --- */
export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <header className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-extrabold tracking-tight">
            Collections
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-muted-foreground text-lg leading-relaxed">
            Discover curated pieces objects of presence, material and narrative,
            composed with restraint and warmth.
          </p>
        </header>

        <section aria-label="Collections grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collectionsData.map((c) => (
              <CollectionCard key={c.title} {...c} />
            ))}
          </div>
        </section>

        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-sm" />
          <div className="w-2 h-2 rounded-full bg-muted" />
        </div>

        <footer className="mt-14 text-center text-sm text-muted-foreground border-t border-border pt-8">
          © 2025 Biscenic — All rights reserved
        </footer>
      </div>
    </div>
  );
}
