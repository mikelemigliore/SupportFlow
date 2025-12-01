// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don’t try to bundle Prisma; load it from node_modules at runtime
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

module.exports = nextConfig