"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
  availableDates: string[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

const dayNames = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
const monthNames = [
  "Leden",
  "Únor",
  "Březen",
  "Duben",
  "Květen",
  "Červen",
  "Červenec",
  "Srpen",
  "Září",
  "Říjen",
  "Listopad",
  "Prosinec",
];

export default function CalendarView({
  availableDates,
  selectedDate,
  onSelect,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Start with the month of the first available date, or current month
    if (availableDates.length > 0) {
      return new Date(availableDates[0]);
    }
    return new Date();
  });

  const availableDatesSet = useMemo(
    () => new Set(availableDates),
    [availableDates]
  );

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of week for the first day (0 = Sunday, adjust for Monday start)
    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const isAvailable = (date: Date): boolean => {
    const key = formatDateKey(date);
    return availableDatesSet.has(key);
  };

  const isPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (availableDates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B5D54]">
          Pro tuto lekci nejsou momentálně dostupné žádné termíny.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-6 max-w-md mx-auto"
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-[#FBF9F6] rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#6B5D54]" />
        </button>

        <h3 className="text-lg font-bold text-[#1F1A17]">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-[#FBF9F6] rounded-xl transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-[#6B5D54]" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-[#6B5D54] py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateKey = formatDateKey(date);
          const available = isAvailable(date);
          const past = isPast(date);
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              onClick={() => available && !past && onSelect(dateKey)}
              disabled={!available || past}
              className={`
                aspect-square rounded-xl flex items-center justify-center text-sm font-medium
                transition-all duration-200
                ${
                  isSelected
                    ? "bg-[#E07B53] text-white shadow-md"
                    : available && !past
                    ? "bg-[#FFE5E5] text-[#E07B53] hover:bg-[#E07B53] hover:text-white cursor-pointer"
                    : past
                    ? "text-[#EBE6DF] cursor-not-allowed"
                    : "text-[#1F1A17] cursor-not-allowed"
                }
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[#EBE6DF]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#FFE5E5]" />
          <span className="text-xs text-[#6B5D54]">Volné</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#E07B53]" />
          <span className="text-xs text-[#6B5D54]">Vybráno</span>
        </div>
      </div>
    </motion.div>
  );
}
