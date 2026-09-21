"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { buildInstallmentPlan } from "@/lib/installments";
import { formatEur, formatShortDate } from "@/lib/format";
import { RETREAT, type Level, type Occupancy, type PaymentPlan, type RetreatPackage } from "@/lib/retreat";
import { getVariant } from "@/lib/retreat";
import { cn } from "@/lib/utils";

type Props = {
  pkg: RetreatPackage;
  cancelled?: boolean;
};

export function BookingForm({ pkg, cancelled }: Props) {
  const router = useRouter();
  const [occupancy, setOccupancy] = useState<Occupancy | "">(
    pkg.includesHotel ? "" : "",
  );
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>("installments");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [level, setLevel] = useState<Level | "">("");
  const [roommateNotes, setRoommateNotes] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [error, setError] = useState<string | null>(cancelled ? "Checkout was cancelled. Nothing was charged." : null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedOccupancy = pkg.includesHotel ? (occupancy || null) : null;
  const variant = getVariant(pkg, selectedOccupancy as Occupancy | null);
  const totalCents = variant?.priceCents ?? null;
  const installment = useMemo(
    () => (totalCents ? buildInstallmentPlan(totalCents) : null),
    [totalCents],
  );

  async function submitBooking() {
    setError(null);
    setFieldError(null);

    if (pkg.includesHotel && !occupancy) {
      setFieldError("occupancy");
      setError("Choose Shared or Solo occupancy.");
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim() || !level || !acceptPolicy) {
      setError("Fill in name, email, phone, level, and accept the cancellation policy.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageSlug: pkg.slug,
          occupancy: pkg.includesHotel ? occupancy : null,
          paymentPlan,
          fullName,
          email,
          phone,
          instagram,
          level,
          roommateNotes,
          acceptPolicy,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string; field?: string };
      if (!response.ok || !data.url) {
        setError(data.error || "We could not start checkout. Try again or message us on WhatsApp.");
        setFieldError(data.field ?? null);
        setSubmitting(false);
        return;
      }
      router.push(data.url);
    } catch {
      setError("Network error — check your connection and try again.");
      setSubmitting(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    await submitBooking();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {error ? (
        <div
          role="alert"
          data-testid="booking-error"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {pkg.includesHotel ? (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Occupancy</legend>
          <RadioGroup
            value={occupancy}
            onValueChange={(value) => {
              if (value === "shared" || value === "solo") {
                setOccupancy(value);
                setError((current) =>
                  current === "Choose Shared or Solo occupancy." ? null : current,
                );
                setFieldError((current) => (current === "occupancy" ? null : current));
              }
            }}
            className="grid gap-3 sm:grid-cols-2"
            aria-invalid={fieldError === "occupancy"}
          >
            {pkg.variants.map((item) => (
              <label
                key={item.occupancy}
                data-testid={`occupancy-${item.occupancy}`}
                onClick={() => {
                  if (!item.occupancy) return;
                  setOccupancy(item.occupancy);
                  setError((current) =>
                    current === "Choose Shared or Solo occupancy." ? null : current,
                  );
                  setFieldError((current) => (current === "occupancy" ? null : current));
                }}
                className={`flex cursor-pointer flex-col gap-1 border bg-card p-4 ${
                  occupancy === item.occupancy
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                <span className="flex items-center gap-2">
                  <RadioGroupItem value={item.occupancy!} aria-label={item.occupancy ?? "package"} />
                  <span className="font-medium capitalize">{item.occupancy}</span>
                </span>
                <span className="pl-6 text-sm text-muted-foreground">
                  {formatEur(item.priceCents)}
                </span>
              </label>
            ))}
          </RadioGroup>
          <p className="text-sm text-muted-foreground">
            Shared is with another retreat guest (tell us who, or we can match you). Solo is the room
            to yourself — or with a non-poler, who stays free.
          </p>
        </fieldset>
      ) : (
        <p className="rounded-lg bg-muted px-4 py-3 text-sm">
          Workshops only — {formatEur(pkg.fromCents)}. You book your own hotel and transport to Ayara
          Kamala.
        </p>
      )}

      <fieldset className="space-y-3">
        <legend className="font-heading text-xl">How would you like to pay?</legend>
        <p className="text-sm leading-relaxed text-[#272727]">
          Pay in full, or €500 deposit today and monthly payments after — finishing by{" "}
          {formatShortDate(RETREAT.balanceDeadlineIso)}, 60 days before the retreat.
        </p>
        <RadioGroup
          value={paymentPlan}
          onValueChange={(value) => {
            if (value === "full" || value === "installments") setPaymentPlan(value);
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <label
            data-testid="plan-full"
            onClick={() => setPaymentPlan("full")}
            className={`flex cursor-pointer flex-col gap-2 border bg-card p-5 transition-shadow ${
              paymentPlan === "full"
                ? "border-primary ring-2 ring-primary/25 shadow-[0_0_0_4px_rgba(27,127,120,0.12)]"
                : "border-border hover:border-primary/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <RadioGroupItem value="full" aria-label="Pay in full" />
              <span className="text-sm font-medium uppercase tracking-[0.12em] text-primary">
                Pay in full
              </span>
            </span>
            <span className="pl-6 font-heading text-3xl">
              {totalCents ? formatEur(totalCents) : "Package total"}
            </span>
            <span className="pl-6 text-sm text-[#3e3e3e]">Pay the package total today.</span>
          </label>
          <label
            data-testid="plan-installments"
            onClick={() => {
              if (installment?.available !== false) setPaymentPlan("installments");
            }}
            className={`flex cursor-pointer flex-col gap-2 border bg-card p-5 transition-shadow ${
              paymentPlan === "installments"
                ? "border-primary ring-2 ring-primary/25 shadow-[0_0_0_4px_rgba(27,127,120,0.12)]"
                : "border-border hover:border-primary/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <RadioGroupItem
                value="installments"
                aria-label="€500 deposit today and monthly payments after"
                disabled={installment?.available === false}
              />
              <span className="text-sm font-medium uppercase tracking-[0.12em] text-primary">
                Deposit today
              </span>
            </span>
            <span className="pl-6 font-heading text-3xl">€500</span>
            <span className="pl-6 text-sm text-[#3e3e3e]">
              {installment?.available
                ? installment.summary
                : installment?.reason ?? "Choose occupancy to see the monthly payments."}
            </span>
          </label>
        </RadioGroup>
        {paymentPlan === "installments" && installment?.available ? (
          <ol className="space-y-2 border border-border bg-sand p-4 text-sm">
            {installment.charges.map((charge) => (
              <li key={`${charge.label}-${charge.isoDate}`} className="flex justify-between gap-4">
                <span>
                  {charge.label === "deposit" ? "€500 deposit today" : "Monthly payment"} ·{" "}
                  {formatShortDate(charge.isoDate)}
                </span>
                <span className="font-medium">{formatEur(charge.amountCents)}</span>
              </li>
            ))}
          </ol>
        ) : null}
        <p className="text-xs leading-relaxed text-[#3e3e3e]">
          DEPOSIT option, pay 500 EUR upon booking and the remaining payment up to 60 days before
          the start of the retreat. Last monthly payment is on or before{" "}
          {formatShortDate(RETREAT.balanceDeadlineIso)}. Payments are non-refundable.
        </p>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            className="h-10"
            aria-invalid={fieldError === "fullName"}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="h-10"
            aria-invalid={fieldError === "email"}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className="h-10"
            aria-invalid={fieldError === "phone"}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="instagram">Instagram (optional)</Label>
          <Input
            id="instagram"
            name="instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@you"
            className="h-10"
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Training level</legend>
        <RadioGroup
          value={level}
          onValueChange={(value) => {
            if (value === "Intermediate" || value === "Advanced" || value === "Pro") {
              setLevel(value);
            }
          }}
          className="grid gap-2 sm:grid-cols-3"
        >
          {RETREAT.levels.map((item) => (
            <label
              key={item}
              data-testid={`level-${item}`}
              onClick={() => setLevel(item)}
              className={`flex cursor-pointer items-center gap-2 border bg-card px-3 py-2 text-sm ${
                level === item ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <RadioGroupItem value={item} aria-label={item} />
              {item}
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="roommateNotes">Roommate or sharing notes (optional)</Label>
        <Textarea
          id="roommateNotes"
          value={roommateNotes}
          onChange={(e) => setRoommateNotes(e.target.value)}
          placeholder="Who you are sharing with, or ask us to match you with another solo guest."
          className="min-h-20"
        />
      </div>

      <label className="flex items-start gap-3 text-sm">
        <Checkbox
          checked={acceptPolicy}
          onCheckedChange={(value) => setAcceptPolicy(Boolean(value))}
          className="mt-0.5"
          aria-label="Accept cancellation policy"
        />
        <span>
          I have read the{" "}
          <Link href="/cancellation" className="underline underline-offset-2">
            cancellation policy
          </Link>
          . Bookings are non-refundable.
        </span>
      </label>

      <button
        type="button"
        data-testid="submit-booking"
        className={cn(buttonVariants({ size: "lg" }), "h-12 w-full rounded-full sm:w-auto disabled:opacity-50")}
        disabled={submitting}
        onClick={() => void submitBooking()}
      >
        {submitting
          ? "Starting checkout…"
          : paymentPlan === "full"
            ? `Pay ${totalCents ? formatEur(totalCents) : "in full"} today`
            : "Pay €500 deposit today"}
      </button>
    </form>
  );
}
