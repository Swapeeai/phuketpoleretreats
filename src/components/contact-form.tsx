"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LIVE } from "@/lib/live-copy";
import { PACKAGES } from "@/lib/retreat";
import { contactWhatsAppText, openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  `The Pole Art Retreat — ${LIVE.heroDates}`,
  ...PACKAGES.map((pkg) => `${pkg.title} (${LIVE.heroDates})`),
  "Not sure yet — help me choose a package",
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState(INTEREST_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please add your name.");
      return;
    }
    if (!message.trim() || message.trim().length < 8) {
      setError("Write a short message so Tara and Jenny know how to help.");
      return;
    }

    openWhatsApp(contactWhatsAppText({ name, interest, message }));
    setSent(true);
  }

  if (sent) {
    return (
      <div
        role="status"
        className="border border-primary/30 bg-accent p-6 text-sm leading-relaxed text-[#272727]"
      >
        <p className="font-heading text-2xl text-foreground">Opening WhatsApp</p>
        <p className="mt-3">
          Your note is ready for Tara and Jenny. If WhatsApp did not open, use the button below.
        </p>
        <button
          type="button"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 h-12 rounded-full px-6")}
          onClick={() => openWhatsApp(contactWhatsAppText({ name, interest, message }))}
        >
          Open WhatsApp
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error ? (
        <p role="alert" className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Your name</Label>
        <Input
          id="contact-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          className="h-11"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-interest">Package / dates of interest</Label>
        <select
          id="contact-interest"
          name="interest"
          value={interest}
          onChange={(event) => setInterest(event.target.value)}
          className="h-11 w-full border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {INTEREST_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-32"
          placeholder="Tell us about your level, who you’re travelling with, or anything you want to know about the pole camp."
        />
      </div>

      <button
        type="submit"
        className={cn(buttonVariants({ size: "lg" }), "h-12 w-full rounded-full sm:w-auto")}
      >
        Continue on WhatsApp
      </button>
    </form>
  );
}
