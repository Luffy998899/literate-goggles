"use client";

import { useState } from "react";
import { emails, whatsapp } from "@/lib/company";
import { ArrowRight, Check } from "./ui";

const INQUIRY_TYPES = [
  "Request a quote",
  "Technical specification",
  "Sample request",
  "Certificates & test reports",
  "Existing order",
  "Something else",
] as const;

type Status = "idle" | "sending" | "sent" | "error";

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const payload = Object.fromEntries(f.entries());

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setError(data.error ?? "We could not send that just now.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError("Network problem — check your connection and try again.");
      setStatus("error");
    }
  }

  const field =
    "w-full border-0 border-b border-line bg-transparent px-0 py-3 font-body text-navy transition-colors placeholder:italic placeholder:text-body/50 focus:border-primary focus:ring-0 focus:outline-none";

  if (status === "sent") {
    return (
      <div className="border-t-4 border-primary bg-white p-10 text-center md:p-14">
        <span className="mx-auto flex size-16 items-center justify-center bg-primary">
          <Check className="size-8 text-white" />
        </span>
        <h3 className="font-display mt-8 text-2xl font-extrabold text-navy">
          Enquiry sent.
        </h3>
        <p className="font-body mx-auto mt-4 max-w-md leading-relaxed text-body">
          Thank you — it has landed with our team and we will come back to you with a quote and
          a lead time. For anything urgent, message us on WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps inline-flex items-center gap-3 border-l-4 border-accent bg-primary px-8 py-4 text-white transition-colors hover:bg-primary-dk"
          >
            WhatsApp us
          </a>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="label-caps inline-flex items-center gap-3 border border-line px-8 py-4 text-primary transition-colors hover:bg-tint"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} className="border-t-4 border-primary bg-white p-8 md:p-10">
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label-caps text-body/70">
            Full name
          </label>
          <input id="name" name="name" required placeholder="Your name" className={field} />
        </div>

        <div>
          <label htmlFor="email" className="label-caps text-body/70">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="company" className="label-caps text-body/70">
            Company
          </label>
          <input id="company" name="company" placeholder="Company name" className={field} />
        </div>

        <div>
          <label htmlFor="phone" className="label-caps text-body/70">
            Phone
          </label>
          <input id="phone" name="phone" placeholder="+91…" className={field} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="type" className="label-caps text-body/70">
            Enquiry type
          </label>
          <select id="type" name="type" className={field} defaultValue={INQUIRY_TYPES[0]}>
            {INQUIRY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="details" className="label-caps text-body/70">
            Requirement
          </label>
          <textarea
            id="details"
            name="details"
            rows={5}
            required
            placeholder="Part, size, material, finish, quantity and any drawing reference…"
            className={`${field} resize-y`}
          />
        </div>
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="group mt-10 inline-flex items-center gap-3 border-l-4 border-accent bg-primary px-8 py-4 text-white transition-colors hover:bg-primary-dk disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="label-caps">{sending ? "Sending…" : "Submit enquiry"}</span>
        {sending ? (
          <span
            aria-hidden
            className="size-4 animate-spin border-2 border-white/40 border-t-white"
          />
        ) : (
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        )}
      </button>

      {status === "error" ? (
        <p
          role="alert"
          className="font-body mt-5 border-l-2 border-primary bg-tint px-4 py-3 text-sm text-navy"
        >
          {error} You can also write to{" "}
          <a href={`mailto:${emails[2].value}`} className="underline underline-offset-4">
            {emails[2].value}
          </a>{" "}
          or message us on{" "}
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            WhatsApp
          </a>
          .
        </p>
      ) : (
        <p className="font-body mt-5 text-xs leading-relaxed text-body/70">
          We reply from our Mohali office during working hours. Your details are used only to
          answer this enquiry.
        </p>
      )}
    </form>
  );
}
