"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Clock,
  Users,
} from "lucide-react";

export interface CalendarCourse {
  id: number;
  level: string;
  dayOfWeek: string;
  timeStart: string;
  timeEnd: string;
  description: string | null;
  lessonsCount: number;
  priceCzk: number;
  maxStudents: number;
  currentStudents: number;
  availableSpots: number;
  type: "morning" | "afternoon";
  isHighlighted: boolean;
  badge: string | null;
  isFull: boolean;
  almostFull: boolean;
  semesterStart: string;
  semesterEnd: string;
}

interface MonthlyCalendarProps {
  courses: CalendarCourse[];
  onSelectCourse: (course: CalendarCourse, date: Date) => void;
  selectedCourseId?: number | null;
}

const DAYS_CS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
const MONTHS_CS = [
  "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
  "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
];

const DAY_MAP: Record<string, number> = {
  "pondělí": 0,
  "úterý": 1,
  "středa": 2,
  "čtvrtek": 3,
  "pátek": 4,
  "sobota": 5,
  "neděle": 6,
};

function getDayIndex(dayOfWeek: string): number[] {
  const lower = dayOfWeek.toLowerCase();
  const indices: number[] = [];

  for (const [day, index] of Object.entries(DAY_MAP)) {
    if (lower.includes(day)) {
      indices.push(index);
    }
  }

  // Handle "dle domluvy" - show on multiple days
  if (lower.includes("domluvy")) {
    return [0, 1, 2, 3, 4]; // Mon-Fri
  }

  return indices.length > 0 ? indices : [0];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ").format(price) + " Kč";
}

function getStatusColor(course: CalendarCourse) {
  if (course.isFull) {
    return {
      bg: "bg-red-100",
      border: "border-red-300",
      text: "text-red-700",
      dot: "bg-red-500",
    };
  }
  if (course.almostFull) {
    return {
      bg: "bg-amber-100",
      border: "border-amber-300",
      text: "text-amber-700",
      dot: "bg-amber-500",
    };
  }
  return {
    bg: "bg-emerald-100",
    border: "border-emerald-300",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  };
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
}

