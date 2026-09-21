import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-4xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        That URL is not part of the 2027 Phuket Pole Retreats site. Head back to the retreat or
        booking page.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className={cn(buttonVariants())}>
          Home
        </Link>
        <Link href="/book" className={cn(buttonVariants({ variant: "outline" }))}>
          Book
        </Link>
      </div>
    </div>
  );
}
