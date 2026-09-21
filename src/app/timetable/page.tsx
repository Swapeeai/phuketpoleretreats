import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScenicBand } from "@/components/scenic";
import { WorkshopTimetable } from "@/components/workshop-timetable";
import { SCENERY } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Workshop timetable for the Phuket pole camp",
  description:
    "Official colourful workshop timetable for the Phuket Pole Art Retreat — 12 hours of pole with Karem Gutierrez, Adam Lin, Yvonne Smink and Jenny Liebert, 28 January to 1 February 2027 at Ayara Kamala.",
  path: "/timetable",
});

export default function TimetablePage() {
  return (
    <>
      <ScenicBand src={SCENERY.emeraldWater.src} alt={SCENERY.emeraldWater.alt} />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Timetable", path: "/timetable" },
          ]}
        />
      </div>
      <WorkshopTimetable heading="h1" />
    </>
  );
}
