import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LIVE } from "@/lib/live-copy";
import { IMG } from "@/lib/retreat";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

const NAV = [
  { href: "/", label: "Retreat" },
  { href: "/#instructors", label: "Instructors" },
  { href: "/#timetable", label: "Timetable" },
  { href: "/book", label: "Book" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={IMG.logo}
            alt="Phuket Pole Retreats logo — pole camp in Kamala, Phuket"
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
          <span className="font-heading text-lg tracking-tight sm:text-xl">{LIVE.siteName}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#4a5a52] transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4a5a52] transition-colors hover:text-primary"
            aria-label={`Instagram @${INSTAGRAM_HANDLE}`}
          >
            <InstagramIcon className="size-5" />
          </a>
          <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "h-10 rounded-full px-5")}>
            {LIVE.bookNow}
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "md:hidden")}
            aria-label="Open menu"
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-3 px-4">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="py-1 text-base">
                  {item.label}
                </Link>
              ))}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 text-base"
              >
                Instagram @{INSTAGRAM_HANDLE}
              </a>
              <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "mt-2 h-11 rounded-full")}>
                {LIVE.bookNow}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
