
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

async function getLoggedInUserId(req: NextRequest): Promise<string | null> {
  const sessionToken = req.cookies.get("session-token")?.value;

  if (sessionToken) {
    const dbSession = await db.session.findUnique({
      where: { token: sessionToken },
    });

    if (dbSession && dbSession.expiresAt >= new Date()) {
      return dbSession.userId;
    }
  }

  // Otherwise, fall back to NextAuth
  const session = await auth();

  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) return user.id;
  }

  return null;
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 }
      );
    }

    const account = await db.user.findUnique({ where: { id } });

    if (!account || account.id !== userId) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
