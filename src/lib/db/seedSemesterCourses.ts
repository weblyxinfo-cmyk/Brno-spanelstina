import { db } from "./index";
import { semesterCourses } from "./schema";

const springSemester2026 = {
  semester: "jaro-2026",
  semesterName: "Jarní semestr 2026",
  semesterStart: "2026-02-16",
  semesterEnd: "2026-06-26",
  isHighlighted: false as boolean,
  badge: null as string | null,
};

const coursesData = [
  // DOPOLEDNÍ KURZY
  {
    ...springSemester2026,
    level: "začátečníci A1",
    dayOfWeek: "dle domluvy",
    timeStart: "09:00",
    timeEnd: "10:30",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 2,
    type: "morning",
  },
  {
    ...springSemester2026,
    level: "začátečníci A2",
    dayOfWeek: "dle domluvy",
    timeStart: "08:00",
    timeEnd: "13:00",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 1,
    type: "morning",
  },
  {
    ...springSemester2026,
    level: "mírně pokročilí B1",
    dayOfWeek: "čtvrtek",
    timeStart: "09:00",
    timeEnd: "10:30",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 3,
    type: "morning",
  },
  {
    ...springSemester2026,
    level: "mírně pokročilí B1 plus",
    dayOfWeek: "pátek",
    timeStart: "08:30",
    timeEnd: "10:00",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 2,
    type: "morning",
  },
  {
    ...springSemester2026,
    level: "začátečníci A1",
    dayOfWeek: "sobota",
    timeStart: "09:00",
    timeEnd: "10:30",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 7600,
    maxStudents: 4,
    currentStudents: 0,
    type: "morning",
    isHighlighted: true,
    badge: "novinka",
  },
  // ODPOLEDNÍ KURZY
  {
    ...springSemester2026,
    level: "začátečníci A1",
    dayOfWeek: "čtvrtek / dle domluvy",
    timeStart: "14:30",
    timeEnd: "20:15",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 4, // FULL
    type: "afternoon",
  },
  {
    ...springSemester2026,
    level: "začátečnický A1+",
    dayOfWeek: "úterý",
    timeStart: "13:00",
    timeEnd: "14:30",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 1,
    type: "afternoon",
  },
  {
    ...springSemester2026,
    level: "začátečníci A2",
    dayOfWeek: "čtvrtek",
    timeStart: "14:00",
    timeEnd: "15:30",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 2,
    type: "afternoon",
  },
  {
    ...springSemester2026,
    level: "mírně pokročilí B1",
    dayOfWeek: "středa",
    timeStart: "17:00",
    timeEnd: "18:30",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 3, // Almost full
    type: "afternoon",
  },
  {
    ...springSemester2026,
    level: "pokročilí B2",
    dayOfWeek: "pondělí",
    timeStart: "18:45",
    timeEnd: "20:15",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 2,
    type: "afternoon",
  },
  {
    ...springSemester2026,
    level: "pokročilí B2",
    dayOfWeek: "čtvrtek",
    timeStart: "17:00",
    timeEnd: "18:30",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 0,
    type: "afternoon",
  },
  {
    ...springSemester2026,
    level: "pokročilí B2+",
    dayOfWeek: "pondělí",
    timeStart: "18:45",
    timeEnd: "20:15",
    description: "1x90min, max 4 studenti",
    lessonsCount: 19,
    priceCzk: 6175,
    maxStudents: 4,
    currentStudents: 1,
    type: "afternoon",
  },
];

export async function seedSemesterCourses() {
  if (!db) {
    console.log("Database not configured, skipping seed");
    return;
  }

  console.log("Seeding semester courses...");

  for (const course of coursesData) {
    await db.insert(semesterCourses).values(course);
  }

  console.log(`Seeded ${coursesData.length} semester courses`);
}

// Export courses data for use without database
export const staticSemesterCourses = coursesData.map((course, index) => ({
  id: index + 1,
  semester: course.semester,
  semesterName: course.semesterName,
  semesterStart: course.semesterStart,
  semesterEnd: course.semesterEnd,
  level: course.level,
  dayOfWeek: course.dayOfWeek,
  timeStart: course.timeStart,
  timeEnd: course.timeEnd,
  description: course.description,
  lessonsCount: course.lessonsCount,
  priceCzk: course.priceCzk,
  maxStudents: course.maxStudents,
  currentStudents: course.currentStudents,
  type: course.type as "morning" | "afternoon",
  isHighlighted: course.isHighlighted || false,
  badge: course.badge || null,
  availableSpots: course.maxStudents - course.currentStudents,
  isFull: course.maxStudents - course.currentStudents <= 0,
  almostFull: course.maxStudents - course.currentStudents === 1,
}));
