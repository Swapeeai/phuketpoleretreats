import { formatEur, formatLongDate } from "@/lib/format";
import { RETREAT } from "@/lib/retreat";

export type InstallmentCharge = {
  isoDate: string;
  amountCents: number;
  label: "deposit" | "monthly";
};

export type InstallmentPlan =
  | {
      available: true;
      depositCents: number;
      /** Deposit plus any cent adjustment. This is what the card is charged today. */
      todayCents: number;
      remainingCents: number;
      monthlyCount: number;
      /** Same amount on every later charge. The cent adjustment is not included. */
      monthlyBaseCents: number;
      /**
       * Rounding remainder (remaining − monthlyBaseCents × count). Charged once
       * today with the deposit, never on the next monthly charge.
       */
      firstInvoiceExtraCents: number;
      charges: InstallmentCharge[];
      firstMonthlyUnix: number;
      firstMonthlyIso: string;
      lastMonthlyUnix: number;
      lastMonthlyIso: string;
      cancelAtUnix: number;
      /** Monthly dates and amounts actually charged, `YYYY-MM-DD:cents` joined by commas. */
      chargeSchedule: string;
      summary: string;
    }
  | {
      available: false;
      reason: string;
    };

function utcDate(year: number, monthIndex: number, day: number) {
  return new Date(Date.UTC(year, monthIndex, day));
}

function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Same calendar day, `months` later, counted from the original date.
 * A month that is shorter uses its last day (31 January → 28 February).
 */
function addUtcMonths(date: Date, months: number) {
  const day = date.getUTCDate();
  const monthIndex = date.getUTCMonth() + months;
  const year = date.getUTCFullYear();
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  return utcDate(year, monthIndex, Math.min(day, lastDay));
}

export function buildInstallmentPlan(totalCents: number, now = new Date()): InstallmentPlan {
  const depositCents = RETREAT.depositCents;
  const remainingCents = totalCents - depositCents;

  if (remainingCents <= 0) {
    return {
      available: false,
      reason: "This package is covered by the deposit. Pay in full today.",
    };
  }

  const today = utcDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const deadline = new Date(`${RETREAT.balanceDeadlineIso}T00:00:00Z`);
  const monthlyDates: Date[] = [];

  // At most 3 charges, on the same calendar day in each following month.
  // A 22 August deposit is 22 September, 22 October, and 22 November — then stop.
  // The January 2027 limit drops any later date, so a 22 November deposit is only
  // 22 December and 22 January. A 22 January deposit has no allowed date left.
  for (let offset = 1; offset <= 3; offset += 1) {
    const next = addUtcMonths(today, offset);
    if (next.getTime() > deadline.getTime()) break;
    monthlyDates.push(next);
  }

  if (monthlyDates.length === 0) {
    return {
      available: false,
      reason:
        "Installments are not available. There is no charge date left on or before the same day in January 2027. Pay in full.",
    };
  }

  const monthlyCount = monthlyDates.length;
  const monthlyBaseCents = Math.floor(remainingCents / monthlyCount);
  const firstInvoiceExtraCents = remainingCents - monthlyBaseCents * monthlyCount;
  if (monthlyBaseCents <= 0) {
    return {
      available: false,
      reason: "Could not build a monthly schedule. Pay in full today.",
    };
  }

  const todayCents = depositCents + firstInvoiceExtraCents;
  const monthlyCharges: InstallmentCharge[] = monthlyDates.map((date) => ({
    isoDate: toIso(date),
    amountCents: monthlyBaseCents,
    label: "monthly" as const,
  }));
  const charges: InstallmentCharge[] = [
    { isoDate: toIso(today), amountCents: todayCents, label: "deposit" },
    ...monthlyCharges,
  ];

  const first = monthlyDates[0];
  const last = monthlyDates[monthlyDates.length - 1];
  const firstMonthlyIso = toIso(first);
  const lastMonthlyIso = toIso(last);

  return {
    available: true,
    depositCents,
    todayCents,
    remainingCents,
    monthlyCount,
    monthlyBaseCents,
    firstInvoiceExtraCents,
    charges,
    firstMonthlyUnix: Math.floor(first.getTime() / 1000),
    firstMonthlyIso,
    lastMonthlyUnix: Math.floor(last.getTime() / 1000),
    lastMonthlyIso,
    cancelAtUnix: Math.floor(last.getTime() / 1000) + 3 * 24 * 60 * 60,
    chargeSchedule: monthlyCharges.map((charge) => `${charge.isoDate}:${charge.amountCents}`).join(","),
    summary: `${formatEur(todayCents)} today, then ${monthlyCount} automatic charge${monthlyCount === 1 ? "" : "s"} of ${formatEur(monthlyBaseCents)}. Last charge ${formatLongDate(lastMonthlyIso)}.`,
  };
}
