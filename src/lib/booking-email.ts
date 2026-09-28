import "server-only";
import { Resend } from "resend";
import type Stripe from "stripe";
import { formatEur, formatLongDate } from "@/lib/format";
import { getPackage, IMG, RETREAT } from "@/lib/retreat";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

/**
 * Booking mail is sent from the Stripe webhook and the checkout success page
 * when payment_status is "paid" or "no_payment_required". Both paths share a
 * Checkout Session idempotency key. Organizer inboxes come from
 * BOOKING_NOTIFY_EMAILS. Nothing in this module calls WhatsApp.
 */

const DEFAULT_FROM = "Phuket Pole Retreats <bookings@phuketpoleretreats.com>";
/** Server-only. Not rendered on the site. Override with BOOKING_REPLY_TO. */
const DEFAULT_REPLY_TO = "info@ibizapoleretreats.com";
const GUEST_SUBJECT = "Your Phuket Pole Retreat booking";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type BookingSession = {
  id: string;
  amount_total: number | null;
  currency: string | null;
  mode?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
  } | null;
  metadata?: Record<string, string> | null;
};

type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

export type BookingEmails = {
  guestTo: string | null;
  guest: RenderedEmail;
  organizer: RenderedEmail;
};

export function parseNotifyEmails(raw: string | undefined | null) {
  if (!raw) return [];
  const seen = new Set<string>();
  const emails: string[] = [];
  for (const part of raw.split(",")) {
    const email = part.trim();
    if (!email || !EMAIL_RE.test(email) || email.length > 320) continue;
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    emails.push(email);
  }
  return emails;
}

export function guestEmailFromSession(session: BookingSession) {
  const email =
    session.customer_details?.email?.trim() ||
    session.customer_email?.trim() ||
    session.metadata?.email?.trim() ||
    "";
  return EMAIL_RE.test(email) ? email : null;
}

const THANK_YOU = "Thank you for booking with us. We’re looking forward to hosting you.";
const AUTO_CHARGE = `The card is charged automatically on those dates. To change a payment, contact the organiser on WhatsApp ${WHATSAPP_DISPLAY} before the charge date.`;
const QUESTIONS = `Questions? Reply to this email or WhatsApp ${WHATSAPP_DISPLAY}.`;

type Fact = { label: string; value: string };
type ChargeRow = { label: string; date: string; amount: string };
type MailDoc = {
  eyebrow?: string;
  title: string;
  intro?: string;
  planLabel?: string;
  planDetail?: string;
  rows: ChargeRow[];
  note?: string;
  facts: Fact[];
  reference: string;
  closing?: string;
};

