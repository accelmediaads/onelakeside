/**
 * Gate for analytics / advertising scripts (Meta Pixel, GA4).
 *
 * Returns `true` only on a real production host so local `npm run dev`
 * sessions and Netlify preview/branch deploys don't pollute the production
 * Meta Pixel and GA4 with junk events.
 *
 * Background: on 2026-06-10 a local dev session fired ~492 PageViews from
 * `localhost` into the live Meta Pixel in a single hour — the "June 10
 * PageView spike." This guard prevents that class of bug.
 *
 * Design: this is a *blocklist* of known non-production hosts, not an
 * allowlist of the prod domain. That way a future production domain change
 * can never silently disable tracking — the worst case here is a little
 * preview-deploy noise, never a dark production pixel.
 *
 * Must be called client-side (reads `window.location.hostname`); returns
 * `false` during SSR.
 */
export function analyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  if (!host) return false;
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") return false;
  if (host.endsWith(".local")) return false;
  if (host.endsWith(".netlify.app")) return false;
  return true;
}
