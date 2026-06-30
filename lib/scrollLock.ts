/**
 * Background scroll lock for fullscreen modals / lightboxes.
 *
 * Setting `overflow: hidden` alone does NOT stop Lenis smooth-scroll — the page
 * keeps drifting behind a fullscreen modal, which feels "sticky" on mobile. So
 * we also pause the Lenis instance (exposed on `window.__lenis` by
 * LenisProvider) and re-enable it on unlock. Safe to call when Lenis is absent.
 */
type LenisLike = { stop: () => void; start: () => void };

function getLenis(): LenisLike | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

export function lockScroll() {
  // Pausing Lenis is the key part — it's what was leaving the page "sticky"
  // behind a fullscreen modal. overflow:hidden backs it up. We deliberately do
  // NOT set touch-action:none on the body: it can disable pan/zoom gestures
  // inside the Matterport iframe and the lightbox swipe.
  getLenis()?.stop();
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  getLenis()?.start();
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}
