import Link from "next/link";
import { WORKSHOP_INSTRUCTORS, WORKSHOP_INTRO } from "@/lib/workshop-descriptions";

const introClassName =
  "mx-auto max-w-3xl border-t border-border pt-8 text-center font-heading text-2xl leading-snug text-foreground sm:text-3xl";

export function WorkshopIntroLead() {
  return (
    <div className="text-center">
      <p className={introClassName}>{WORKSHOP_INTRO}</p>
      <Link
        href="/timetable#workshops"
        className="mt-5 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        See the workshop descriptions
      </Link>
    </div>
  );
}

export function WorkshopDescriptions() {
  return (
    <div id="workshops">
      <p className={introClassName}>{WORKSHOP_INTRO}</p>
      <h2 className="mt-8 text-center text-2xl sm:text-3xl">Workshops descriptions</h2>
      <div className="mt-10 space-y-14">
        {WORKSHOP_INSTRUCTORS.map((instructor) => (
          <section key={instructor.name}>
            <h2 className="text-3xl sm:text-4xl">{instructor.name}</h2>
            <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {instructor.workshops.map((workshop) => (
                <article key={workshop.title}>
                  <h3 className="text-xl sm:text-2xl">{workshop.title}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {workshop.level}
                  </p>
                  <div className="mt-3 space-y-3">
                    {workshop.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-[#272727]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