export function buildBookingEmails(session: BookingSession): BookingEmails {
  const metadata = session.metadata ?? {};
  const pkg = metadata.packageSlug ? getPackage(metadata.packageSlug) : undefined;
  const packageTitle = pkg?.title || metadata.packageSlug || "Retreat package";
  const guestName = oneLine(metadata.fullName || session.customer_details?.name || "");
  const guestTo = guestEmailFromSession(session);
  const displayName = guestName || "there";
  const subjectName = guestName || "Guest";
  const includesHotel = pkg?.includesHotel === true;
  const occupancy = occupancyLabel(metadata.occupancy, includesHotel);
  const paidNow = formatMoney(session.amount_total, session.currency);
  const isDeposit = metadata.paymentPlan === "installments";
  const schedule = isDeposit ? installmentSchedule(metadata) : null;
  const paidOn = isoDate(metadata.paidOnIso) ?? new Date().toISOString().slice(0, 10);
  const packageLine = occupancy ? `${packageTitle}, ${occupancy.toLowerCase()}` : packageTitle;
  const phone = phoneLine(metadata.phone, session.customer_details?.phone);
  const level = metadata.level?.trim() || "";
  const rows = chargeRows(schedule);
  const depositLine =
    isDeposit && paidNow ? `${paidNow} deposit paid ${formatLongDate(paidOn)}` : undefined;

  const stayFacts: Fact[] = [
    { label: "Package", value: packageLine },
    level ? { label: "Pole level", value: level } : undefined,
    phone ? { label: "Phone", value: phone } : undefined,
    { label: "Camp", value: RETREAT.headlineDates },
    includesHotel ? { label: "Hotel", value: RETREAT.accommodationDates } : undefined,
  ].filter((fact): fact is Fact => Boolean(fact));

  const guest: MailDoc = {
    title: `Hello ${displayName}`,
    intro: THANK_YOU,
    planLabel: isDeposit ? undefined : "Pay in full",
    planDetail: isDeposit ? depositLine : paidNow ? `Amount paid ${paidNow}` : undefined,
    rows: isDeposit ? rows : [],
    note: isDeposit && rows.length > 0 ? AUTO_CHARGE : undefined,
    facts: stayFacts,
    reference: session.id,
    closing: QUESTIONS,
  };

  const organizerFacts: Fact[] = [
    { label: "Guest", value: subjectName },
    guestTo ? { label: "Email", value: guestTo } : undefined,
    phone ? { label: "Phone", value: phone } : undefined,
    level ? { label: "Pole level", value: level } : undefined,
    { label: "Package", value: packageLine },
    !isDeposit && paidNow ? { label: "Payment", value: `Pay in full, ${paidNow}` } : undefined,
    metadata.instagram?.trim() ? { label: "Instagram", value: oneLine(metadata.instagram) } : undefined,
    metadata.roommateNotes?.trim()
      ? { label: "Roommate note", value: oneLine(metadata.roommateNotes) }
      : undefined,
  ].filter((fact): fact is Fact => Boolean(fact));

  const organizer: MailDoc = {
    eyebrow: "New booking",
    title: subjectName,
    planDetail: isDeposit ? depositLine : undefined,
    rows: isDeposit ? rows : [],
    note: isDeposit && rows.length > 0 ? AUTO_CHARGE : undefined,
    facts: organizerFacts,
    reference: session.id,
  };

  return {
    guestTo,
    guest: renderMail(GUEST_SUBJECT, guest),
    organizer: renderMail(`New booking — ${subjectName} — ${oneLine(packageTitle)}`, organizer),
  };
}

function chargeRows(schedule: Schedule | null): ChargeRow[] {
  if (!schedule?.charges?.length) return [];
  return schedule.charges.map((charge, index) => ({
    label: index === 0 ? "Next card charge" : "",
    date: formatLongDate(charge.iso),
    amount: formatEur(charge.cents),
  }));
}

export async function sendBookingConfirmations(session: Stripe.Checkout.Session) {
  // "unpaid" is a Checkout Session that has not collected money yet.
  // "no_payment_required" is still a completed booking (for example a zero total).
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    console.info(
      "[booking-email] skipped, payment not complete",
      session.id,
      session.payment_status,
    );
    return;
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "[booking-email] RESEND_API_KEY missing; confirmation emails not sent",
      session.id,
    );
    return;
  }

  const emails = buildBookingEmails(session);
  const resend = new Resend(apiKey);
  const from = process.env.BOOKING_FROM?.trim() || DEFAULT_FROM;
  const replyTo = bookingReplyTo();

  if (emails.guestTo) {
    await deliver(resend, {
      from,
      to: [emails.guestTo],
      replyTo,
      subject: emails.guest.subject,
      html: emails.guest.html,
      text: emails.guest.text,
      idempotencyKey: idempotencyKey(session.id, "guest"),
      logLabel: "guest",
      sessionId: session.id,
    });
  } else {
    console.error("[booking-email] no guest email on session", session.id);
  }

  const organizers = parseNotifyEmails(process.env.BOOKING_NOTIFY_EMAILS);
  if (organizers.length === 0) {
    console.info(
      "[booking-email] organizers skipped, BOOKING_NOTIFY_EMAILS empty",
      session.id,
    );
    return;
  }

  await deliver(resend, {
    from,
    to: organizers,
    replyTo,
    subject: emails.organizer.subject,
    html: emails.organizer.html,
    text: emails.organizer.text,
    idempotencyKey: idempotencyKey(session.id, "organizer"),
    logLabel: "organizer",
    sessionId: session.id,
  });
}

