import "server-only";
import { Resend } from "resend";
import type Stripe from "stripe";
import { formatEur, formatLongDate } from "@/lib/format";
import { getPackage, RETREAT } from "@/lib/retreat";
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
  const currency = (session.currency || RETREAT.currency).toUpperCase();
  const isDeposit = metadata.paymentPlan === "installments";
  const schedule = isDeposit ? installmentSchedule(metadata) : null;

  const guestLines = [
    `Hello ${displayName},`,
    isDeposit
      ? "Your Phuket Pole Retreat booking is confirmed. This payment is the deposit taken today, not pay in full."
      : "Your Phuket Pole Retreat booking is confirmed. This payment is pay in full.",
    ...chargeNote(isDeposit, schedule, session.amount_total),
    "",
    ...detailLines({
      guestName,
      guestTo,
      phone: phoneLine(metadata.phone, session.customer_details?.phone),
      level: metadata.level?.trim() || "",
      packageTitle,
      occupancy,
      paidNow,
      currency,
      isDeposit,
      schedule,
      includesHotel,
      reference: session.id,
    }),
    "",
    `Questions? Reply to this email, or message WhatsApp ${WHATSAPP_DISPLAY}.`,
    "Phuket Pole Retreats",
  ];

  const organizerLines = [
    `New booking — ${subjectName} — ${packageTitle}.`,
    isDeposit
      ? "Plan: €500 deposit, then automatic monthly charges. This is not pay in full."
      : "Plan: pay in full.",
    ...chargeNote(isDeposit, schedule, session.amount_total),
    "",
    ...detailLines({
      guestName,
      guestTo,
      phone: phoneLine(metadata.phone, session.customer_details?.phone),
      level: metadata.level?.trim() || "",
      packageTitle,
      occupancy,
      paidNow,
      currency,
      isDeposit,
      schedule,
      includesHotel,
      reference: session.id,
    }),
    ...organizerOnlyLines(metadata),
  ];

  return {
    guestTo,
    guest: render(GUEST_SUBJECT, guestLines),
    organizer: render(`New booking — ${subjectName} — ${oneLine(packageTitle)}`, organizerLines),
  };
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

const CHANGE_BEFORE_CHARGE = `If you need a change, contact the organiser on WhatsApp ${WHATSAPP_DISPLAY} before the charge date. Otherwise the card is charged automatically.`;

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

function joinDates(dates: string[]) {
  if (dates.length <= 1) return dates[0] ?? "";
  if (dates.length === 2) return `${dates[0]} and ${dates[1]}`;
  return `${dates.slice(0, -1).join(", ")}, and ${dates[dates.length - 1]}`;
}

function monthlyFollowSentence(count: number) {
  if (count === 1) {
    return "1 monthly charge follows. It is automatic on the same card until the balance is paid.";
  }
  return `${count} monthly charges follow. They are automatic on the same card until the balance is paid.`;
}

function chargeNote(isDeposit: boolean, schedule: Schedule | null, amountTotal: number | null) {
  if (!isDeposit) return [];
  const lines: string[] = [];
  const hasNextCharge = Boolean(schedule?.nextChargeIso && schedule.nextChargeCents);
  if (!hasNextCharge) {
    lines.push("The card will be charged automatically until the balance is paid.");
  }
  if (schedule && amountTotal != null && amountTotal !== schedule.expectedTodayCents) {
    lines.push("The amount paid now is what Stripe collected today.");
  }
  return lines;
}

