import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const referrer = req.headers.get("referer") || "(direct)";
  const ua = req.headers.get("user-agent") || "(unknown)";

  console.log("[resume-download]", {
    ts: new Date().toISOString(),
    referrer,
    ua: ua.slice(0, 120),
    ...body,
  });

  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.NOTIFY_EMAIL_TO;

  if (resendKey && notifyTo) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.NOTIFY_EMAIL_FROM ?? "onboarding@resend.dev",
        to: notifyTo,
        subject: `Resume downloaded from ${referrer}`,
        text:
          `Someone downloaded your resume.\n\n` +
          `Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT\n` +
          `Referrer: ${referrer}\n` +
          `User Agent: ${ua}\n`,
      });
    } catch (err) {
      console.warn("[resume-download] email failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}