export default function MonthlyCalendar({
  courses,
  onSelectCourse,
}: MonthlyCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayCourses, setSelectedDayCourses] = useState<CalendarCourse[]>([]);

  // Calculate calendar days for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const days: (Date | null)[] = [];

    // Add empty cells for days before month start
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(currentYear, currentMonth, d));
    }

    return days;
  }, [currentMonth, currentYear]);

  // Get courses for a specific date
  const getCoursesForDate = (date: Date): CalendarCourse[] => {
    const dayOfWeek = (date.getDay() + 6) % 7; // Convert to Monday = 0

    return courses.filter(course => {
      // Check if date is within semester
      const semStart = new Date(course.semesterStart);
      const semEnd = new Date(course.semesterEnd);

      if (date < semStart || date > semEnd) return false;

      // Check if course runs on this day of week
      const courseDays = getDayIndex(course.dayOfWeek);
      return courseDays.includes(dayOfWeek);
    });
  };

  // Check if a date has any courses
  const getDateStatus = (date: Date): { hasCourses: boolean; hasAvailable: boolean; allFull: boolean } => {
    const dateCourses = getCoursesForDate(date);

    if (dateCourses.length === 0) {
      return { hasCourses: false, hasAvailable: false, allFull: false };
    }

    const availableCourses = dateCourses.filter(c => !c.isFull);

    return {
      hasCourses: true,
      hasAvailable: availableCourses.length > 0,
      allFull: availableCourses.length === 0,
    };
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (date: Date) => {
    const dateCourses = getCoursesForDate(date);
    if (dateCourses.length > 0) {
      setSelectedDate(date);
      setSelectedDayCourses(dateCourses);
    }
  };

  const handleSelectCourse = (course: CalendarCourse) => {
    if (selectedDate && !course.isFull) {
      onSelectCourse(course, selectedDate);
    }
  };

  // Determine if we can go back (not before current month)
  const canGoPrev = currentYear > today.getFullYear() ||
                    (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  // Can go forward at least 3 months
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 6, 1);
  const canGoNext = new Date(currentYear, currentMonth, 1) < maxDate;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Legend - compact on mobile */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />
          <span className="text-[#6B5D54]">Volná</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500" />
          <span className="text-[#6B5D54]">Poslední</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
          <span className="text-[#6B5D54]">Plno</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-300" />
          <span className="text-[#6B5D54]">Bez kurzu</span>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          className={`p-2 sm:p-3 rounded-full transition-colors ${
            canGoPrev
              ? "hover:bg-[#FBF9F6] active:bg-[#EBE6DF] text-[#1F1A17]"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h3 className="text-base sm:text-xl font-bold text-[#1F1A17]">
          {MONTHS_CS[currentMonth]} {currentYear}
        </h3>

        <button
          onClick={handleNextMonth}
          disabled={!canGoNext}
          className={`p-2 sm:p-3 rounded-full transition-colors ${
            canGoNext
              ? "hover:bg-[#FBF9F6] active:bg-[#EBE6DF] text-[#1F1A17]"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EBE6DF] overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-[#1F1A17]">
          {DAYS_CS.map((day) => (
            <div
              key={day}
              className="py-2 sm:py-3 text-center text-xs sm:text-sm font-bold text-white"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-square border-b border-r border-[#EBE6DF] bg-gray-50"
                />
              );
            }

            const status = getDateStatus(date);
            const isToday = isSameDay(date, today);
            const isPast = date < today && !isToday;
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const courseCount = getCoursesForDate(date).length;

            return (
              <motion.button
                key={date.toISOString()}
                whileHover={status.hasCourses && !isPast ? { scale: 1.02 } : {}}
                whileTap={status.hasCourses && !isPast ? { scale: 0.98 } : {}}
                onClick={() => !isPast && status.hasCourses && handleDateClick(date)}
                disabled={isPast || !status.hasCourses}
                className={`
                  aspect-square border-b border-r border-[#EBE6DF] p-0.5 sm:p-2 flex flex-col items-center justify-center relative transition-all
                  ${isPast ? "bg-gray-100 text-gray-400" : ""}
                  ${isToday ? "ring-2 ring-[#E07B53] ring-inset" : ""}
                  ${isSelected ? "bg-[#E07B53] text-white" : ""}
                  ${status.hasCourses && !isPast && !isSelected ? "cursor-pointer hover:bg-[#FBF9F6] active:bg-[#EBE6DF]" : ""}
                  ${!status.hasCourses && !isPast ? "bg-white" : ""}
                `}
              >
                <span className={`text-xs sm:text-base font-semibold ${isSelected ? "text-white" : ""}`}>
                  {date.getDate()}
                </span>

                {/* Course indicators */}
                {status.hasCourses && !isPast && (
                  <div className="flex gap-0.5 mt-0.5 sm:mt-1">
                    {status.allFull ? (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" />
                    ) : status.hasAvailable ? (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                    ) : null}
                  </div>
                )}

                {/* Course count badge - hidden on very small screens, shown on sm+ */}
                {status.hasCourses && !isPast && (
                  <span className={`hidden sm:block text-[10px] ${isSelected ? "text-white/80" : "text-[#6B5D54]"}`}>
                    {courseCount} kurz{courseCount > 1 ? "y" : ""}
                  </span>
                )}

                {/* Mobile: show count as small number */}
                {status.hasCourses && !isPast && courseCount > 1 && (
                  <span className={`sm:hidden text-[8px] ${isSelected ? "text-white/80" : "text-[#6B5D54]"}`}>
                    {courseCount}×
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Courses */}
      <AnimatePresence>
        {selectedDate && selectedDayCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-xl sm:rounded-2xl border-2 border-[#E07B53] p-3 sm:p-6"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-[#6B5D54]">Kurzy na den:</p>
                <h4 className="text-sm sm:text-lg font-bold text-[#1F1A17] truncate">
                  {selectedDate.toLocaleDateString("cs-CZ", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                  <span className="hidden sm:inline">
                    {" "}{selectedDate.getFullYear()}
                  </span>
                </h4>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1.5 sm:p-2 hover:bg-[#FBF9F6] active:bg-[#EBE6DF] rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B5D54]" />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {selectedDayCourses.map((course) => {
                const colors = getStatusColor(course);

                return (
                  <motion.button
                    key={course.id}
                    whileHover={!course.isFull ? { scale: 1.01 } : {}}
                    onClick={() => handleSelectCourse(course)}
                    disabled={course.isFull}
                    className={`
                      w-full text-left rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 transition-all
                      ${colors.bg} ${colors.border}
                      ${course.isFull ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-md active:shadow-sm"}
                    `}
                  >
                    {/* Mobile: stacked layout, Desktop: side by side */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full text-white ${colors.dot}`}>
                          {course.isFull
                            ? "Obsazeno"
                            : course.almostFull
                            ? "Poslední!"
                            : `${course.availableSpots} volná`}
                        </span>
                        {course.badge && (
                          <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#E07B53] text-white uppercase">
                            {course.badge}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-sm sm:text-base text-[#1F1A17]">
                        {formatPrice(course.priceCzk)}
                      </span>
                    </div>

                    <h5 className={`font-bold ${colors.text} capitalize text-base sm:text-lg mb-1.5 sm:mb-2`}>
                      {course.level}
                    </h5>

                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-[#6B5D54]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {course.timeStart}–{course.timeEnd}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {course.currentStudents}/{course.maxStudents}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {course.lessonsCount} lekcí
                      </span>
                    </div>

                    {/* Availability bar */}
                    <div className="mt-2 sm:mt-3 flex gap-0.5 sm:gap-1">
                      {Array.from({ length: course.maxStudents }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 sm:h-2 flex-1 rounded-full ${
                            i < course.currentStudents
                              ? "bg-[#E07B53]"
                              : "bg-emerald-300"
                          }`}
                        />
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick navigation */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => {
            setCurrentMonth(today.getMonth());
            setCurrentYear(today.getFullYear());
          }}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-[#EBE6DF] hover:border-[#E07B53] hover:text-[#E07B53] active:bg-[#FBF9F6] transition-colors"
        >
          Dnes
        </button>
        <button
          onClick={() => {
            const next = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            setCurrentMonth(next.getMonth());
            setCurrentYear(next.getFullYear());
          }}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-[#EBE6DF] hover:border-[#E07B53] hover:text-[#E07B53] active:bg-[#FBF9F6] transition-colors"
        >
          Příští měsíc
        </button>
      </div>
    </div>
  );
}
