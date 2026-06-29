"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { analyticsEnabled } from "@/lib/analyticsEnabled";

const PIXEL_ID = "2135934930019101";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Re-fires `PageView` on every SPA route change. Without this, only the
 * first page load would track — Next.js client navigation doesn't re-run
 * the base Pixel script, so we have to dispatch PageViews manually.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || !window.fbq) return;
    window.fbq("track", "PageView");
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixel() {
  // Only fire the pixel on a real production host — never on localhost or
  // Netlify preview deploys. Starts false so SSR + first client render match
  // (no hydration mismatch), then flips on once we confirm the host in the
  // browser. Prevents dev sessions from polluting the live pixel (the
  // 2026-06-10 "PageView spike" was 492 events fired from localhost).
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(analyticsEnabled());
  }, []);

  return (
    <>
      {enabled && (
        <>
          <Script id="meta-pixel-base" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <Suspense fallback={null}>
            <PageviewTracker />
          </Suspense>
        </>
      )}
      <noscript>
        {/* Fallback for users with JavaScript disabled */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
