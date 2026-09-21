"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LIVE } from "@/lib/live-copy";
import { chatWhatsAppText, openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const panelId = useId();
  const titleId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function send() {
    setError(null);
    if (!message.trim() || message.trim().length < 4) {
      setError("Type a short message and we’ll open WhatsApp.");
      return;
    }
    openWhatsApp(chatWhatsAppText({ name, message }));
    setOpen(false);
    setMessage("");
  }

  return (
    <div className="pointer-events-none fixed right-3 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 sm:right-5">
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-testid="chat-panel"
          className="pointer-events-auto mb-3 w-[min(22rem,calc(100vw-1.5rem))] border border-border bg-card shadow-xl"
        >
          <div className="flex items-start justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p id={titleId} className="font-heading text-xl">
                How can I help you?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/90">Message us on WhatsApp</p>
            </div>
            <button
              type="button"
              className="rounded-full p-1 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Close chat"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-sm leading-relaxed text-[#272727]">{LIVE.contactLine}</p>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="chat-name">Name (optional)</Label>
              <Input
                ref={firstFieldRef}
                id="chat-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-10"
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="chat-message">Message</Label>
              <Textarea
                id="chat-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-24"
                placeholder="Ask about levels, rooms, or the pole training week…"
              />
            </div>
            <button
              type="button"
              className={cn(buttonVariants({ size: "lg" }), "h-11 w-full rounded-full")}
              onClick={send}
            >
              Continue on WhatsApp
            </button>
          </div>
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        data-testid="chat-bubble"
        className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-sky transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="How can I help you?"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
