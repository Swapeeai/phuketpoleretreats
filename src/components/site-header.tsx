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
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Retreat" },
  { href: "/#instructors", label: "Instructors" },
  { href: "/book", label: "Book" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={IMG.logo}
            alt="Phuket Pole Retreats"
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
              className="text-sm text-[#3e3e3e] transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
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
