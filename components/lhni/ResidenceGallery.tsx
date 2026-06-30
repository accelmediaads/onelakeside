"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback, useRef } from "react";

interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Per-residence photo gallery with a click-to-open lightbox.
 *
 * Renders a large hero image plus a thumbnail strip. Clicking any image opens a
 * full-screen lightbox that scrolls through ALL of that residence's photos via
 * on-screen arrows, keyboard (←/→/Esc), or swipe on touch. Plain <img> is used
 * throughout (images are pre-sized and `images.unoptimized` is on), which keeps
 * the lightbox reliable — no optimizer round-trips or lazy-load deferral.
 */
export default function ResidenceGallery({
  name,
  images,
}: {
  name: string;
  images: GalleryImage[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  // Keyboard nav + background scroll lock while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  const hero = images[0];
  const thumbs = images.slice(1);
  const MAX_THUMBS = 4;
  const visibleThumbs = thumbs.slice(0, MAX_THUMBS);
  const extra = thumbs.length - visibleThumbs.length;

  return (
    <div>
      {/* Hero — click to open at index 0 */}
      <button
        type="button"
        onClick={() => setIndex(0)}
        className="ol-zoom group relative block w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg cursor-zoom-in"
        aria-label={`Open ${name} photo gallery`}
      >
        <img
          src={hero.src}
          alt={hero.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#10171c]/0 group-hover:bg-[#10171c]/15 transition-colors" />
        {/* Photo count pill */}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-[#10171c]/70 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 12.75h.008v.008H3v-.008z m0 0a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
          </svg>
          {images.length} photos
        </span>
      </button>

      {/* Thumbnail strip */}
      <div className="grid grid-cols-4 gap-3 mt-3">
        {visibleThumbs.map((img, i) => {
          const realIndex = i + 1;
          const isLastWithMore = i === visibleThumbs.length - 1 && extra > 0;
          return (
            <button
              type="button"
              key={img.src}
              onClick={() => setIndex(realIndex)}
              className="ol-zoom relative aspect-square rounded-lg overflow-hidden cursor-zoom-in"
              aria-label={`View ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {isLastWithMore && (
                <span className="absolute inset-0 bg-[#10171c]/60 flex items-center justify-center text-white text-lg font-semibold">
                  +{extra}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {open && index !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 flex flex-col select-none"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo ${index + 1} of ${images.length}`}
          onClick={close}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (dx > 50) prev();
            else if (dx < -50) next();
            touchStartX.current = null;
          }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-5 py-4 text-white/90"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm tracking-wide">
              <span className="text-[#e6d3a8]">{name}</span>
              <span className="text-white/50">
                {" "}
                · {index + 1} / {images.length}
              </span>
            </p>
            <button
              type="button"
              onClick={close}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close gallery"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image + arrows */}
          <div
            className="flex-1 flex items-center justify-center gap-2 sm:gap-4 px-3 sm:px-6 pb-3 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={prev}
              className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous photo"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            <img
              src={images[index].src}
              alt={images[index].alt}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />

            <button
              type="button"
              onClick={next}
              className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next photo"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Caption */}
          <div
            className="px-5 pb-5 text-center text-white/70 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {images[index].alt}
          </div>
        </div>
      )}
    </div>
  );
}
