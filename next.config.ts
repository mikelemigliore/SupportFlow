
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // DB + guest
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    GUEST_EMAIL: process.env.GUEST_EMAIL ?? "",

    // Auth.js core
    AUTH_SECRET: process.env.AUTH_SECRET ?? "",
    AUTH_URL: process.env.AUTH_URL ?? "",

    // Google
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",

    // GitHub
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? "",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? "",

    //OpenAI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  },

  // Don’t try to bundle Prisma; load it from node_modules at runtime
  serverExternalPackages: ["@prisma/client", "prisma"],
};

module.exports = nextConfig;
