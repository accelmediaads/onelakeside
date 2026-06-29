"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { analyticsEnabled } from "@/lib/analyticsEnabled";

/**
 * Google tag (gtag.js) loader.
 *
 * This loads GA4 sitewide. Once GA4 is linked to Google Ads (Admin →
 * Product links → Google Ads links inside the GA4 property), GA4 events
 * become available as Google Ads conversions.
 *
 * Property: "LHNI Landing Pages" under the "Accel Media" GA4 account.
 *
 * Conversion events for buyer + seller form submits are fired from
 * `app/thank-you/page.tsx` as `lhni_buyer_lead` and `lhni_seller_lead`.
 * Mark those as Key events in GA4 → Admin → Events, then select them as
 * conversion sources in Google Ads.
 *
 * If the measurement ID is empty, this component renders nothing —
 * safe to ship.
 *
 * NOTE: The file/export is still named `GoogleAdsTag` for backward
 * compatibility with `layout.tsx`. Functionally it is now the GA4
 * Google tag.
 */
export const GA4_MEASUREMENT_ID = "G-YZGS3X48K6";

// Re-export under the old name so other files don't have to change.
// The constant `GOOGLE_ADS_ID` was the legacy AW-XXX value; thank-you
// now uses `GA4_MEASUREMENT_ID` directly via the named export above.

export default function GoogleAdsTag() {
  // Only load GA4 on a real production host — never on localhost or Netlify
  // preview deploys — so dev sessions don't pollute production analytics.
  // Starts false so SSR + first client render match, then flips on once the
  // host is confirmed in the browser. (See lib/analyticsEnabled.ts.)
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(analyticsEnabled());
  }, []);

  if (!GA4_MEASUREMENT_ID || !enabled) return null;

  return (
    <>
      {/* Base gtag.js loader */}
      <Script
        id="gtag-base"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
