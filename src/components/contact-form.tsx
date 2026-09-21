"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactWhatsAppText, openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type FieldKey = "name" | "email" | "whatsapp" | "subject" | "message";
type FieldErrors = Partial<Record<FieldKey, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitCount(value: string) {
  return value.replace(/\D/g, "").length;
}

function validate(fields: Record<FieldKey, string>): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.name.trim()) {
    errors.name = "Please add your name.";
  }
  if (!fields.email.trim()) {
    errors.email = "Please add your email address.";
  } else if (!EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = "Enter a valid email, like name@example.com.";
  }
  if (!fields.whatsapp.trim()) {
    errors.whatsapp = "Please add your WhatsApp number.";
  } else if (digitCount(fields.whatsapp) < 8) {
    errors.whatsapp = "Enter a WhatsApp number we can reply to, including the country code.";
  }
  if (!fields.subject.trim()) {
    errors.subject = "Please add a subject for your enquiry.";
  }
  if (!fields.message.trim() || fields.message.trim().length < 8) {
    errors.message = "Write a short message so we know how to help.";
  }
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);

  const payload = { name, email, whatsapp, subject, message };

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = (["name", "email", "whatsapp", "subject", "message"] as FieldKey[]).find(
        (key) => nextErrors[key],
      );
      if (first) {
        document.getElementById(`contact-${first}`)?.focus();
      }
      return;
    }

    openWhatsApp(contactWhatsAppText(payload));
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
          Your message is ready to send. If WhatsApp did not open, use the button below.
        </p>
        <button
          type="button"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 h-12 rounded-full px-6")}
          onClick={() => openWhatsApp(contactWhatsAppText(payload))}
        >
          Open WhatsApp
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Your name</Label>
        <Input
          id="contact-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          className="h-11"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        <FieldError id="contact-name-error" message={errors.name} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="h-11"
          required
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        <FieldError id="contact-email-error" message={errors.email} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-whatsapp">WhatsApp number</Label>
        <Input
          id="contact-whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
          autoComplete="tel"
          className="h-11"
          required
          placeholder="+66 92 000 0000"
          aria-invalid={Boolean(errors.whatsapp)}
          aria-describedby={errors.whatsapp ? "contact-whatsapp-error" : undefined}
        />
        <FieldError id="contact-whatsapp-error" message={errors.whatsapp} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          name="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="h-11"
          required
          placeholder="What is your enquiry about?"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        />
        <FieldError id="contact-subject-error" message={errors.subject} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-32"
          required
          placeholder="Tell us about your level, who you’re travelling with, or anything you want to know about the pole camp."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        <FieldError id="contact-message-error" message={errors.message} />
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
