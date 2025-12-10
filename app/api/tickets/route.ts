
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

// Helper to get logged-in userId from NextAuth OR custom session-token
async function getLoggedInUserId(req: NextRequest): Promise<string | null> {
  // Prefer custom session-token if it exists
  const sessionToken = req.cookies.get("session-token")?.value;

  if (sessionToken) {
    const dbSession = await db.session.findUnique({
      where: { token: sessionToken },
    });

    if (dbSession && dbSession.expiresAt >= new Date()) {
      return dbSession.userId;
    }
  }

  const session = await auth();

  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) return user.id;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();


    const {
      type,
      date,
      text,
      source,
      summary,
      category,
      priority,
      team,
      suggestedReply,
      automationIdea,
      name,
    } = body;

    if (
      !type ||
      !date ||
      !text ||
      !source ||
      !summary ||
      !category ||
      !priority ||
      !team ||
      !suggestedReply ||
      !automationIdea ||
      !name
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ticket = await db.tickets.create({
      data: {
        type,
        userId, 
        date,
        text,
        source,
        summary,
        category,
        priority,
        team,
        suggestedReply,
        automationIdea,
        name,
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err) {
    console.error("Error creating ticket:", err);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const tickets = await db.tickets.findMany({
      where: { userId },
      orderBy: [{ date: "desc" }],
    });

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
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
        { error: "Ticket id is required" },
        { status: 400 }
      );
    }

    const ticket = await db.tickets.findUnique({ where: { id } });

    if (!ticket || ticket.userId !== userId) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    await db.tickets.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
