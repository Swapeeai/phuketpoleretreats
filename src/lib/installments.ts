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
      remainingCents: number;
      monthlyCount: number;
      charges: InstallmentCharge[];
      firstMonthlyUnix: number;
      cancelAtUnix: number;
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

function addUtcMonths(date: Date, months: number) {
  const next = utcDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + months,
    date.getUTCDate(),
  );
  if (next.getUTCDate() !== date.getUTCDate()) {
    return utcDate(next.getUTCFullYear(), next.getUTCMonth() + 1, 0);
  }
  return next;
}

export function buildInstallmentPlan(
  totalCents: number,
  now = new Date(),
): InstallmentPlan {
  const depositCents = RETREAT.depositCents;
  const remainingCents = totalCents - depositCents;

  if (remainingCents <= 0) {
    return {
      available: false,
      reason: "This package is covered by the deposit. Pay in full today.",
    };
  }

  const deadline = new Date(`${RETREAT.balanceDeadlineIso}T00:00:00Z`);
  const today = utcDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const firstMonthly = addUtcMonths(today, 1);
  const monthlyDates: Date[] = [];
  let cursor = firstMonthly;

  while (cursor.getTime() <= deadline.getTime()) {
    monthlyDates.push(cursor);
    cursor = addUtcMonths(cursor, 1);
  }

  if (monthlyDates.length === 0) {
    return {
      available: false,
      reason:
        "Monthly installments need at least one billing date before 28 November 2026 (60 days before check-in). Pay in full to book this close to the retreat.",
    };
  }

  const monthlyCount = monthlyDates.length;
  const monthlyCents = Math.ceil(remainingCents / monthlyCount);
  const monthlyCharges: InstallmentCharge[] = monthlyDates.map((date) => ({
    isoDate: toIso(date),
    amountCents: monthlyCents,
    label: "monthly" as const,
  }));

  const lastMonthly = monthlyDates[monthlyDates.length - 1];
  const charges: InstallmentCharge[] = [
    {
      isoDate: toIso(today),
      amountCents: depositCents,
      label: "deposit",
    },
    ...monthlyCharges,
  ];

  const monthlyLabel =
    monthlyCount === 1
      ? `${formatMonth(monthlyCharges[0].isoDate)}`
      : `${formatMonth(monthlyCharges[0].isoDate)}–${formatMonth(monthlyCharges[monthlyCount - 1].isoDate)}`;

  return {
    available: true,
    depositCents,
    remainingCents,
    monthlyCount,
    charges,
    firstMonthlyUnix: Math.floor(monthlyDates[0].getTime() / 1000),
    cancelAtUnix: Math.floor(lastMonthly.getTime() / 1000) + 3 * 24 * 60 * 60,
    summary: `€500 deposit today, then ${monthlyCount} automatic monthly payment${monthlyCount === 1 ? "" : "s"} (${monthlyLabel}) charged to the same card for the remaining balance.`,
  };
}

function formatMonth(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
