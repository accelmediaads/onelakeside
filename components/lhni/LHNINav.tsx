"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

type LenisLike = { scrollTo: (target: unknown, opts?: unknown) => void };

// Sections in page order — each id matches a <section id> in app/page.tsx.
const SECTIONS = [
  { label: "Overview", id: "overview" },
  { label: "Video Tour", id: "tour" },
  { label: "The Residences", id: "residences" },
  { label: "Amenities", id: "amenities" },
  { label: "Location", id: "location" },
];

const serif = { fontFamily: "var(--font-cormorant), Georgia, serif" };

export default function LHNINav() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // ESC to close + lock background scroll while the menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  // Smooth-scroll to a section and close the menu. Uses a numeric target
  // (reliable across Lenis versions), releases the scroll-lock synchronously so
  // the scroll can run, and forces past any paused state. Falls back to native
  // smooth scroll if Lenis isn't present.
  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    document.body.style.overflow = "";
    setOpen(false);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (lenis) lenis.scrollTo(top, { duration: 1.1, force: true });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          <Link href="/" className="block" onClick={close}>
            <Image
              src="/logos/lhni-logo-white.png"
              alt="Luxury Homes North Idaho"
              width={200}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-5">
            <a
              href="tel:2086596527"
              className="hidden sm:flex items-center gap-2 text-sm text-[#8a8a8a] hover:text-[#c9a96e] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              208-659-6527
            </a>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex flex-col items-center justify-center gap-[5px] w-10 h-10 -mr-1 text-[#eaeaea] hover:text-[#c9a96e] transition-colors"
            >
              <span className="block w-6 h-px bg-current" />
              <span className="block w-6 h-px bg-current" />
              <span className="block w-6 h-px bg-current" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-[#0d1216] text-white transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-8 h-full flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between h-20 shrink-0">
            <span className="uppercase tracking-[0.28em] text-xs font-medium text-[#e6d3a8]">
              One Lakeside
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="w-10 h-10 -mr-1 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Section links */}
          <div className="flex-1 flex flex-col justify-center gap-1 -mt-6 sm:-mt-10">
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={goTo(s.id)}
                className="group flex items-baseline gap-4 sm:gap-6 py-3 sm:py-4 border-b border-white/10"
              >
                <span className="text-[#b08d4f] text-xs sm:text-sm font-medium w-6 sm:w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={serif}
                  className="text-3xl sm:text-4xl md:text-5xl text-white group-hover:text-[#e6d3a8] transition-colors"
                >
                  {s.label}
                </span>
              </a>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="shrink-0 pb-10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <a
              href="#inquire"
              onClick={goTo("inquire")}
              className="inline-block text-center bg-[#b08d4f] hover:bg-[#c9a96e] text-white font-semibold tracking-wide px-7 py-3.5 rounded-lg transition-colors"
            >
              Request Pricing &amp; a Tour
            </a>
            <a
              href="tel:2086596527"
              className="text-white/70 hover:text-[#e6d3a8] transition-colors text-center sm:text-right"
            >
              Call 208-659-6527
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
