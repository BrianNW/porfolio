import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import { parseContactFormPayload } from "@/lib/contact";

export const runtime = "nodejs";

function getMailerConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "0");
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!host || !port || !to || !from) {
    return {
      error:
        "Contact form email is not configured. Set SMTP_HOST, SMTP_PORT, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL.",
    };
  }

  if ((user && !pass) || (!user && pass)) {
    return {
      error: "SMTP credentials are incomplete. Set both SMTP_USER and SMTP_PASS together.",
    };
  }

  return {
    config: {
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
      to,
      from,
    },
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = parseContactFormPayload(payload);

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const mailer = getMailerConfig();
  if ("error" in mailer) {
    return NextResponse.json({ error: mailer.error }, { status: 500 });
  }

  const { name, email, message } = parsed.data;
  const transporter = nodemailer.createTransport({
    host: mailer.config.host,
    port: mailer.config.port,
    secure: mailer.config.secure,
    auth: mailer.config.auth,
  });

  try {
    await transporter.sendMail({
      from: mailer.config.from,
      to: mailer.config.to,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form send failed", error);

    return NextResponse.json(
      { error: "Message could not be sent. Check your SMTP settings and try again." },
      { status: 500 }
    );
  }
}