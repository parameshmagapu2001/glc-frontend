/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.glctesting.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
    ],
  },

  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api",
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  swcMinify: true,
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  output: "standalone",
};

module.exports = nextConfig;
