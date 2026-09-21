/**
 * Official Pole Art Retreat 2027 workshop timetable.
 * Transcribed from the organiser’s timetable graphic (not the raw image on the page).
 *
 * Cells to double-check if anything looks off vs the original file:
 * - Fri 10:00–11:30 title “Static Rotation” (singular vs “Static Rotations”)
 * - Sun 14:45–16:15 and Sun 18:00–19:30 both read “Static Dynamic” for Karem
 *   (Advanced then Advanced-Pro — same title, two groups)
 * - Mon 10:30–12:00 title “Spin with Grace”
 */

export type WorkshopLevel = "Intermediate" | "Advanced" | "Advanced-Pro";

export type InstructorName =
  | "Karem Gutierrez"
  | "Adam Lin"
  | "Yvonne Smink"
  | "Jenny Liebert";

export type TimetableSlot = {
  start: string;
  end: string;
  level: WorkshopLevel;
  instructor: InstructorName;
  title: string;
};

export type TimetableNote = {
  label: string;
  href?: string;
};

export type TimetableDay = {
  id: string;
  weekday: string;
  dateLabel: string;
  isoDate: string;
  slots: TimetableSlot[];
  note?: TimetableNote;
};

export const TIMETABLE_META = {
  eyebrow: "Pole Art Retreat 2027",
  title: "Workshop Timetable",
  workshopsLine: "Workshops 28 January–1 February 2027",
  accommodationLine: "Accommodation package 27 January–2 February 2027",
  facts: [
    "Three groups",
    "Eight 90-minute workshops per participant",
    "Boat trip 30 January",
    "Arrival 27 January",
    "Workshops 28 Jan–1 Feb",
    "Official checkout 2 February",
  ],
} as const;

export const TIMETABLE_DAYS: TimetableDay[] = [
  {
    id: "thu-28",
    weekday: "Thursday",
    dateLabel: "28 Jan",
    isoDate: "2027-01-28",
    slots: [
      {
        start: "10:00",
        end: "11:30",
        level: "Intermediate",
        instructor: "Karem Gutierrez",
        title: "Pole Handstand",
      },
      {
        start: "11:30",
        end: "13:00",
        level: "Intermediate",
        instructor: "Adam Lin",
        title: "Signature Tricks",
      },
      {
        start: "13:15",
        end: "14:45",
        level: "Advanced",
        instructor: "Adam Lin",
        title: "Princess Dynamic",
      },
      {
        start: "14:45",
        end: "16:15",
        level: "Advanced",
        instructor: "Jenny Liebert",
        title: "Drops & Flips",
      },
      {
        start: "16:30",
        end: "18:00",
        level: "Advanced-Pro",
        instructor: "Jenny Liebert",
        title: "Dynamic Combo Creation",
      },
      {
        start: "18:00",
        end: "19:30",
        level: "Advanced-Pro",
        instructor: "Adam Lin",
        title: "Competition Ready",
      },
    ],
  },
  {
    id: "fri-29",
    weekday: "Friday",
    dateLabel: "29 Jan",
    isoDate: "2027-01-29",
    slots: [
      {
        start: "10:00",
        end: "11:30",
        level: "Advanced",
        instructor: "Karem Gutierrez",
        title: "Static Rotation",
      },
      {
        start: "11:30",
        end: "13:00",
        level: "Advanced",
        instructor: "Adam Lin",
        title: "Signature Tricks",
      },
      {
        start: "13:15",
        end: "14:45",
        level: "Intermediate",
        instructor: "Adam Lin",
        title: "Lyrical Choreo",
      },
      {
        start: "14:45",
        end: "16:15",
        level: "Intermediate",
        instructor: "Yvonne Smink",
        title: "Animal Flow",
      },
      {
        start: "16:30",
        end: "18:00",
        level: "Advanced-Pro",
        instructor: "Yvonne Smink",
        title: "Pole Exploration",
      },
      {
        start: "18:00",
        end: "19:30",
        level: "Advanced-Pro",
        instructor: "Jenny Liebert",
        title: "Choreo Expression Play",
      },
    ],
  },
  {
    id: "sat-30",
    weekday: "Saturday",
    dateLabel: "30 Jan",
    isoDate: "2027-01-30",
    slots: [
      {
        start: "08:00",
        end: "09:30",
        level: "Advanced-Pro",
        instructor: "Yvonne Smink",
        title: "Static Art Combo",
      },
      {
        start: "09:30",
        end: "11:00",
        level: "Advanced",
        instructor: "Yvonne Smink",
        title: "Pole Choreo",
      },
      {
        start: "11:00",
        end: "12:30",
        level: "Intermediate",
        instructor: "Karem Gutierrez",
        title: "Pole Flow",
      },
    ],
    note: {
      label: "Boat trip after the morning workshops",
      href: "#boat-trip",
    },
  },
  {
    id: "sun-31",
    weekday: "Sunday",
    dateLabel: "31 Jan",
    isoDate: "2027-01-31",
    slots: [
      {
        start: "10:00",
        end: "11:30",
        level: "Intermediate",
        instructor: "Jenny Liebert",
        title: "Spinning Choreo",
      },
      {
        start: "11:30",
        end: "13:00",
        level: "Intermediate",
        instructor: "Yvonne Smink",
        title: "Static Art Combo",
      },
      {
        start: "13:15",
        end: "14:45",
        level: "Advanced",
        instructor: "Yvonne Smink",
        title: "Pole Exploration",
      },
      {
        start: "14:45",
        end: "16:15",
        level: "Advanced",
        instructor: "Karem Gutierrez",
        title: "Static Dynamic",
      },
      {
        start: "16:30",
        end: "18:00",
        level: "Advanced-Pro",
        instructor: "Adam Lin",
        title: "Princess Dynamic",
      },
      {
        start: "18:00",
        end: "19:30",
        level: "Advanced-Pro",
        instructor: "Karem Gutierrez",
        title: "Static Dynamic",
      },
    ],
  },
  {
    id: "mon-1",
    weekday: "Monday",
    dateLabel: "1 Feb",
    isoDate: "2027-02-01",
    slots: [
      {
        start: "09:00",
        end: "10:30",
        level: "Advanced-Pro",
        instructor: "Karem Gutierrez",
        title: "Spinning Dynamic",
      },
      {
        start: "10:30",
        end: "12:00",
        level: "Advanced",
        instructor: "Jenny Liebert",
        title: "Spin with Grace",
      },
      {
        start: "12:00",
        end: "13:30",
        level: "Intermediate",
        instructor: "Jenny Liebert",
        title: "Base Tricks",
      },
    ],
    note: { label: "Optional Onsen / Spa Day or early checkout" },
  },
  {
    id: "tue-2",
    weekday: "Tuesday",
    dateLabel: "2 Feb",
    isoDate: "2027-02-02",
    slots: [],
    note: { label: "Official checkout" },
  },
];