function detailLines(input: {
  guestName: string;
  guestTo: string | null;
  phone: string;
  level: string;
  packageTitle: string;
  occupancy: string | null;
  paidNow: string | null;
  currency: string;
  isDeposit: boolean;
  schedule: Schedule | null;
  includesHotel: boolean;
  reference: string;
}) {
  const lines = [
    input.guestName ? `Guest: ${input.guestName}` : "",
    input.guestTo ? `Email: ${input.guestTo}` : "",
    input.phone ? `Phone / WhatsApp: ${input.phone}` : "",
    input.level ? `Pole level: ${input.level}` : "",
    `Package: ${input.packageTitle}`,
    input.occupancy ? `Occupancy: ${input.occupancy}` : "",
    input.paidNow
      ? input.isDeposit
        ? `Amount taken today: ${input.paidNow}.`
        : `Amount paid now: ${input.paidNow}`
      : "",
    `Currency: ${input.currency === "EUR" ? "EUR" : input.currency}`,
    `Payment: ${input.isDeposit ? "€500 deposit, then automatic monthly charges" : "Pay in full"}`,
  ];

  if (input.isDeposit && input.schedule) {
    const nextIso = input.schedule.nextChargeIso;
    const nextCents = input.schedule.nextChargeCents;
    const lastIso = input.schedule.lastChargeIso;
    const storedCharges = input.schedule.charges;
    if (storedCharges && storedCharges.length > 0 && nextIso && nextCents) {
      // Dates and amounts come from the Checkout Session. The cent adjustment
      // was collected today and is not part of these charges.
      lines.push(
        `Next charge on the card: ${formatEur(nextCents)} on ${formatLongDate(nextIso)}, UTC.`,
      );
      const sameAmount = storedCharges.every((charge) => charge.cents === storedCharges[0].cents);
      if (sameAmount) {
        lines.push(
          `The same amount is taken on ${joinDates(storedCharges.map((charge) => formatLongDate(charge.iso)))}.`,
        );
      }
      for (const charge of storedCharges) {
        lines.push(`${formatLongDate(charge.iso)}: ${formatEur(charge.cents)}`);
      }
      lines.push(CHANGE_BEFORE_CHARGE);
    } else if (nextIso && nextCents && lastIso) {
      lines.push(
        `Next charge on the card: ${formatEur(nextCents)} on ${formatLongDate(nextIso)}, UTC.`,
      );
      lines.push(
        `The same amount is taken on that day each month through ${formatLongDate(lastIso)}.`,
      );
      lines.push(CHANGE_BEFORE_CHARGE);
    } else if (nextIso && nextCents) {
      lines.push(
        `Next charge on the card: ${formatEur(nextCents)} on ${formatLongDate(nextIso)}, UTC.`,
      );
      lines.push(monthlyFollowSentence(input.schedule.monthlyCount));
      lines.push(CHANGE_BEFORE_CHARGE);
    } else {
      if (
        input.paidNow &&
        input.schedule.adjustmentCents > 0 &&
        input.paidNow === formatMoney(input.schedule.expectedTodayCents, "eur")
      ) {
        lines.push(
          `Deposit paid: ${formatEur(RETREAT.depositCents)} plus ${formatEur(input.schedule.adjustmentCents)} so the total matches the package price`,
        );
      } else if (input.paidNow) {
        lines.push(`Deposit paid: ${input.paidNow}`);
      }
      if (input.schedule.monthlyBaseCents > 0) {
        lines.push(`Monthly amount: ${formatEur(input.schedule.monthlyBaseCents)}`);
      }
      lines.push(`Remaining charges: ${input.schedule.monthlyCount}`);
      lines.push(CHANGE_BEFORE_CHARGE);
    }
  }

  lines.push(`Camp and workshops: ${RETREAT.headlineDates}`);
  if (input.includesHotel) {
    lines.push(`Hotel stay: ${RETREAT.accommodationDates}`);
  } else {
    lines.push("Hotel nights are not included.");
  }
  lines.push(`Booking reference: ${input.reference}`);
  return lines.filter(Boolean);
}

function organizerOnlyLines(metadata: Record<string, string>) {
  const lines: string[] = [];
  const instagram = metadata.instagram?.trim();
  const roommate = metadata.roommateNotes?.trim();
  if (instagram) lines.push(`Instagram: ${oneLine(instagram)}`);
  if (roommate) lines.push(`Roommate notes: ${roommate}`);
  return lines;
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

function render(subject: string, lines: string[]): RenderedEmail {
  const text = lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const paragraphs = text.split(/\n{2,}/);
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#faf8f3;color:#243832;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.5;">${paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`,
    )
    .join("")}</body></html>`;
  return { subject: oneLine(subject), html, text };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
