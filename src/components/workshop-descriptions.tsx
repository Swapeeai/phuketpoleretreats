import Link from "next/link";
import { WORKSHOP_INSTRUCTORS, WORKSHOP_INTRO } from "@/lib/workshop-descriptions";

function WorkshopIntroBlock() {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-heading text-4xl leading-none tracking-[0.08em] text-primary sm:text-5xl">
        WORKSHOPS
      </p>
      <p className="border border-primary bg-white px-4 py-3 text-sm leading-snug text-foreground">
        “{WORKSHOP_INTRO}”
      </p>
    </div>
  );
}

export function WorkshopIntroLead() {
  return (
    <div>
      <WorkshopIntroBlock />
      <Link
        href="/timetable#workshops"
        className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        See the workshop descriptions
      </Link>
    </div>
  );
}

export function WorkshopDescriptions() {
  return (
    <div id="workshops">
      <WorkshopIntroBlock />
      <div className="mt-8 space-y-14">
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