function bookingReplyTo() {
  const configured = process.env.BOOKING_REPLY_TO?.trim();
  if (configured && EMAIL_RE.test(configured)) return configured;
  return DEFAULT_REPLY_TO;
}

function idempotencyKey(sessionId: string, role: "guest" | "organizer") {
  // Resend stores one payload per key. The Checkout Session id is shared by the
  // webhook and the success page, so both paths send one guest letter and one
  // organizer alert instead of a second copy. The role suffix keeps them distinct.
  const safe = sessionId.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 220);
  return `${safe || "stripe-session"}/${role}`;
}

async function deliver(
  resend: Resend,
  input: {
    from: string;
    to: string[];
    replyTo?: string;
    subject: string;
    html: string;
    text: string;
    idempotencyKey: string;
    logLabel: "guest" | "organizer";
    sessionId: string;
  },
) {
  try {
    const { error } = await resend.emails.send(
      {
        from: input.from,
        to: input.to,
        replyTo: input.replyTo,
        subject: input.subject,
        html: input.html,
        text: input.text,
      },
      { idempotencyKey: input.idempotencyKey },
    );
    if (error) {
      console.error(
        `[booking-email] ${input.logLabel} failed session=${input.sessionId} ${describeResendError(error)}`,
      );
      return;
    }
    console.info(`[booking-email] ${input.logLabel} sent`, input.sessionId, input.to.length);
  } catch (error) {
    console.error(
      `[booking-email] ${input.logLabel} failed session=${input.sessionId} ${describeResendError(error)}`,
    );
  }
}

type ResendFailure = {
  status: number | null;
  name: string | null;
  message: string | null;
};

/** Resend returns { message, name, statusCode } and does not create an email. */
function resendFailure(error: unknown): ResendFailure {
  if (!error || typeof error !== "object") {
    return {
      status: null,
      name: error instanceof Error ? error.name : null,
      message: error instanceof Error ? error.message : "unknown",
    };
  }
  const record = error as { message?: unknown; name?: unknown; statusCode?: unknown };
  const message = typeof record.message === "string" && record.message ? record.message : null;
  const name = typeof record.name === "string" && record.name ? record.name : null;
  const status =
    typeof record.statusCode === "number"
      ? record.statusCode
      : typeof record.statusCode === "string" && Number.isFinite(Number(record.statusCode))
        ? Number(record.statusCode)
        : null;
  if (message || name || status != null) return { status, name, message };
  if (error instanceof Error) {
    return { status: null, name: error.name || null, message: error.message || "unknown" };
  }
  return { status: null, name: null, message: "unknown" };
}

function describeResendError(error: unknown) {
  const info = resendFailure(error);
  const parts = [
    info.status != null ? `status=${info.status}` : "",
    info.name ? `name=${info.name}` : "",
    info.message ? `message=${info.message}` : "",
  ].filter(Boolean);
  return parts.join(" ") || "message=unknown";
}

type Schedule = {
  monthlyCount: number;
  monthlyBaseCents: number;
  adjustmentCents: number;
  expectedTodayCents: number;
  /** Absent on sessions created before this field was stored. Do not invent a date. */
  firstMonthlyUnix: number | null;
  /** Calendar date of the next charge, taken from Stripe metadata. */
  nextChargeIso: string | null;
  nextChargeCents: number | null;
  /** Last of the stored charges. Absent on older sessions. Do not invent dates in between. */
  lastChargeIso: string | null;
  /** Every later charge, from Stripe metadata. Null when the session did not store them. */
  charges: { iso: string; cents: number }[] | null;
};

