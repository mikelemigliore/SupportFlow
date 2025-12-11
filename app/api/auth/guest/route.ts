import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSessionToken } from "@/lib/auth";

const DEFAULT_GUEST_EMAIL = "guest@cinepiks.com";

export async function POST(req: NextRequest) {
  try {
    const guestEmail = process.env.GUEST_EMAIL ?? DEFAULT_GUEST_EMAIL;
    console.log("[GUEST] guestEmail env value:", guestEmail);

    // Make sure guest user exists in the DB this app is actually using
    const user = await db.user.upsert({
      where: { email: guestEmail },
      create: {
        id: "guest-user", 
        email: guestEmail,
        name: "Guest User",
        password: "guest-placeholder-password-do-not-use",
      },
      update: {},
    });

    console.log("[GUEST] user from DB:", user);

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = await db.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
      },
    });

    console.log("[GUEST] session created:", session);

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
    console.error("[GUEST] signin error:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
