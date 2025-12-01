// // app/api/tickets/route.ts
// export const runtime = "nodejs";

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function POST(req: any) {
//   try {
//     const body = await req.json();

//     console.log("Received ticket data:", body);

//     const {
//       userId,
//       date,
//       text,
//       source,
//       summary,
//       category,
//       priority,
//       team,
//       suggestedReply,
//       automationIdea,
//     } = body;

//     // Very basic validation – you can tighten this later
//     if (
//       !userId ||
//       !date ||
//       !text ||
//       !source ||
//       !summary ||
//       !category ||
//       !priority ||
//       !team ||
//       !suggestedReply ||
//       !automationIdea
//     ) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const ticket = await db.tickets.create({
//       data: {
//         userId,
//         date,
//         text,
//         source,
//         summary,
//         category,
//         priority,
//         team,
//         suggestedReply,
//         automationIdea,
//       },
//     });

//     return NextResponse.json({ ticket }, { status: 201 });
//   } catch (err) {
//     console.error("Error creating ticket:", err);
//     return NextResponse.json(
//       { error: "Failed to create ticket" },
//       { status: 500 }
//     );
//   }
// }

// // GET /api/tickets – fetch tickets for the logged-in user
// export async function GET(req: any) {
//   try {
//     // Read the session token from cookies
//     const sessionToken = req.cookies.get("session-token")?.value;

//     if (!sessionToken) {
//       return NextResponse.json(
//         { error: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     // Lookup valid session
//     const session = await db.session.findUnique({
//       where: { token: sessionToken },
//     });

//     if (!session) {
//       return NextResponse.json(
//         { error: "Invalid or expired session" },
//         { status: 401 }
//       );
//     }

//     // Get all tickets belonging to logged-in user
//     const tickets = await db.tickets.findMany({
//       where: { userId: session.userId },
//       orderBy: { date: "desc" },
//     });

//     return NextResponse.json({ tickets }, { status: 200 });
//   } catch (err) {
//     console.error("Error fetching tickets:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch tickets" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: any) {
//   //console.log("Req", req);
//   try {
//     // auth, same as in GET
//     const sessionToken = req.cookies.get("session-token")?.value;

//     if (!sessionToken) {
//       return NextResponse.json(
//         { error: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     const session = await db.session.findUnique({
//       where: { token: sessionToken },
//     });

//     if (!session) {
//       return NextResponse.json(
//         { error: "Invalid or expired session" },
//         { status: 401 }
//       );
//     }

//     // read ticket id from body
//     const { id } = await req.json();
//     console.log("id", id);

//     if (!id) {
//       return NextResponse.json(
//         { error: "Ticket id is required" },
//         { status: 400 }
//       );
//     }

//     // make sure the ticket exists and belongs to this user
//     const ticket = await db.tickets.findUnique({ where: { id } });

//     if (!ticket || ticket.userId !== session.userId) {
//       return NextResponse.json(
//         { error: "Ticket not found" },
//         { status: 404 }
//       );
//     }

//     await db.tickets.delete({ where: { id } });

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (err) {
//     console.error("Error deleting ticket:", err);
//     return NextResponse.json(
//       { error: "Failed to delete ticket" },
//       { status: 500 }
//     );
//   }
// }

// app/api/tickets/route.ts
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

/* POST /api/tickets create a ticket for the logged-in user */
export async function POST(req: NextRequest) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    console.log("Received ticket data:", body);

    const {
      date,
      text,
      source,
      summary,
      category,
      priority,
      team,
      suggestedReply,
      automationIdea,
    } = body;

    // Note: we NO LONGER accept userId from the client
    if (
      !date ||
      !text ||
      !source ||
      !summary ||
      !category ||
      !priority ||
      !team ||
      !suggestedReply ||
      !automationIdea
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ticket = await db.tickets.create({
      data: {
        userId, // taken from session, not from the body
        date,
        text,
        source,
        summary,
        category,
        priority,
        team,
        suggestedReply,
        automationIdea,
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

/* GET /api/tickets fetch tickets for the logged-in user */
export async function GET(req: NextRequest) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const tickets = await db.tickets.findMany({
      where: { userId },
      orderBy: { date: "desc" },
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

/* DELETE /api/tickets delete a ticket belonging to the logged-in user */
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await req.json();
    console.log("id", id);

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
