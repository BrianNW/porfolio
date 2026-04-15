export type ContactFormPayload = {
  name: string;
  email: string;
  message: string;
};

export const emptyContactForm: ContactFormPayload = {
  name: "",
  email: "",
  message: "",
};

function normalizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

export async function submitContactForm(payload: ContactFormPayload) {
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