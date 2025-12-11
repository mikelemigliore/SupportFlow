// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Don’t try to bundle Prisma; load it from node_modules at runtime
//   serverExternalPackages: ['@prisma/client', 'prisma'],
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose DATABASE_URL during build so it exists in production
  env: {
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    GUEST_EMAIL: process.env.GUEST_EMAIL ?? "",
  },

  // Don’t try to bundle Prisma; load it from node_modules at runtime
  serverExternalPackages: ["@prisma/client", "prisma"],
};

module.exports = nextConfig;
