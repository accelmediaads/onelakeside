"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

interface ResidenceMediaProps {
  name: string; // e.g. "Residence 401"
  matterportId?: string; // Matterport model id; tour button hidden if absent
  floorPlanSrc?: string; // /one-lakeside/...-floor-plan.jpg; button hidden if absent
}

type ModalKind = "tour" | "plan" | null;

/**
 * Per-residence media actions: a 3D walkthrough and a 2D floor plan.
 *
 * Performance: the Matterport viewer is heavy (WebGL + a few MB of JS), so it is
 * NOT embedded inline. The iframe only mounts when the user opens the modal and
 * unmounts when they close it — initial page load pays nothing for the tours,
 * no matter how many residences are on the page. The floor plan is likewise
 * loaded on demand.
 */
export default function ResidenceMedia({
  name,
  matterportId,
  floorPlanSrc,
}: ResidenceMediaProps) {
  const [modal, setModal] = useState<ModalKind>(null);

  // Close on ESC + lock background scroll (pauses Lenis) while a modal is open.
  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [modal]);

  const btn =
    "inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-colors";

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {matterportId && (
          <button
            type="button"
            onClick={() => setModal("tour")}
            className={`${btn} bg-[#1f2a30] text-white hover:bg-[#2c3a42]`}
            aria-label={`Open the 3D virtual tour of ${name}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c0-1.064.71-1.998 1.737-2.282l6-1.667a2.25 2.25 0 0 1 1.026 0l6 1.667a2.37 2.37 0 0 1 1.737 2.282v4.448c0 1.064-.71 1.998-1.737 2.282l-6 1.667a2.25 2.25 0 0 1-1.026 0l-6-1.667A2.37 2.37 0 0 1 3.75 14.224V9.776Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M3.95 8.5 12 11l8.05-2.5" />
            </svg>
            3D Tour
          </button>
        )}
        {floorPlanSrc && (
          <button
            type="button"
            onClick={() => setModal("plan")}
            className={`${btn} border border-[#c9c2b5] text-[#1f2a30] hover:border-[#b08d4f] hover:text-[#b08d4f]`}
            aria-label={`View the floor plan of ${name}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75h16.5v16.5H3.75V3.75Zm0 6.75h9m-9 0V20.25m9-9.75v9.75m0-9.75h7.5m-7.5 9.75h7.5M3.75 10.5v-6.75"
              />
            </svg>
            Floor Plan
          </button>
        )}
      </div>

      {/* Modal — portaled to <body> so `position: fixed` is relative to the
          viewport, not the GSAP-transformed FadeIn wrapper this lives inside
          (a transformed ancestor becomes the containing block for fixed
          children, which otherwise renders the modal offset down the page). */}
      {modal &&
        createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} ${modal === "tour" ? "3D tour" : "floor plan"}`}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — prominent, labeled close so it's obvious + thumb-sized on mobile */}
            <div className="flex items-center justify-between mb-3 gap-3">
              <p className="text-white/90 text-sm tracking-wide truncate">
                <span className="text-[#e6d3a8]">{name}</span>{" "}
                — {modal === "tour" ? "3D Virtual Tour" : "Floor Plan"}
              </p>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="shrink-0 inline-flex items-center gap-2 bg-white text-[#1f2a30] hover:bg-white/90 transition-colors rounded-full pl-3 pr-4 py-2.5 text-sm font-semibold shadow-lg"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>

            {modal === "tour" && matterportId && (
              <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-2xl">
                <div className="relative pb-[62%] sm:pb-[56.25%] h-0">
                  <iframe
                    // Lazily mounted only while open — closing unmounts it.
                    src={`https://my.matterport.com/show/?m=${matterportId}&brand=0&play=1`}
                    title={`${name} — Matterport 3D tour`}
                    allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {modal === "plan" && floorPlanSrc && (
              <div className="w-full rounded-xl overflow-hidden bg-white shadow-2xl">
                {/* Plain <img>, eagerly loaded: floor plans are static pre-sized
                    JPGs, so they skip the Next image optimizer (which 404s in dev)
                    and never defer behind lazy-loading inside this on-click modal. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={floorPlanSrc}
                  alt={`${name} floor plan at One Lakeside`}
                  loading="eager"
                  className="w-full max-h-[80vh] object-contain p-2"
                />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
