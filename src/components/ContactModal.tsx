"use client";
import { useEffect, useState } from "react";

import {
  emptyContactCaptcha,
  fetchContactCaptchaChallenge,
  verifyContactCaptcha,
} from "@/lib/contact";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isContactVisible, setIsContactVisible] = useState(false);
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

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captcha.token) {
      setVerificationError("Captcha is still loading. Please try again in a moment.");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      await verifyContactCaptcha({
        captchaAnswer,
        captchaToken: captcha.token,
      });

      setIsContactVisible(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Captcha verification failed. Please try again.";

      setVerificationError(message);

      if (/captcha/i.test(message)) {
        setCaptchaAnswer("");
        void refreshCaptcha();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Contact Me</h2>
        {isContactVisible ? (
          <div className="border border-green-200 bg-green-50 p-6 md:p-7 pr-12 text-base md:text-lg font-normal text-green-900 dark:border-green-500/40 dark:bg-green-950/40 dark:text-green-100">
            <p className="text-center text-2xl md:text-3xl font-normal">Contact details</p>
            <p className="mt-3">
              Email:{" "}
              <a
                href="mailto:briantechdom@gmail.com"
                className="font-normal underline underline-offset-4"
              >
                briantechdom@gmail.com
              </a>
            </p>
            <p className="mt-2">
              Phone:{" "}
              <a
                href="tel:+17787240250"
                className="font-normal underline underline-offset-4"
              >
                7787240250
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleReveal} className="flex flex-col gap-4">
            {verificationError ? (
              <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200">
                {verificationError}
              </div>
            ) : null}
            <div className="grid grid-cols-[1fr_auto] items-end gap-3">
              <label className="block text-sm text-black dark:text-white">
                Security Check (to prevent bots and spam)
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
                  disabled={isVerifying || isCaptchaLoading || !captcha.token}
                  required
                  className="mt-2 w-full rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-mono placeholder:font-mono"
                />
              </label>
              <button
                type="button"
                onClick={() => void refreshCaptcha()}
                disabled={isVerifying || isCaptchaLoading}
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
              disabled={isVerifying || isCaptchaLoading || !captcha.token}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            >
              {isVerifying ? "Verifying..." : "Reveal Contact Info"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
