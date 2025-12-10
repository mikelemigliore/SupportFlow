
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt", 
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // On sign-in, create or update user in DB
    async signIn({ profile }) {
      if (!profile?.email) {
        throw new Error('No profile')
      }

      await prisma.user.upsert({
        where: { email: profile.email },
        create: {
          email: profile.email,
          name: "name" in profile ? (profile.name as string | null) ?? "" : "",
        },
        update: {
          name: "name" in profile ? (profile.name as string | null) ?? "" : "",
        },
      });

      return true;
    },

    // Attach DB user id to JWT
    async jwt({ token }) {
      if (!token.email) return token;

      const user = await prisma.user.findUnique({
        where: { email: token.email as string },
      });

      if (user) {
        (token as any).id = user.id;
      }

      return token;
    },

    // Expose id on session.user
    async session({ session, token }) {
      if (session.user && (token as any).id) {
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
});
