import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { db } from "@/lib/db"; 

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
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
    // 1. On sign-in, create or update user in DB
    async signIn({ user, profile, account }) {
      const email = user?.email ?? (profile as any)?.email ?? null;

      if (!email) {
        console.error("signIn: missing email", { user, profile, account });
        // false = show "Access Denied" page
        return false;
      }

      try {
        const name =
          typeof user?.name === "string"
            ? user.name
            : typeof (profile as any)?.name === "string"
            ? (profile as any).name
            : "";

        await db.user.upsert({
          where: { email },
          create: { email, name },
          update: { name },
        });

        return true;
      } catch (err) {
        console.error("signIn Prisma error:", err);
        // you can choose true (let them in anyway) or false (Access Denied)
        return false;
      }
    },

    // 2. Attach DB user id to JWT
    async jwt({ token }) {
      if (!token.email) return token;

      try {
        const user = await db.user.findUnique({
          where: { email: token.email as string },
        });

        if (user) {
          (token as any).id = user.id;
        }
      } catch (err) {
        console.error("jwt Prisma error:", err);
      }

      return token;
    },

    // 3. Expose id on session.user
    async session({ session, token }) {
      if (session.user && (token as any).id) {
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
});

// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import GitHub from "next-auth/providers/github";
// import { prisma } from "@/lib/prisma";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   trustHost: true,
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     GitHub({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     // On sign-in, create or update user in DB
//     async signIn({ profile }) {
//       if (!profile?.email) {
//         throw new Error('No profile')
//       }

//       await prisma.user.upsert({
//         where: { email: profile.email },
//         create: {
//           email: profile.email,
//           name: "name" in profile ? (profile.name as string | null) ?? "" : "",
//         },
//         update: {
//           name: "name" in profile ? (profile.name as string | null) ?? "" : "",
//         },
//       });

//       return true;
//     },

//     // Attach DB user id to JWT
//     async jwt({ token }) {
//       if (!token.email) return token;

//       const user = await prisma.user.findUnique({
//         where: { email: token.email as string },
//       });

//       if (user) {
//         (token as any).id = user.id;
//       }

//       return token;
//     },

//     // Expose id on session.user
//     async session({ session, token }) {
//       if (session.user && (token as any).id) {
//         (session.user as any).id = (token as any).id;
//       }
//       return session;
//     },
//   },
// });

// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import GitHub from "next-auth/providers/github";
// // import { prisma } from "@/lib/prisma"; // temporarily unused

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   trustHost: true,
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     GitHub({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, profile, account }) {
//       console.log("signIn callback:", { email: user?.email, provider: account?.provider });
//       // Just always allow, no DB yet
//       return true;
//     },
//     async jwt({ token }) {
//       return token;
//     },
//     async session({ session, token }) {
//       return session;
//     },
//   },
// });
