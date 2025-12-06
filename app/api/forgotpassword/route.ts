// app/api/forgotpassword/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { db } from "@/lib/db";

/**
 * Helper: build an SES client only if env vars exist.
 * This avoids crashing the build when keys are missing.
 */
function getSesClient() {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    console.log("Error");
    return null;
  }
  console.log("Works");
  return new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const email = "mikelemigliore@hotmail.com";
    //const { email } = await req.json();

    // if (!email) {
    //   return NextResponse.json({ error: "Email is required" }, { status: 400 });
    // }

    // // 1) Look up the user via Prisma
    // const existingUser = await db.user.findUnique({
    //   where: { email },
    // });

    // if (!existingUser) {
    //   // You can also return 200 here to avoid leaking which emails exist
    //   return NextResponse.json(
    //     { error: "Email does not exist" },
    //     { status: 400 }
    //   );
    // }

    // 2) Create raw token (for URL) and hashed token (stored in DB)
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 3) Save to user record
    // await db.user.update({
    //   where: { id: existingUser.id },
    //   data: {
    //     resetToken: hashedToken,
    //     resetTokenExpiry: expiresAt,
    //   },
    // });

    // 4) Build reset URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // adjust the path to match your actual reset page route
    const resetUrl = `${baseUrl}/resetpassword/${rawToken}`;

    // 5) Prepare SES client
    const ses = getSesClient();
    // if (!ses) {
    //   // roll back token if email service is not configured
    //   await db.user.update({
    //     where: { id: existingUser.id },
    //     data: {
    //       resetToken: null,
    //       resetTokenExpiry: null,
    //     },
    //   });

    //   return NextResponse.json(
    //     { error: "Email service not configured" },
    //     { status: 500 }
    //   );
    // }

    const fromAddress =
      // process.env.SES_FROM_EMAIL ||
      "Support Flow <no-reply@supportflow360.com>";

    const htmlBody = `
      <p>Hello,</p>
      <p>You requested to reset your Support Flow password.</p>
      <p>Click the link below to reset it (valid for 1 hour):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>– Support Flow</p>
    `;

    const command = new SendEmailCommand({
      Source: fromAddress,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: { Data: "Reset your Support Flow password" },
        Body: {
          Html: { Data: htmlBody },
        },
      },
    });

    const result = await ses?.send(command);

    // you can inspect result if you want, but usually just assume success
    console.log("SES send result:", result);

    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password route:", error);

    // You might optionally clear token on errors by querying again,
    // but usually if we failed before saving or sending it's fine.

    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 }
    );
  }
}
