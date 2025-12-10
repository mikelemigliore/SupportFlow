
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    // First check NextAuth session (Google/GitHub)
    const session = await auth();

    if (session?.user?.email) {
      // Optionally load from DB to get the real user row
      const user = await db.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        return NextResponse.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }

      // If session exists but no DB user 
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If no NextAuth session, fall back to your custom session-token logic
    const sessionToken = request.cookies.get("session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find session and user from your own session table
    const dbSession = await db.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!dbSession || dbSession.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: dbSession.user.id,
        name: dbSession.user.name,
        email: dbSession.user.email,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
