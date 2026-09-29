import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScenicBand } from "@/components/scenic";
import { WorkshopDescriptions } from "@/components/workshop-descriptions";
import { WorkshopTimetable } from "@/components/workshop-timetable";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pole Camp Timetable, Phuket 2027",
  description:
    "Workshop timetable for the pole camp in Phuket — intermediate, advanced and pro classes, 28 January–1 February 2027 at the Ayara Kamala pole retreat.",
  path: "/timetable",
});

export default function TimetablePage() {
  return (
    <>
      <ScenicBand
        src="/images/phuket/timetable-longtails.jpg"
        alt="Two wooden longtail boats on turquoise water beside limestone karsts"
      />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Timetable", path: "/timetable" },
          ]}
        />
      </div>
      <WorkshopTimetable heading="h1" below={<WorkshopDescriptions />} />
    </>
  );
}
