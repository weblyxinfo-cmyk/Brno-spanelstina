"use client";

import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";

export interface ScheduleCourse {
  uroven: string;
  den: string;
  cas: string;
  popis: string;
  lekci: number;
  cena: string;
  isHighlighted?: boolean;
  badge?: string;
}

interface CourseTableProps {
  title: string;
  icon: string;
  courses: ScheduleCourse[];
  onReserveCourse?: (course: ScheduleCourse) => void;
}

export default function CourseTable({ title, icon, courses, onReserveCourse }: CourseTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Sub-heading */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl sm:text-2xl font-bold text-[#1F1A17]">
          {title}
        </h3>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-[32px] overflow-hidden border border-[#EBE6DF]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBF9F6] border-b border-[#EBE6DF]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Úroveň
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Den
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Čas
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Popis
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Lekcí
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Cena
                </th>
                {onReserveCourse && (
                  <th className="text-center px-6 py-4 text-sm font-semibold text-[#6B5D54]">

                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DF]">
              {courses.map((course, index) => (
                <tr
                  key={index}
                  className={`transition-colors ${
                    course.isHighlighted
                      ? "bg-[#FFF0E5]"
                      : "hover:bg-[#FBF9F6]"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-[#1F1A17] capitalize">
                    {course.uroven}
                  </td>
                  <td className="px-6 py-4 text-[#6B5D54]">
                    {course.den}
                    {course.badge && (
                      <span className="ml-2 inline-block bg-[#E07B53] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {course.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#1F1A17] font-medium tabular-nums whitespace-nowrap">
                    {course.cas}
                  </td>
                  <td className="px-6 py-4 text-[#6B5D54] text-sm">
                    {course.popis}
                  </td>
                  <td className="px-6 py-4 text-center text-[#1F1A17] font-semibold">
                    {course.lekci}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#1F1A17] whitespace-nowrap">
                    {course.cena}
                  </td>
                  {onReserveCourse && (
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onReserveCourse(course)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E07B53] text-white text-sm font-semibold rounded-full hover:bg-[#C4613D] transition-all duration-200 hover:scale-105 shadow-sm"
                      >
                        <CalendarPlus className="w-4 h-4" />
                        <span className="hidden lg:inline">Rezervovat</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card stack */}
      <div className="md:hidden space-y-4">
        {courses.map((course, index) => (
          <div
            key={index}
            className={`rounded-2xl p-5 border border-[#EBE6DF] ${
              course.isHighlighted ? "bg-[#FFF0E5]" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-[#1F1A17] capitalize">
                {course.uroven}
              </span>
              {course.badge && (
                <span className="bg-[#E07B53] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {course.badge}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-[#6B5D54]">Den: </span>
                <span className="text-[#1F1A17] font-medium">{course.den}</span>
              </div>
              <div>
                <span className="text-[#6B5D54]">Čas: </span>
                <span className="text-[#1F1A17] font-medium">{course.cas}</span>
              </div>
              <div>
                <span className="text-[#6B5D54]">Lekcí: </span>
                <span className="text-[#1F1A17] font-medium">{course.lekci}</span>
              </div>
              <div>
                <span className="text-[#6B5D54]">Cena: </span>
                <span className="text-[#1F1A17] font-bold">{course.cena}</span>
              </div>
            </div>
            <p className="text-xs text-[#6B5D54] mt-2">{course.popis}</p>
            {onReserveCourse && (
              <button
                onClick={() => onReserveCourse(course)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#E07B53] text-white text-sm font-semibold rounded-xl hover:bg-[#C4613D] transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
                Mám zájem o kurz
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
