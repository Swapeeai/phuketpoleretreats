import Image from "next/image";
import Link from "next/link";
import { BoatDay } from "@/components/boat-day";
import { FaqList } from "@/components/faq-list";
import { HeroVideo } from "@/components/hero-video";
import { InstagramGallery } from "@/components/instagram-gallery";
import { JsonLd } from "@/components/json-ld";
import { ScenicBand, ScenicSection } from "@/components/scenic";
import { buttonVariants } from "@/components/ui/button";
import { WorkshopTimetable } from "@/components/workshop-timetable";
import { LIVE, LIVE_PACKAGE_BLURB, LIVE_PACKAGE_ORDER } from "@/lib/live-copy";
import { formatEur } from "@/lib/format";
import { SCENERY, VENUE } from "@/lib/images";
import { FAQS, INSTRUCTORS, PACKAGES } from "@/lib/retreat";
import { eventJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

function HighlightedLead({ text, highlight }: { text: string; highlight: string }) {
  const index = text.indexOf(highlight);
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-primary italic">{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}

export default function HomePage() {
  const packages = LIVE_PACKAGE_ORDER.map((slug) => PACKAGES.find((pkg) => pkg.slug === slug)).filter(
    (pkg): pkg is (typeof PACKAGES)[number] => Boolean(pkg),
  );

  return (
    <>
      <JsonLd data={eventJsonLd()} />
      <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-black">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-4 py-28 text-center text-white sm:px-6">
          <p className="hero-copy text-sm uppercase tracking-[0.35em] text-white/85">{LIVE.welcome}</p>
          <h1 className="hero-copy mt-4 font-heading text-5xl leading-[1.05] sm:text-7xl">{LIVE.siteName}</h1>
          <p className="hero-copy mt-6 text-lg font-medium sm:text-2xl">{LIVE.heroDates}</p>
          <p className="hero-copy mt-3 max-w-2xl text-sm text-white/90 sm:text-base">{LIVE.heroInstructors}</p>
          <Link
            href="/book"
            className={cn(
              buttonVariants({ size: "lg" }),
              "hero-copy mt-10 h-12 rounded-full px-8 text-sm uppercase tracking-[0.18em]",
            )}
          >
            {LIVE.bookNow}
          </Link>
        </div>
      </section>

      <ScenicBand src={SCENERY.kamalaIslands.src} alt={SCENERY.kamalaIslands.alt} />

      <section id="instructors" className="bg-sand py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-4xl sm:text-5xl">Instructors</h2>
          <p className="mt-3 text-center text-muted-foreground">{LIVE.heroInstructors}</p>
          <div className="mt-14 grid gap-14 md:grid-cols-2">
            {INSTRUCTORS.map((instructor) => (
              <article key={instructor.name} className="grid gap-5 sm:grid-cols-[11rem_1fr]">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <Image
                    src={instructor.image}
                    alt={`${instructor.name}, instructor at the Phuket Pole Art Retreat`}
                    fill
                    sizes="(max-width: 640px) 100vw, 176px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl">{instructor.name}</h3>
                  <a
                    href={instructor.url}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {instructor.handle}
                  </a>
                  {instructor.bio.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-[#272727]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ScenicSection
        id="levels"
        src={SCENERY.turquoiseLongtail.src}
        alt={SCENERY.turquoiseLongtail.alt}
        overlayClassName="bg-gradient-to-b from-sky/50 via-white/58 to-sky/55"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 id="pole-art-heading" className="sr-only">
            The Pole Art Retreat
          </h2>
          <p className="text-lg leading-relaxed text-foreground sm:text-xl">
            <HighlightedLead text={LIVE.uniqueExperience} highlight={LIVE.uniqueHighlight} />
          </p>
          <p className="mt-6 text-base leading-relaxed text-foreground/85 sm:text-lg">{LIVE.notPushing}</p>
          <p className="mt-6 text-base leading-relaxed text-foreground/85 sm:text-lg">{LIVE.moreThanCamp}</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
          <LevelCard title={LIVE.intermediateTitle} body={LIVE.intermediate} />
          <LevelCard title={LIVE.advancedTitle} body={LIVE.advanced} />
          <LevelCard title={LIVE.proTitle} body={`${LIVE.pro} ${LIVE.proClose}`} />
        </div>
        <div className="mt-14 text-center">
          <p className="font-heading text-2xl text-foreground sm:text-3xl">{LIVE.bookYourSpot}</p>
          <Link
            href="/book"
            className={cn(buttonVariants({ size: "lg" }), "mt-6 h-12 rounded-full px-8 uppercase tracking-[0.16em]")}
          >
            {LIVE.bookNow}
          </Link>
        </div>
      </ScenicSection>

      <section className="bg-background py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-4xl sm:text-5xl">Packages</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {packages.map((pkg) => (
            <article key={pkg.slug} className="overflow-hidden border border-border bg-card">
              <div className="relative h-56">
                <Image
                  src={pkg.images[0]}
                  alt={`${pkg.title} at Ayara Kamala — Phuket pole retreat accommodation`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-6">
                <h3 className="text-2xl">{pkg.title}</h3>
                <p className="text-sm leading-relaxed text-[#272727]">{LIVE_PACKAGE_BLURB[pkg.slug]}</p>
                <p className="text-sm font-medium">From {formatEur(pkg.fromCents)} per person</p>
                <Link href={`/book/${pkg.slug}`} className={cn(buttonVariants(), "h-11 rounded-full px-6")}>
                  {LIVE.bookNow}
                </Link>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>

      <ScenicBand src={SCENERY.emeraldWater.src} alt={SCENERY.emeraldWater.alt} />
      <WorkshopTimetable />

      <BoatDay />

      <section className="overflow-hidden bg-aqua py-4 text-primary">
        <div className="marquee text-sm uppercase tracking-[0.28em]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={`${copy}-${index}`} className="mx-6 whitespace-nowrap">
                  {LIVE.whatToExpect}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sky py-24 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative min-h-80 overflow-hidden">
            <Image
              src={VENUE.studio.src}
              alt={VENUE.studio.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            <ExpectBlock title={LIVE.studioTitle} items={LIVE.studio} />
            <ExpectBlock title={LIVE.hotelTitle} items={LIVE.hotel} />
            <ExpectBlock title={LIVE.classesTitle} items={LIVE.classes} />
            <ExpectBlock title={LIVE.activitiesTitle} items={LIVE.activities} />
          </div>
        </div>
      </section>

      <InstagramGallery />

      <ScenicBand src={SCENERY.phuketCoast.src} alt={SCENERY.phuketCoast.alt} />

      <section id="faqs" className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-28">
        <h2 className="text-4xl sm:text-5xl">Frequently asked questions</h2>
        <p className="mt-4 text-base leading-relaxed text-[#272727]">
          Intermediate, advanced and pro polers — rooms, meals, and how to book this pole training
          week.{" "}
          <Link href="/faqs" className="text-primary underline-offset-4 hover:underline">
            Open the full FAQ page
          </Link>
          .
        </p>
        <FaqList faqs={FAQS} />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 text-center sm:px-6">
        <p className="text-base leading-relaxed text-[#272727]">{LIVE.contactLine}</p>
        <Link
          href="/contact"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8 h-12 rounded-full px-8")}
        >
          Contact us
        </Link>
      </section>
    </>
  );
}

function LevelCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border bg-white/90 p-8 text-foreground shadow-sm">
      <h3 className="font-heading text-2xl">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-foreground/80">{body}</p>
    </div>
  );
}

function ExpectBlock({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="text-xl text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