function isoDate(value: string | undefined) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function parseChargeSchedule(raw: string | undefined) {
  if (!raw?.trim()) return null;
  const rows: { iso: string; cents: number }[] = [];
  for (const part of raw.split(",")) {
    const match = /^(\d{4}-\d{2}-\d{2}):(\d+)$/.exec(part.trim());
    if (!match) return null;
    const cents = Number(match[2]);
    if (!Number.isSafeInteger(cents) || cents <= 0) return null;
    rows.push({ iso: match[1], cents });
  }
  return rows.length > 0 ? rows : null;
}

function positiveInt(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function installmentSchedule(metadata: Record<string, string>): Schedule | null {
  const monthlyCount = Number(metadata.monthlyCount);
  const remainingCents = Number(metadata.remainingCents);
  if (!Number.isInteger(monthlyCount) || monthlyCount <= 0) return null;
  if (!Number.isInteger(remainingCents) || remainingCents < 0) return null;
  const computedBase = Math.floor(remainingCents / monthlyCount);
  const fromMetadata = positiveInt(metadata.monthlyBaseCents);
  const monthlyBaseCents =
    fromMetadata != null && fromMetadata * monthlyCount <= remainingCents
      ? fromMetadata
      : computedBase;
  const adjustmentCents = remainingCents - monthlyBaseCents * monthlyCount;
  const stored = parseChargeSchedule(metadata.chargeSchedule);
  const firstMonthlyUnix = positiveInt(metadata.firstMonthlyUnix);
  const nextFromUnix = firstMonthlyUnix
    ? new Date(firstMonthlyUnix * 1000).toISOString().slice(0, 10)
    : null;
  const sameStoredAmount = stored != null && stored.every((row) => row.cents === stored[0].cents);
  return {
    monthlyCount: stored?.length ?? monthlyCount,
    monthlyBaseCents: sameStoredAmount ? stored[0].cents : monthlyBaseCents,
    adjustmentCents,
    expectedTodayCents: RETREAT.depositCents + adjustmentCents,
    firstMonthlyUnix,
    nextChargeIso: stored?.[0]?.iso ?? nextFromUnix,
    nextChargeCents: stored?.[0]?.cents ?? (monthlyBaseCents > 0 ? monthlyBaseCents : null),
    lastChargeIso: stored?.[stored.length - 1]?.iso ?? isoDate(metadata.lastMonthlyIso),
    charges: stored,
  };
}

function occupancyLabel(value: string | undefined, includesHotel: boolean) {
  if (!includesHotel) return null;
  if (value === "shared") return "Shared";
  if (value === "solo") return "Solo";
  return null;
}

function phoneLine(formPhone: string | undefined, stripePhone: string | null | undefined) {
  const values = [formPhone, stripePhone]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const key = value.replace(/\s+/g, "");
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(value);
  }
  return unique.join(" · ");
}

function formatMoney(cents: number | null, currency: string | null) {
  if (cents == null || !Number.isFinite(cents)) return null;
  if ((currency || "eur").toLowerCase() === "eur") return formatEur(cents);
  return `${(cents / 100).toFixed(2)} ${(currency || "eur").toUpperCase()}`;
}

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function renderMail(subject: string, doc: MailDoc): RenderedEmail {
  const text = mailText(doc);
  const html = mailHtml(doc);
  return { subject: oneLine(subject), html, text };
}

function mailText(doc: MailDoc) {
  const lines = [
    doc.eyebrow,
    doc.title,
    doc.intro,
    doc.planLabel,
    doc.planDetail,
    ...doc.rows.map((row) => [row.label, row.date, row.amount].filter(Boolean).join(" — ")),
    doc.note,
    ...doc.facts.map((fact) => `${fact.label}: ${fact.value}`),
    `Reference ${doc.reference}`,
    doc.closing,
  ].filter((line): line is string => Boolean(line && line.trim()));
  return lines.join("\n");
}

