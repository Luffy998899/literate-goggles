import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const MAIL_TO = process.env.MAIL_TO ?? "Kartikeyfasteners@gmail.com";
const MAIL_FROM = process.env.MAIL_FROM ?? "Kartikey Fasteners <info@kaisoul.tech>";

/* ------------------------------------------------------------------ limits -- */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so a long-running process does not grow unbounded.
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

/* ------------------------------------------------------------------ helpers -- */

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* --------------------------------------------------------------------- POST -- */

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[enquiry] RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "Email is not configured on this server yet." },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this address. Please try again later." },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: a real person never fills a field they cannot see.
  if (clean(payload.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 200);
  const companyName = clean(payload.company, 160);
  const phone = clean(payload.phone, 40);
  const type = clean(payload.type, 80) || "Enquiry";
  const details = clean(payload.details, 4000);

  if (!name || !email || !details) {
    return NextResponse.json(
      { ok: false, error: "Name, email and requirement are all required." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const subject = `${type} — ${companyName || name}`;

  const rows: [string, string][] = [
    ["Name", name],
    ["Company", companyName || "—"],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Enquiry type", type],
  ];

  const html = `
<div style="font-family:Inter,Arial,sans-serif;color:#1B2447;max-width:640px">
  <div style="background:#1B2447;padding:24px 28px">
    <p style="margin:0;font:600 12px/1.4 'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:#7091E6">
      New website enquiry
    </p>
    <h1 style="margin:8px 0 0;font:800 22px/1.3 Montserrat,Arial,sans-serif;color:#fff">
      ${esc(subject)}
    </h1>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-top:20px">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #ADBBDA;font:600 11px/1.4 'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:#48547E;width:150px">${esc(k)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ADBBDA;font-size:14px;color:#1B2447">${esc(v)}</td>
    </tr>`,
      )
      .join("")}
  </table>
  <div style="margin-top:24px;border-left:3px solid #3D52A0;padding:4px 0 4px 16px">
    <p style="margin:0 0 6px;font:600 11px/1.4 'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:#48547E">Requirement</p>
    <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap">${esc(details)}</p>
  </div>
  <p style="margin-top:28px;font-size:12px;color:#48547E">
    Sent from kartikeyfastener.com — reply directly to reach ${esc(name)}.
  </p>
</div>`.trim();

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Requirement",
    "-----------",
    details,
    "",
    "Sent from kartikeyfastener.com",
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [MAIL_TO],
      replyTo: email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[enquiry] resend error", error);
      return NextResponse.json(
        { ok: false, error: "We could not send that just now. Please email or WhatsApp us." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("[enquiry] unexpected", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please email or WhatsApp us." },
      { status: 500 },
    );
  }
}
