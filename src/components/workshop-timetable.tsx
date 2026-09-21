import Image from "next/image";
import { LIVE } from "@/lib/live-copy";
import { TIMETABLE } from "@/lib/images";
import { TIMETABLE_DAYS, TIMETABLE_META } from "@/lib/timetable";

export function WorkshopTimetable({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const Title = heading;
  return (
    <section id="timetable" className="bg-sand py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-primary">
          {TIMETABLE_META.eyebrow}
        </p>
        <Title className="mt-3 text-center text-4xl sm:text-5xl">{TIMETABLE_META.title}</Title>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-foreground">
          {LIVE.schedule}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          {TIMETABLE_META.workshopsLine}. {TIMETABLE_META.accommodationLine}.
        </p>

        <figure className="mt-10">
          <a
            href={TIMETABLE.src}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden border border-border bg-white shadow-sm"
            aria-label="Open the full workshop timetable image"
          >
            <Image
              src={TIMETABLE.src}
              alt={TIMETABLE.alt}
              width={TIMETABLE.width}
              height={TIMETABLE.height}
              sizes="(max-width: 1152px) 100vw, 1152px"
              unoptimized
              className="h-auto w-full"
            />
          </a>
          <figcaption className="mt-3 text-center text-xs text-muted-foreground">
            Tap or click the timetable to open it full size.
          </figcaption>
        </figure>

        <TimetableTextFallback />

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
      </div>
    </section>
  );
}

/** Screen-reader / SEO transcript of the graphic — not shown visually. */
function TimetableTextFallback() {
  return (
    <div className="sr-only">
      <h3>Workshop timetable, text version</h3>
      {TIMETABLE_DAYS.map((day) => (
        <section key={day.id}>
          <h4>
            {day.weekday} {day.dateLabel}
          </h4>
          <ul>
            {day.slots.map((slot) => (
              <li key={`${day.id}-${slot.start}-${slot.title}`}>
                {slot.start}–{slot.end}: {slot.level}, {slot.instructor}, {slot.title}
              </li>
            ))}
            {day.note ? <li>{day.note.label}</li> : null}
          </ul>
        </section>
      ))}
    </div>
  );
}
