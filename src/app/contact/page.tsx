// src/app/contact/page.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      {/* --- HERO SECTION (unchanged) --- */}
      <div className="p-4 md:p-8">
        <section
          className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] flex flex-col justify-end p-6 sm:p-8 md:p-12 rounded-3xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('/Herofurn.png')`,
          }}
        >
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-wide text-white">
              We’d Love To Hear From You
            </h1>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl font-extralight italic leading-relaxed text-white">
              Whether you’re browsing, curious about a piece, or simply want to
              say hello — we’re here for you.
            </p>
          </div>
        </section>
      </div>

      {/* --- CONTACT SECTION --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-white dark:bg-black transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT SIDE: NEXT STEPS */}
          <div className="space-y-8">
            <h2 className="text-3xl font-semibold">Stay Connected</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Share your thoughts, ask questions, or get guidance on selecting
              the perfect piece for your space.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-black dark:bg-white dark:text-black text-white">
                  1
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">
                    We’ll help you choose the right furniture
                  </span>
                  <br />
                  We guide you to find suitable designs, materials, and pricing.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-black dark:bg-white dark:text-black text-white">
                  2
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">We match your style</span>
                  <br />
                  We help you discover the perfect blend of form and function.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-black dark:bg-white dark:text-black text-white">
                  3
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">
                    Enjoy premium craftsmanship
                  </span>
                  <br />
                  Your furniture is crafted and delivered with care.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM CARD */}
          <div className="bg-white dark:bg-black p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
              Tell us a little about what you’re looking for — we’ll get back to
              you shortly with helpful details.
              <span className="font-semibold">24 hours.</span>
            </h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  className="border rounded-lg p-3 w-full bg-transparent"
                />
                <input
                  type="email"
                  placeholder="Your e-mail"
                  className="border rounded-lg p-3 w-full bg-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Phone number"
                  className="border rounded-lg p-3 w-full bg-transparent"
                />
                <input
                  type="text"
                  placeholder="City"
                  className="border rounded-lg p-3 w-full bg-transparent"
                />
              </div>

              <textarea
                placeholder="Type your message here..."
                rows={6}
                className="border rounded-lg p-3 w-full bg-transparent"
              />

              <div className="border-dashed border-2 border-gray-400 rounded-xl p-8 text-center text-gray-500 dark:text-gray-300">
                DROP IT LIKE IT’S HOT
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition duration-300"
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
