import type { Level, Occupancy, PaymentPlan } from "@/lib/retreat";

export type BookingPayload = {
  packageSlug: string;
  occupancy: Occupancy | null;
  paymentPlan: PaymentPlan;
  fullName: string;
  email: string;
  phone: string;
  instagram: string;
  level: Level;
  roommateNotes: string;
  acceptPolicy: boolean;
};

export type CheckoutError = {
  error: string;
  field?: string;
};
