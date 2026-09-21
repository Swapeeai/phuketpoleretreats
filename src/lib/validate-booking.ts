import { buildInstallmentPlan } from "@/lib/installments";
import type { BookingPayload } from "@/lib/booking";
import {
  getPackage,
  getVariant,
  RETREAT,
  type Occupancy,
  type RetreatPackage,
  type PackageVariant,
} from "@/lib/retreat";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type BookingValidation =
  | { ok: false; error: string; field?: string }
  | {
      ok: true;
      booking: BookingPayload;
      pkg: RetreatPackage;
      variant: PackageVariant;
      retreat: typeof RETREAT;
    };

export function validateBooking(input: Partial<BookingPayload>): BookingValidation {
  if (!input.packageSlug) return { ok: false, error: "Choose a retreat package.", field: "packageSlug" };
  const pkg = getPackage(input.packageSlug);
  if (!pkg) return { ok: false, error: "That package is not available.", field: "packageSlug" };

  const occupancy = (input.occupancy ?? null) as Occupancy | null;
  if (pkg.includesHotel && occupancy !== "shared" && occupancy !== "solo") {
    return { ok: false, error: "Choose Shared or Solo occupancy.", field: "occupancy" };
  }

  const variant = getVariant(pkg, pkg.includesHotel ? occupancy : null);
  if (!variant) return { ok: false, error: "That room option is not available.", field: "occupancy" };

  if (!input.fullName?.trim()) return { ok: false, error: "Enter the dancer’s full name.", field: "fullName" };
  if (!input.email?.trim() || !EMAIL_RE.test(input.email.trim())) {
    return {
      ok: false,
      error: "Enter a valid email so we can send your booking confirmation.",
      field: "email",
    };
  }
  if (!input.phone?.trim()) return { ok: false, error: "Enter a phone or WhatsApp number.", field: "phone" };
  if (!input.level) {
    return { ok: false, error: "Choose your training level so we can place you in a group.", field: "level" };
  }
  if (input.paymentPlan !== "full" && input.paymentPlan !== "installments") {
    return { ok: false, error: "Choose pay in full or installments.", field: "paymentPlan" };
  }
  if (!input.acceptPolicy) {
    return {
      ok: false,
      error: "Please confirm you have read the cancellation policy. Bookings are non-refundable.",
      field: "acceptPolicy",
    };
  }

  if (input.paymentPlan === "installments") {
    const plan = buildInstallmentPlan(variant.priceCents);
    if (!plan.available) {
      return { ok: false, error: plan.reason, field: "paymentPlan" };
    }
  }

  return {
    ok: true,
    booking: {
      packageSlug: pkg.slug,
      occupancy: pkg.includesHotel ? occupancy : null,
      paymentPlan: input.paymentPlan,
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      instagram: input.instagram?.trim() ?? "",
      level: input.level,
      roommateNotes: input.roommateNotes?.trim() ?? "",
      acceptPolicy: true,
    },
    pkg,
    variant,
    retreat: RETREAT,
  };
}
