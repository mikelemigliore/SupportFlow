import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session-token")?.value;

    if (token) {
      // delete session from DB
      await db.session.deleteMany({
        where: { token },
      });
    }

    // clear cookie
    const res = NextResponse.json({ message: "Signed out" });
    res.cookies.set("session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,        
      path: "/",                 
    });

    return res;
  } catch (err) {
    console.error("Signout error:", err);
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    );
  }
}