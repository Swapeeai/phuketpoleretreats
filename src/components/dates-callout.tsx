import { RETREAT } from "@/lib/retreat";
import { cn } from "@/lib/utils";

export function DatesCallout({ className }: { className?: string }) {
  return (
    <aside
      id="dates"
      className={cn(
        "border border-border bg-white/90 p-5 shadow-sm sm:p-6",
        className,
      )}
      aria-label="Retreat dates"
    >
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Dates</p>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">Camp &amp; workshops</dt>
          <dd className="mt-1 font-heading text-xl text-foreground sm:text-2xl">
            {RETREAT.headlineDates}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Hotel / accommodation package</dt>
          <dd className="mt-1 font-heading text-xl text-foreground sm:text-2xl">
            {RETREAT.accommodationDates}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Check-in 27 January · Workshops 28 January to 1 February · Official checkout 2 February
        2027.
      </p>
    </aside>
  );
}
