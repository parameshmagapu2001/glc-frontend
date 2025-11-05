import type { NextConfig } from "next";

interface EnvConfig {
  HOST_API_KEY: string;
  ASSETS_API: string;
  images: {
    domains: string[];
    remotePatterns: {
      protocol?: "http" | "https";
      hostname: string;
      pathname?: string;
    }[];
  };
}

const nextConfigMap: Record<string, EnvConfig> = {
  local: {
    HOST_API_KEY: "https://devapis.glctesting.com",
    ASSETS_API: "http://localhost:4000",
    images: {
      domains: ["glc-dev-resources.s3.ap-south-1.amazonaws.com"],
      remotePatterns: [
        { hostname: "s3-alpha-sig.figma.com" },
        {
          protocol: "https",
          hostname: "glc-dev-resources.s3.ap-south-1.amazonaws.com",
          pathname: "/**",
        },
      ],
    },
  },
  dev: {
    HOST_API_KEY: "https://devapis.glctesting.com",
    ASSETS_API: "http://dev.glctesting.com",
    images: {
      domains: ["glc-dev-resources.s3.ap-south-1.amazonaws.com"],
      remotePatterns: [
        { hostname: "s3-alpha-sig.figma.com" },
        {
          protocol: "https",
          hostname: "glc-dev-resources.s3.ap-south-1.amazonaws.com",
          pathname: "/**",
        },
      ],
    },
  },
  stage: {
    HOST_API_KEY: "https://stageapis.glctesting.com",
    ASSETS_API: "https://stage.glctesting.com",
    images: {
      domains: ["glc-dev-resources.s3.ap-south-1.amazonaws.com"],
      remotePatterns: [
        { hostname: "s3-alpha-sig.figma.com" },
        {
          protocol: "https",
          hostname: "glc-dev-resources.s3.ap-south-1.amazonaws.com",
        },
      ],
    },
  },
  uat: {
    HOST_API_KEY: "https://uatapis.glctesting.com",
    ASSETS_API: "https://uat.glctesting.com",
    images: {
      domains: ["glc-dev-resources.s3.ap-south-1.amazonaws.com"],
      remotePatterns: [
        { hostname: "s3-alpha-sig.figma.com" },
        {
          protocol: "https",
          hostname: "glc-dev-resources.s3.ap-south-1.amazonaws.com",
        },
      ],
    },
  },
  prod: {
    HOST_API_KEY: "https://apis.glctesting.com",
    ASSETS_API: "https://www.glctesting.com",
    images: {
      domains: ["glc-dev-resources.s3.ap-south-1.amazonaws.com"],
      remotePatterns: [
        { hostname: "s3-alpha-sig.figma.com" },
        {
          protocol: "https",
          hostname: "glc-dev-resources.s3.ap-south-1.amazonaws.com",
        },
      ],
    },
  },
};

// Select current environment
const selectedEnv = process.env.NEXT_PUBLIC_ENV || "prod";
const environmentConfig = nextConfigMap[selectedEnv];

// ✅ Separate env and images (fixes the typing error)
const config: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  env: {
    HOST_API_KEY: environmentConfig.HOST_API_KEY,
    ASSETS_API: environmentConfig.ASSETS_API,
  },
  images: environmentConfig.images,
};

console.log("🔹 NEXT_PUBLIC_ENV:", selectedEnv);
export default config;
