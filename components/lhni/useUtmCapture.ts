"use client";

import { useEffect, useState } from "react";

/**
 * UTM + click-ID capture for lead attribution.
 *
 * On first page load, reads UTM and click-ID parameters from the URL. If any are
 * present we persist them to sessionStorage so they survive subsequent navigation
 * (e.g. user lands on /lp/buyer?utm_source=google, browses a bit, eventually fills
 * the form — we still know they came from Google).
 *
 * Returns the most recent attribution params seen during this browser session.
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid", // Google click ID — present when ad-auto-tagging is on
  "fbclid", // Meta/Facebook click ID — auto-appended on Meta ad clicks
] as const;

type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>> & {
  landing_page?: string;
  referrer?: string;
};

const STORAGE_KEY = "lhni_attribution_v1";

export function useUtmCapture(): UtmParams {
  const [params, setParams] = useState<UtmParams>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Read from URL — if present, persist to sessionStorage
    const url = new URLSearchParams(window.location.search);
    const fromUrl: UtmParams = {};
    let foundAny = false;
    for (const key of UTM_KEYS) {
      const v = url.get(key);
      if (v) {
        fromUrl[key] = v;
        foundAny = true;
      }
    }

    if (foundAny) {
      // Add landing page + referrer for additional context
      fromUrl.landing_page = window.location.pathname;
      fromUrl.referrer = document.referrer || "";

      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      } catch {
        // Storage may be disabled in privacy mode — non-fatal
      }
      setParams(fromUrl);
      return;
    }

    // 2. Fall back to sessionStorage from prior page in this session
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UtmParams;
        setParams(parsed);
      }
    } catch {
      // Storage may be disabled — fall through with empty params
    }
  }, []);

  return params;
}

/**
 * Compact, human-readable representation for embedding in the lead note.
 * Returns "(no attribution data)" when nothing was captured.
 */
export function buildAttributionString(p: UtmParams): string {
  const entries = Object.entries(p).filter(([, v]) => v);
  if (entries.length === 0) return "(no attribution data)";
  return entries.map(([k, v]) => `${k}=${v}`).join(" | ");
}

/**
 * Best-guess channel based on captured params. Used for tagging the lead in FUB
 * so it can be filtered easily ("show me all Google leads").
 */
export function inferChannel(p: UtmParams): string {
  if (p.utm_source) {
    const s = p.utm_source.toLowerCase();
    if (s.includes("google")) return "google";
    if (s.includes("facebook") || s.includes("meta") || s.includes("instagram"))
      return "meta";
    return s;
  }
  if (p.gclid) return "google";
  if (p.fbclid) return "meta";
  return "organic";
}
