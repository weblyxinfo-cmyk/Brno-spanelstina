"use client";

import { motion } from "framer-motion";
import { Clock, Check } from "lucide-react";

interface TimeSlot {
  id: number;
  lessonId: number | null;
  startTime: string;
  endTime: string;
  available: boolean | null;
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedId: number | null;
  onSelect: (slot: TimeSlot) => void;
  selectedDate: string;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function TimeSlotPicker({
  timeSlots,
  selectedId,
  onSelect,
  selectedDate,
}: TimeSlotPickerProps) {
  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B5D54]">Pro vybraný den nejsou dostupné žádné časy.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto"
    >
      <h3 className="text-lg font-bold text-[#1F1A17] text-center mb-6 capitalize">
        {formatDateHeader(selectedDate)}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {timeSlots.map((slot, index) => {
          const isSelected = selectedId === slot.id;

          return (
            <motion.button
              key={slot.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelect(slot)}
              className={`
                relative p-4 rounded-xl text-center transition-all duration-200
                ${
                  isSelected
                    ? "bg-[#E07B53] text-white shadow-lg shadow-[#E07B53]/30"
                    : "bg-white hover:bg-[#FFE5E5] border-2 border-transparent hover:border-[#E07B53]"
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#E07B53]" />
                </div>
              )}

              <Clock
                className={`w-5 h-5 mx-auto mb-2 ${
                  isSelected ? "text-white" : "text-[#E07B53]"
                }`}
              />

              <div
                className={`text-lg font-bold ${
                  isSelected ? "text-white" : "text-[#1F1A17]"
                }`}
              >
                {formatTime(slot.startTime)}
              </div>

              <div
                className={`text-xs mt-1 ${
                  isSelected ? "text-white/80" : "text-[#6B5D54]"
                }`}
              >
                - {formatTime(slot.endTime)}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
