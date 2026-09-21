import { RETREAT } from "@/lib/retreat";

export function DatesBar() {
  return (
    <aside
      id="dates"
      className="border-b border-primary/20 bg-primary text-primary-foreground"
      aria-label="Retreat dates"
    >
      <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-6">
        <dl className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-center sm:gap-x-10 sm:gap-y-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground/80">
              Camp &amp; workshops
            </dt>
            <dd className="text-sm font-medium sm:text-[15px]">
              <span className="sm:hidden">28 Jan – 1 Feb 2027</span>
              <span className="hidden sm:inline">{RETREAT.headlineDates}</span>
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground/80">
              Hotel / accommodation package
            </dt>
            <dd className="text-sm font-medium sm:text-[15px]">
              <span className="sm:hidden">27 Jan – 2 Feb 2027</span>
              <span className="hidden sm:inline">{RETREAT.accommodationDates}</span>
            </dd>
          </div>
        </dl>
        <p className="mt-1 text-[11px] leading-snug text-primary-foreground/85 sm:text-center">
          <span className="sm:hidden">
            Check-in 27 Jan · Workshops 28 Jan–1 Feb · Official checkout 2 Feb 2027
          </span>
          <span className="hidden sm:inline">
            Check-in 27 January · Workshops 28 January to 1 February · Official checkout 2 February
            2027.
          </span>
        </p>
      </div>
    </aside>
  );
}
