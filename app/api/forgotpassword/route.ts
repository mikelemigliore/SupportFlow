// app/api/forgotpassword/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILSEND_API_TOKEN || "",
});

export async function POST(req: NextRequest) {
  try {
    //const email = "mikelemigliore@hotmail.com";
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Email does not exist" },
        { status: 400 }
      );
    }

    // 1) Generate token (raw for URL, hashed for DB)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 2) Save to DB (uncomment when ready)
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: expiresAt,
      },
    });

    // 3) Build reset URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/resetpassword/${rawToken}`;

    // 4) Prepare email content
    const fromEmail = "no-reply@supportflow360.com"; // MUST be from your verified MailerSend domain
    const fromName = "Support Flow";

    const htmlBody = `
      <p>Hello,</p>
      <p>You requested to reset your Support Flow password.</p>
      <p>Click the link below to reset it (valid for 1 hour):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>– Support Flow</p>
    `;

    const textBody = `
Hello,

You requested to reset your Support Flow password.

Open this link to reset it (valid for 1 hour):
${resetUrl}

If you did not request this, you can ignore this email.

– Support Flow
`.trim();

    // 5) Build MailerSend params
    const sentFrom = new Sender(fromEmail, fromName);
    const recipients = [new Recipient(email, "Support Flow user")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("Reset your Support Flow password")
      .setHtml(htmlBody)
      .setText(textBody);

    // 6) Send with MailerSend
    const response = await mailerSend.email.send(emailParams);
    //console.log("MailerSend send result:", response);

    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password route:", error);

    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 }
    );
  }
}