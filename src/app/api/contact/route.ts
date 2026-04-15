import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import { parseContactSubmissionPayload } from "@/lib/contact";

export const runtime = "nodejs";

type CaptchaTokenPayload = {
  answer: number;
  exp: number;
  nonce: string;
};

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

function getCaptchaSecret() {
  return process.env.CONTACT_CAPTCHA_SECRET || process.env.SMTP_PASS || "development-contact-captcha-secret";
}

function signCaptchaPayload(encodedPayload: string) {
  return createHmac("sha256", getCaptchaSecret()).update(encodedPayload).digest("base64url");
}

function createCaptchaChallenge() {
  const useAddition = randomInt(0, 2) === 0;
  let left = randomInt(2, 10);
  let right = randomInt(1, 10);

  if (!useAddition && right > left) {
    [left, right] = [right, left];
  }

  const answer = useAddition ? left + right : left - right;
  const payload: CaptchaTokenPayload = {
    answer,
    exp: Date.now() + 10 * 60 * 1000,
    nonce: randomUUID(),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signCaptchaPayload(encodedPayload);

  return {
    prompt: `What is ${left} ${useAddition ? "+" : "-"} ${right}?`,
    token: `${encodedPayload}.${signature}`,
  };
}

function verifyCaptchaToken(token: string, answer: string) {
  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return { error: "Captcha verification failed. Please try again." };
  }

  const expectedSignature = signCaptchaPayload(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { error: "Captcha verification failed. Please try again." };
  }

  let payload: CaptchaTokenPayload;

  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as CaptchaTokenPayload;
  } catch {
    return { error: "Captcha verification failed. Please try again." };
  }

  if (typeof payload.answer !== "number" || typeof payload.exp !== "number" || payload.exp < Date.now()) {
    return { error: "Captcha expired. Please try again." };
  }

  if (String(payload.answer) !== answer.trim()) {
    return { error: "Captcha verification failed. Please try again." };
  }

  return { ok: true };
}

export async function GET() {
  return NextResponse.json(createCaptchaChallenge(), {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = parseContactSubmissionPayload(payload);

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const captchaCheck = verifyCaptchaToken(parsed.data.captchaToken, parsed.data.captchaAnswer);

  if ("error" in captchaCheck) {
    return NextResponse.json({ error: captchaCheck.error }, { status: 400 });
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
      text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
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