function mailHtml(doc: MailDoc) {
  const font = "Georgia,'Iowan Old Style','Palatino Linotype',Palatino,serif";
  const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  const facts = doc.facts
    .map(
      (fact, index) =>
        `<tr><td style="padding:8px 16px 8px 0;font-family:${sans};font-size:13px;line-height:1.3;color:#5e6f68;vertical-align:top;width:108px;${index ? "border-top:1px solid #e6dfd2;" : ""}">${escapeHtml(fact.label)}</td><td style="padding:8px 0;font-family:${sans};font-size:15px;line-height:1.35;color:#243832;vertical-align:top;${index ? "border-top:1px solid #e6dfd2;" : ""}">${escapeHtml(fact.value)}</td></tr>`,
    )
    .join("");
  const rows = doc.rows
    .map(
      (row) =>
        `<tr><td style="padding:7px 10px 7px 0;font-family:${sans};font-size:13px;line-height:1.3;color:#1b7f78;vertical-align:baseline;width:132px;">${escapeHtml(row.label)}</td><td style="padding:7px 10px 7px 0;font-family:${sans};font-size:15px;line-height:1.3;color:#243832;vertical-align:baseline;">${escapeHtml(row.date)}</td><td align="right" style="padding:7px 0;font-family:${sans};font-size:15px;line-height:1.3;color:#243832;font-weight:600;vertical-align:baseline;white-space:nowrap;">${escapeHtml(row.amount)}</td></tr>`,
    )
    .join("");
  const plan = doc.planLabel || doc.planDetail
    ? `<tr><td style="padding:4px 28px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ee;"><tr><td style="padding:14px 16px;font-family:${sans};">${doc.planLabel ? `<div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#1b7f78;">${escapeHtml(doc.planLabel)}</div>` : ""}${doc.planDetail ? `<div style="margin-top:${doc.planLabel ? "4px" : "0"};font-family:${font};font-size:22px;line-height:1.25;color:#243832;">${escapeHtml(doc.planDetail)}</div>` : ""}</td></tr></table></td></tr>`
    : "";
  const schedule = rows
    ? `<tr><td style="padding:14px 28px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>`
    : "";
  const note = doc.note
    ? `<tr><td style="padding:12px 28px 0;font-family:${sans};font-size:14px;line-height:1.45;color:#243832;">${escapeHtml(doc.note)}</td></tr>`
    : "";
  const intro = doc.intro
    ? `<tr><td style="padding:8px 28px 0;font-family:${sans};font-size:16px;line-height:1.45;color:#243832;">${escapeHtml(doc.intro)}</td></tr>`
    : "";
  const eyebrow = doc.eyebrow
    ? `<div style="font-family:${sans};font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#1b7f78;">${escapeHtml(doc.eyebrow)}</div>`
    : "";
  const closing = doc.closing
    ? `<tr><td style="padding:16px 28px 0;font-family:${sans};font-size:14px;line-height:1.45;color:#243832;">${escapeHtml(doc.closing)}</td></tr>`
    : "";

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#faf8f3;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f3;"><tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;"><tr><td style="height:4px;background:#1b7f78;font-size:0;line-height:0;">&nbsp;</td></tr><tr><td style="padding:18px 28px 0;text-align:left;"><img src="${escapeHtml(IMG.logo)}" width="72" height="72" alt="Phuket Pole Retreats" style="display:block;width:72px;height:72px;border:0;"></td></tr><tr><td style="padding:14px 28px 0;">${eyebrow}<div style="margin-top:${doc.eyebrow ? "4px" : "0"};font-family:${font};font-size:28px;line-height:1.15;color:#243832;">${escapeHtml(doc.title)}</div></td></tr>${intro}${plan}${schedule}${note}<tr><td style="padding:16px 28px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${facts}</table></td></tr><tr><td style="padding:14px 28px 0;font-family:${sans};font-size:12px;line-height:1.4;color:#7b8781;">Reference ${escapeHtml(doc.reference)}</td></tr>${closing}<tr><td style="padding:18px 28px 22px;font-family:${sans};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#1b7f78;">Phuket Pole Retreats</td></tr></table></td></tr></table></body></html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
