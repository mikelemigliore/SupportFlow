
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSessionToken } from "@/lib/auth";

const GUEST_EMAIL = "guest@cinepiks.com";

export async function POST(req: NextRequest) {
  try {
    // 1. Find the hardcoded guest user
    const user = await db.user.findUnique({
      where: { email: GUEST_EMAIL },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Guest user not found" },
        { status: 500 }
      );
    }

    // 2. Create a session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
      },
    });

    // 3. Set cookie
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
  } catch (err) {
    console.error("Guest signin error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}