"use client";
import { useEffect, useState } from "react";

import {
  emptyContactCaptcha,
  emptyContactForm,
  fetchContactCaptchaChallenge,
  submitContactForm,
} from "@/lib/contact";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState(emptyContactForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState(emptyContactCaptcha);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const refreshCaptcha = async () => {
    setIsCaptchaLoading(true);
    setCaptchaError(null);

    try {
      const challenge = await fetchContactCaptchaChallenge();
      setCaptcha(challenge);
    } catch (error) {
      setCaptcha(emptyContactCaptcha);
      setCaptchaError(
        error instanceof Error ? error.message : "Unable to load captcha right now."
      );
    } finally {
      setIsCaptchaLoading(false);
    }
  };

  useEffect(() => {
    if (!open || captcha.token) {
      return;
    }

    const timeout = setTimeout(() => {
      void refreshCaptcha();
    }, 0);

    return () => clearTimeout(timeout);
  }, [open, captcha.token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captcha.token) {
      setSubmitError("Captcha is still loading. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitContactForm({
        ...form,
        captchaAnswer,
        captchaToken: captcha.token,
      });
      setSubmitted(true);
      setForm(emptyContactForm);
      setCaptchaAnswer("");
      void refreshCaptcha();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send your message right now.";

      setSubmitError(message);

      if (/captcha/i.test(message)) {
        setCaptchaAnswer("");
        void refreshCaptcha();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Contact Me</h2>
        {submitted ? (
          <div className="text-green-600 dark:text-green-400 text-center py-8">Thank you! Message sent.</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {submitError ? (
              <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200">
                {submitError}
              </div>
            ) : null}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-mono placeholder:font-mono"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-mono placeholder:font-mono"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className="rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-mono placeholder:font-mono"
              rows={4}
            />
            <div className="grid grid-cols-[1fr_auto] items-end gap-3">
              <label className="block text-sm text-black dark:text-white">
                Security Check
                <span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-300">
                  {isCaptchaLoading ? "Loading captcha..." : captcha.prompt || "Load the captcha to continue."}
                </span>
                <input
                  type="text"
                  name="captchaAnswer"
                  inputMode="numeric"
                  placeholder="Answer"
                  value={captchaAnswer}
                  onChange={(event) => setCaptchaAnswer(event.target.value)}
                  disabled={isSubmitting || isCaptchaLoading || !captcha.token}
                  required
                  className="mt-2 w-full rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-mono placeholder:font-mono"
                />
              </label>
              <button
                type="button"
                onClick={() => void refreshCaptcha()}
                disabled={isSubmitting || isCaptchaLoading}
                className="rounded border px-3 py-2 text-sm text-black transition hover:bg-black/[.04] dark:text-white dark:hover:bg-white/[.08]"
              >
                Refresh
              </button>
            </div>
            {captchaError ? (
              <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200">
                {captchaError}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting || isCaptchaLoading || !captcha.token}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
