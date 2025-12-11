// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { generateSessionToken } from "@/lib/auth";

// const DEFAULT_GUEST_EMAIL = "guest@cinepiks.com";

// export async function POST(req: NextRequest) {
//   const guestEmail = process.env.GUEST_EMAIL ?? DEFAULT_GUEST_EMAIL;

//   try {
//     // STEP 1: find or create the guest user
//     let user;
//     try {
//       user = await db.user.upsert({
//         where: { email: guestEmail },
//         create: {
//           email: guestEmail,
//           name: "Guest User",
//         },
//         update: {},
//       });
//     } catch (err: any) {
//       return NextResponse.json(
//         {
//           step: "find_or_create_user",
//           error: "Internal server error",
//           detail: String(err?.message ?? err),
//         },
//         { status: 500 }
//       );
//     }

//     // STEP 2: generate session token
//     let sessionToken: string;
//     try {
//       sessionToken = generateSessionToken();
//     } catch (err: any) {
//       return NextResponse.json(
//         {
//           step: "generate_session_token",
//           error: "Internal server error",
//           detail: String(err?.message ?? err),
//         },
//         { status: 500 }
//       );
//     }

//     // STEP 3: create session in DB
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//     try {
//       await db.session.create({
//         data: {
//           userId: user.id,
//           token: sessionToken,
//           expiresAt,
//         },
//       });
//     } catch (err: any) {
//       return NextResponse.json(
//         {
//           step: "create_session",
//           error: "Internal server error",
//           detail: String(err?.message ?? err),
//         },
//         { status: 500 }
//       );
//     }

//     // STEP 4: set cookie + return
//     const res = NextResponse.json(
//       {
//         message: "Guest sign in successful",
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//         },
//       },
//       { status: 200 }
//     );

//     res.cookies.set("session-token", sessionToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       expires: expiresAt,
//     });

//     return res;
//   } catch (err: any) {
//     // super-catch (should rarely run now)
//     return NextResponse.json(
//       {
//         step: "outer_catch",
//         error: "Internal server error",
//         detail: String(err?.message ?? err),
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSessionToken } from "@/lib/auth";

const DEFAULT_GUEST_EMAIL = "guest@cinepiks.com";

export async function POST(req: NextRequest) {
  try {
    const guestEmail = process.env.GUEST_EMAIL ?? DEFAULT_GUEST_EMAIL;

    // 1. Make sure the guest user exists
    const user = await db.user.upsert({
      where: { email: guestEmail },
      create: {
        email: guestEmail,
        name: "Guest User",
      },
      update: {},
    });

    // 2. Create a session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 1000 * 7); // 7 days

    await db.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
      },
    });

    // 3. Set cookie + respond
    const res = NextResponse.json(
      {
        message: "Guest sign in successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    res.cookies.set("session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    return res;
  } catch (err: any) {
    console.error("Guest signin error:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        detail: String(err?.message ?? err),
      },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { generateSessionToken } from "@/lib/auth";

// const DEFAULT_GUEST_EMAIL = "guest@cinepiks.com";

// export async function POST(req: NextRequest) {
//   try {
//     // 1. Find the hardcoded guest user
//     const user = await db.user.findUnique({
//       where: { email: process.env.GUEST_EMAIL ?? DEFAULT_GUEST_EMAIL },
//     });

//     if (!user) {
//       console.log("user Error", user);
//       return NextResponse.json(
//         { error: "Guest user not found" },
//         { status: 500 }
//       );
//     }

//     // 2. Create a session
//     const sessionToken = generateSessionToken();
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//     await db.session.create({
//       data: {
//         userId: user.id,
//         token: sessionToken,
//         expiresAt,
//       },
//     });

//     // 3. Set cookie
//     const res = NextResponse.json(
//       {
//         message: "Guest sign in successful",
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//         },
//       },
//       { status: 200 }
//     );

//     res.cookies.set("session-token", sessionToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       expires: expiresAt,
//     });

//     return res;
//   } catch (err) {
//     console.error("Guest signin error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
