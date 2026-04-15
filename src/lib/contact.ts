export type ContactFormPayload = {
  name: string;
  email: string;
  message: string;
};

export type ContactCaptchaChallenge = {
  prompt: string;
  token: string;
};

export type ContactSubmissionPayload = ContactFormPayload & {
  captchaAnswer: string;
  captchaToken: string;
};

export const emptyContactForm: ContactFormPayload = {
  name: "",
  email: "",
  message: "",
};

export const emptyContactCaptcha: ContactCaptchaChallenge = {
  prompt: "",
  token: "",
};

function normalizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isStaticContactMode() {
  return process.env.NEXT_PUBLIC_CONTACT_MODE === "mailto";
}

function createClientCaptchaChallenge(): ContactCaptchaChallenge {
  const useAddition = Math.random() >= 0.5;
  let left = Math.floor(Math.random() * 8) + 2;
  let right = Math.floor(Math.random() * 9) + 1;

  if (!useAddition && right > left) {
    [left, right] = [right, left];
  }

  const answer = String(useAddition ? left + right : left - right);
  const token = typeof window === "undefined" ? answer : window.btoa(answer);

  return {
    prompt: `What is ${left} ${useAddition ? "+" : "-"} ${right}?`,
    token,
  };
}

function verifyClientCaptcha(answer: string, token: string) {
  const normalizedAnswer = normalizeField(answer);
  const normalizedToken = normalizeField(token);

  if (!normalizedAnswer || !normalizedToken) {
    throw new Error("Complete the captcha before sending your message.");
  }

  const expectedAnswer =
    typeof window === "undefined" ? normalizedToken : window.atob(normalizedToken);

  if (normalizedAnswer !== expectedAnswer) {
    throw new Error("Captcha verification failed. Please try again.");
  }
}

function buildMailtoUrl(payload: ContactFormPayload) {
  const toEmail = process.env.NEXT_PUBLIC_CONTACT_TO_EMAIL;

  if (!toEmail) {
    throw new Error("GitHub Pages contact fallback is missing NEXT_PUBLIC_CONTACT_TO_EMAIL.");
  }

  const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`);
  const body = encodeURIComponent(
    [`Name: ${payload.name}`, `Email: ${payload.email}`, "", payload.message].join("\n")
  );

  return `mailto:${toEmail}?subject=${subject}&body=${body}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseContactFormPayload(payload: unknown):
  | { data: ContactFormPayload }
  | { error: string } {
  if (!payload || typeof payload !== "object") {
    return { error: "Invalid request payload." };
  }

  const record = payload as Record<string, unknown>;
  const name = normalizeField(record.name);
  const email = normalizeField(record.email);
  const message = normalizeField(record.message);

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  if (name.length > 120) {
    return { error: "Name is too long." };
  }

  if (email.length > 320) {
    return { error: "Email is too long." };
  }

  if (message.length > 5000) {
    return { error: "Message is too long." };
  }

  return {
    data: {
      name,
      email,
      message,
    },
  };
}

export function parseContactSubmissionPayload(payload: unknown):
  | { data: ContactSubmissionPayload }
  | { error: string } {
  const parsedForm = parseContactFormPayload(payload);

  if ("error" in parsedForm) {
    return parsedForm;
  }

  const record = payload as Record<string, unknown>;
  const captchaAnswer = normalizeField(record.captchaAnswer);
  const captchaToken = normalizeField(record.captchaToken);

  if (!captchaAnswer || !captchaToken) {
    return { error: "Complete the captcha before sending your message." };
  }

  if (captchaAnswer.length > 32 || captchaToken.length > 500) {
    return { error: "Captcha verification failed. Please try again." };
  }

  return {
    data: {
      ...parsedForm.data,
      captchaAnswer,
      captchaToken,
    },
  };
}

export async function fetchContactCaptchaChallenge() {
  if (isStaticContactMode()) {
    return createClientCaptchaChallenge();
  }

  const response = await fetch("/api/contact", {
    method: "GET",
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as
    | ({ error?: string } & Partial<ContactCaptchaChallenge>)
    | null;

  if (!response.ok || !result?.prompt || !result?.token) {
    throw new Error(result?.error || "Unable to load captcha right now.");
  }

  return {
    prompt: result.prompt,
    token: result.token,
  } satisfies ContactCaptchaChallenge;
}

export async function submitContactForm(payload: ContactSubmissionPayload) {
  if (isStaticContactMode()) {
    verifyClientCaptcha(payload.captchaAnswer, payload.captchaToken);

    if (typeof window !== "undefined") {
      window.location.href = buildMailtoUrl(payload);
    }

    return;
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(result?.error || "Unable to send your message right now.");
  }
}