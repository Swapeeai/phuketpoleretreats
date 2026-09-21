import Image from "next/image";
import Link from "next/link";
import { EventJsonLd } from "@/components/event-json-ld";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEur } from "@/lib/format";
import { IMG, INSTRUCTORS, PACKAGES, RETREAT } from "@/lib/retreat";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <EventJsonLd />
      <section className="relative isolate min-h-[78vh] overflow-hidden">
        <Image
          src={IMG.heroPole}
          alt="Yvonne Smink performing pole at Phuket Pole Retreats"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1410] via-[#1c1410]/55 to-[#1c1410]/25" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 text-[#f6efe6] sm:px-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[#f6efe6]/80">
            Ayara Kamala Resort & Spa · Phuket
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-6xl">
            Pole Art Retreat
            <span className="mt-2 block text-3xl font-normal italic sm:text-4xl">
              {RETREAT.headlineDates}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#f6efe6]/85 sm:text-lg">
            A training week for intermediate, advanced and pro polers — 12 hours with Yvonne Smink,
            Adam Lin, Karem Gutierrez and Jenny Liebert. Pay in full, or put €500 down and let Stripe
            collect the rest monthly. No chasing invoices.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
              Book your spot
            </Link>
            <Link
              href="/#instructors"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-[#f6efe6]/40 bg-transparent px-5 text-[#f6efe6] hover:bg-[#f6efe6]/10 hover:text-[#f6efe6]",
              )}
            >
              Meet the instructors
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm uppercase tracking-[0.18em] text-primary">The Pole Art Retreat</p>
        <h2 className="mt-2 max-w-3xl text-3xl sm:text-4xl">
          Not a bootcamp. A creative week of flow, artistry and personal discovery.
        </h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          This retreat is not about pushing your body to its limits. It is about learning to move
          intentionally and reconnecting with what feels right through the art of pole. Throughout
          the week you combine movements, refine technique, and develop a deeper sense of style —
          in groups of 12, split by ability.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <LevelCard
            emoji="🌺"
            title="Intermediate"
            body="Fluidity and combination work. Connect familiar moves into longer, expressive sequences — rhythm, musicality, transitions, high pole and low flow."
          />
          <LevelCard
            emoji="🌹"
            title="Advanced"
            body="Creative exploration and performance depth. Advanced combos, spatial awareness, choreography labs and combo-design sessions."
          />
          <LevelCard
            emoji="✨"
            title="Pro"
            body="Combo creation, musicality, choreography and style — turning advanced vocabulary into personal artistry."
          />
        </div>
      </section>

      <section id="instructors" className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl">Instructors</h2>
          <p className="mt-2 text-muted-foreground">
            Yvonne Smink · Karem Gutierrez · Adam Lin · Jenny Liebert
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {INSTRUCTORS.map((instructor) => (
              <article key={instructor.name} className="grid gap-4 sm:grid-cols-[11rem_1fr]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 176px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl">{instructor.name}</h3>
                  <a
                    href={instructor.url}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {instructor.handle}
                  </a>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {instructor.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl sm:text-4xl">Schedule</h2>
          <p className="mt-4 text-muted-foreground">
            12 hours of pole workshops across the week, with four instructors. A welcome feast, a
            group boat trip around Phuket’s islands, and free time to explore and rest.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>Workshops: {RETREAT.headlineDates} · two 90-minute classes per day</li>
            <li>Hotel packages: check-in {RETREAT.accommodationDates.split(" – ")[0]}, check-out 2 February</li>
            <li>Maximum 12 dancers per group · intermediate, advanced, pro</li>
            <li>Welcome dinner with Thai specialities and a sea view</li>
            <li>Optional extra: photoshoot</li>
          </ul>
        </div>
        <div className="relative min-h-72 overflow-hidden rounded-2xl">
          <Image
            src={IMG.aerialHotel}
            alt="Aerial view of Ayara Kamala Resort & Spa in Phuket"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-[#1c1410] py-16 text-[#f6efe6]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative min-h-72 overflow-hidden rounded-2xl">
            <Image
              src={IMG.studio}
              alt="Air-conditioned pole studio at Ayara Kamala Phuket"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl">The studio & hotel</h2>
            <p className="mt-4 text-[#f6efe6]/75">
              Beautiful air-conditioned studio inside Ayara Kamala: nine floor-to-ceiling fixed poles,
              3 metres tall, a mix of 45mm and 40mm, chrome, stainless, and two powder coat. Crash
              mats available.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-[#f6efe6]/80">
              <li>Book workshops only, or workshop + accommodation at the same hotel</li>
              <li>Daily buffet and à la carte breakfast on hotel packages</li>
              <li>5-minute shuttle to Kamala beach, shops and restaurants</li>
              <li>60-minute massage included on hotel packages</li>
              <li>Partners, friends and family welcome as non-polers on a Solo room</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl">Packages</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Same prices as the live site. Pay in full, or €500 today and automatic monthly Stripe
              charges until the balance is paid.
            </p>
          </div>
          <Link href="/book" className={cn(buttonVariants({ variant: "outline" }))}>
            See all packages
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {PACKAGES.map((pkg) => (
            <Card key={pkg.slug} className="overflow-hidden pt-0">
              <div className="relative h-48">
                <Image
                  src={pkg.images[0]}
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-xl">{pkg.title}</CardTitle>
                  <Badge variant="secondary">from {formatEur(pkg.fromCents)}</Badge>
                </div>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/book/${pkg.slug}`} className={cn(buttonVariants(), "w-full sm:w-auto")}>
                  Book {pkg.title}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

function LevelCard({
  emoji,
  title,
  body,
}: {
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-lg">
        {emoji} {title}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
