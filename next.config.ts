import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'fdn2.gsmarena.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
      { protocol: 'https', hostname: '1000logos.net' },
      { protocol: 'https', hostname: 'cms-assets.xboxservices.com' },
      { protocol: 'https', hostname: 'assets.nintendo.com' },
      { protocol: 'https', hostname: 'gmedia.playstation.com' },
      { protocol: 'https', hostname: 'www.sony.co.in' },
      { protocol: 'https', hostname: 'www.lg.com' },
      { protocol: 'https', hostname: 'i01.appmifile.com' },
      { protocol: 'https', hostname: 'images.samsung.com' },
    ],
  },
};

export default nextConfig;
