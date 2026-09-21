import { LIVE } from "@/lib/live-copy";
import {
  TIMETABLE_DAYS,
  TIMETABLE_META,
  type InstructorName,
  type TimetableDay,
  type TimetableSlot,
  type WorkshopLevel,
} from "@/lib/timetable";
import { cn } from "@/lib/utils";

const LEVEL_CLASS: Record<WorkshopLevel, string> = {
  Intermediate: "bg-aqua text-primary",
  Advanced: "bg-sky text-ocean",
  "Advanced-Pro": "bg-primary/10 text-primary",
};

const INSTRUCTOR_BAR: Record<InstructorName, string> = {
  "Karem Gutierrez": "border-l-primary",
  "Adam Lin": "border-l-ocean",
  "Yvonne Smink": "border-l-sunset",
  "Jenny Liebert": "border-l-jungle",
};

export function WorkshopTimetable() {
  return (
    <section id="timetable" className="bg-sand py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-primary">
          {TIMETABLE_META.eyebrow}
        </p>
        <h2 className="mt-3 text-center text-4xl sm:text-5xl">{TIMETABLE_META.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-foreground">
          {LIVE.schedule}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          {TIMETABLE_META.workshopsLine}. {TIMETABLE_META.accommodationLine}.
        </p>

        <div className="mt-10 hidden xl:block">
          <DesktopTable />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:hidden">
          {TIMETABLE_DAYS.map((day) => (
            <DayCard key={day.id} day={day} />
          ))}
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {TIMETABLE_META.facts.map((fact) => (
            <li
              key={fact}
              className="border border-border bg-white/80 px-3 py-1.5 text-foreground/80"
            >
              {fact}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <LegendSwatch className={LEVEL_CLASS.Intermediate} label="Intermediate" />
          <LegendSwatch className={LEVEL_CLASS.Advanced} label="Advanced" />
          <LegendSwatch className={LEVEL_CLASS["Advanced-Pro"]} label="Advanced-Pro" />
        </div>
      </div>
    </section>
  );
}

function DesktopTable() {
  const maxSlots = Math.max(...TIMETABLE_DAYS.map((day) => day.slots.length));

  return (
    <div className="overflow-x-auto border border-border bg-white/90 shadow-sm">
      <table className="w-full min-w-[68rem] border-collapse text-left">
        <caption className="sr-only">
          Workshop timetable for the Pole Art Retreat, 28 January to 1 February 2027. Hotel
          package 27 January to 2 February 2027.
        </caption>
        <thead>
          <tr className="bg-sky/80">
            {TIMETABLE_DAYS.map((day) => (
              <th
                key={day.id}
                scope="col"
                className="border-b border-r border-border px-3 py-4 last:border-r-0"
              >
                <span className="block font-heading text-lg font-semibold text-foreground">
                  {day.weekday}
                </span>
                <span className="mt-0.5 block text-xs font-medium uppercase tracking-[0.16em] text-primary">
                  {day.dateLabel}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxSlots }, (_, row) => (
            <tr key={`slot-row-${row}`}>
              {TIMETABLE_DAYS.map((day) => {
                const slot = day.slots[row];
                return (
                  <td
                    key={`${day.id}-${row}`}
                    className="align-top border-b border-r border-border p-2 last:border-r-0"
                  >
                    {slot ? (
                      <SlotCard slot={slot} isoDate={day.isoDate} />
                    ) : (
                      <span className="sr-only">No class</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            {TIMETABLE_DAYS.map((day) => (
              <td
                key={`${day.id}-note`}
                className="align-top border-r border-border p-2 last:border-r-0"
              >
                {day.note ? <DayNote day={day} /> : null}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function DayCard({ day }: { day: TimetableDay }) {
  return (
    <article className="border border-border bg-white/90 p-4 shadow-sm">
      <header className="border-b border-border pb-3">
        <h3 className="font-heading text-2xl">{day.weekday}</h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-primary">
          {day.dateLabel}
        </p>
      </header>
      <ol className="mt-4 space-y-2">
        {day.slots.map((slot) => (
          <li key={`${slot.start}-${slot.title}`}>
            <SlotCard slot={slot} isoDate={day.isoDate} />
          </li>
        ))}
      </ol>
      {day.note ? (
        <div className="mt-3">
          <DayNote day={day} />
        </div>
      ) : null}
    </article>
  );
}

function SlotCard({ slot, isoDate }: { slot: TimetableSlot; isoDate: string }) {
  return (
    <div
      className={cn(
        "h-full border border-border/80 bg-sand/40 px-3 py-2.5",
        "border-l-[3px]",
        INSTRUCTOR_BAR[slot.instructor],
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <time dateTime={`${isoDate}T${slot.start}`}>{slot.start}</time>
        –{slot.end}
      </p>
      <p className="mt-1.5">
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]",
            LEVEL_CLASS[slot.level],
          )}
        >
          {slot.level}
        </span>
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{slot.instructor}</p>
      <p className="mt-0.5 text-sm font-medium leading-snug text-foreground">{slot.title}</p>
    </div>
  );
}

function DayNote({ day }: { day: TimetableDay }) {
  if (!day.note) return null;
  const className =
    "block border border-ocean/20 bg-sky px-3 py-3 text-sm leading-snug text-foreground";
  if (day.note.href) {
    return (
      <a href={day.note.href} className={cn(className, "transition-colors hover:bg-aqua")}>
        {day.note.label}
      </a>
    );
  }
  return <p className={className}>{day.note.label}</p>;
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-2.5 rounded-full", className)} />
      {label}
    </span>
  );
}
