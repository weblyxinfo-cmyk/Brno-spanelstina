"use client";

import { motion } from "framer-motion";
import { Clock, Users, Check } from "lucide-react";

interface Lesson {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCzk: number;
  maxStudents: number | null;
  category: string;
  active: boolean | null;
  sortOrder: number | null;
}

interface LessonSelectorProps {
  lessons: Lesson[];
  selectedId: number | null;
  onSelect: (lesson: Lesson) => void;
}

const categoryLabels: Record<string, string> = {
  individual: "Individuální",
  group: "Skupinová",
  intensive: "Intenzivní",
};

const categoryIcons: Record<string, string> = {
  individual: "👤",
  group: "👥",
  intensive: "🚀",
};

function formatPrice(priceCzk: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
  }).format(priceCzk);
}

export default function LessonSelector({
  lessons,
  selectedId,
  onSelect,
}: LessonSelectorProps) {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B5D54]">Momentálně nejsou k dispozici žádné lekce.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson, index) => {
        const isSelected = selectedId === lesson.id;

        return (
          <motion.button
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => onSelect(lesson)}
            className={`relative p-6 rounded-2xl text-left transition-all duration-300 ${
              isSelected
                ? "bg-[#E07B53] text-white shadow-lg shadow-[#E07B53]/30 scale-[1.02]"
                : "bg-white hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-[#E07B53]"
            }`}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-[#E07B53]" />
              </div>
            )}

            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                  isSelected ? "bg-white/20" : "bg-[#FFE5E5]"
                }`}
              >
                {categoryIcons[lesson.category] || "📚"}
              </div>

              <div className="flex-1">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isSelected ? "text-white/80" : "text-[#E07B53]"
                  }`}
                >
                  {categoryLabels[lesson.category] || lesson.category}
                </span>

                <h3
                  className={`text-lg font-bold mt-1 ${
                    isSelected ? "text-white" : "text-[#1F1A17]"
                  }`}
                >
                  {lesson.name}
                </h3>
              </div>
            </div>

            {lesson.description && (
              <p
                className={`mt-4 text-sm leading-relaxed ${
                  isSelected ? "text-white/80" : "text-[#6B5D54]"
                }`}
              >
                {lesson.description}
              </p>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-1.5 text-sm ${
                    isSelected ? "text-white/80" : "text-[#6B5D54]"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {lesson.durationMinutes} min
                </div>

                {lesson.maxStudents && lesson.maxStudents > 1 && (
                  <div
                    className={`flex items-center gap-1.5 text-sm ${
                      isSelected ? "text-white/80" : "text-[#6B5D54]"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    max {lesson.maxStudents}
                  </div>
                )}
              </div>

              <div
                className={`text-xl font-bold ${
                  isSelected ? "text-white" : "text-[#E07B53]"
                }`}
              >
                {formatPrice(lesson.priceCzk)}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
