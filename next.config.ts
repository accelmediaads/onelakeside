import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images are pre-sized + compressed at build time (see public/one-lakeside),
  // so we skip the Next image optimizer and serve them directly. This also
  // sidesteps the dev-mode optimizer 404s.
  images: {
    unoptimized: true,
  },
  // Standalone site: the One Lakeside landing page IS the root (/). No
  // redirects or rewrites — unlike the multi-page LHNI app this was extracted
  // from, where "/" redirected to "/seller".
};

export default nextConfig;
