"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Check, Calendar, Clock } from "lucide-react";
import {
  getLessonsAdmin,
  getAllTimeSlots,
  createTimeSlot,
  createMultipleTimeSlots,
  deleteTimeSlot,
  updateTimeSlot,
} from "@/app/actions/admin-booking";

interface Lesson {
  id: number;
  name: string;
  durationMinutes: number;
  category: string;
}

interface TimeSlot {
  id: number;
  lessonId: number | null;
  startTime: string;
  endTime: string;
  available: boolean | null;
}

export default function AdminTerminyPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isBulkCreating, setIsBulkCreating] = useState(false);
  const [selectedLessonFilter, setSelectedLessonFilter] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    lessonId: 0,
    date: "",
    startTime: "09:00",
    endTime: "10:00",
  });

  const [bulkFormData, setBulkFormData] = useState({
    lessonId: 0,
    startDate: "",
    endDate: "",
    startTime: "09:00",
    days: [1, 2, 3, 4, 5], // Mon-Fri by default
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [lessonsData, slotsData] = await Promise.all([
      getLessonsAdmin(),
      getAllTimeSlots(),
    ]);
    setLessons(lessonsData);
    setTimeSlots(slotsData);
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      lessonId: lessons[0]?.id || 0,
      date: "",
      startTime: "09:00",
      endTime: "10:00",
    });
    setIsCreating(false);
    setIsBulkCreating(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const lesson = lessons.find((l) => l.id === formData.lessonId);
    if (!lesson) return;

    const startDateTime = `${formData.date}T${formData.startTime}:00`;
    const endDateTime = `${formData.date}T${formData.endTime}:00`;

    const result = await createTimeSlot({
      lessonId: formData.lessonId,
      startTime: startDateTime,
      endTime: endDateTime,
    });

    if (result.success) {
      loadData();
      resetForm();
    } else {
      alert(result.error);
    }
  }

  async function handleBulkSubmit(e: React.FormEvent) {
    e.preventDefault();

    const lesson = lessons.find((l) => l.id === bulkFormData.lessonId);
    if (!lesson) return;

    const slots: Array<{
      lessonId: number;
      startTime: string;
      endTime: string;
    }> = [];

    const start = new Date(bulkFormData.startDate);
    const end = new Date(bulkFormData.endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      // Convert Sunday=0 to Monday=1 format
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;

      if (bulkFormData.days.includes(adjustedDay)) {
        const dateStr = date.toISOString().split("T")[0];
        const [hours, minutes] = bulkFormData.startTime.split(":").map(Number);
        const endDate = new Date(date);
        endDate.setHours(hours, minutes + lesson.durationMinutes);

        slots.push({
          lessonId: bulkFormData.lessonId,
          startTime: `${dateStr}T${bulkFormData.startTime}:00`,
          endTime: `${dateStr}T${endDate.getHours().toString().padStart(2, "0")}:${endDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}:00`,
        });
      }
    }

    if (slots.length === 0) {
      alert("Žádné termíny k vytvoření pro vybraná kritéria.");
      return;
    }

    const result = await createMultipleTimeSlots(slots);

    if (result.success) {
      alert(`Vytvořeno ${result.count} termínů.`);
      loadData();
      resetForm();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Opravdu chcete smazat tento termín?")) {
      const result = await deleteTimeSlot(id);
      if (result.success) {
        loadData();
      } else {
        alert(result.error);
      }
    }
  }

  async function toggleAvailability(slot: TimeSlot) {
    const result = await updateTimeSlot(slot.id, { available: !slot.available });
    if (result.success) {
      loadData();
    } else {
      alert(result.error);
    }
  }

  function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString("cs-CZ", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getLessonName(lessonId: number | null): string {
    if (!lessonId) return "-";
    return lessons.find((l) => l.id === lessonId)?.name || "-";
  }

  const filteredSlots = selectedLessonFilter
    ? timeSlots.filter((s) => s.lessonId === selectedLessonFilter)
    : timeSlots;

  const dayLabels = [
    { value: 1, label: "Po" },
    { value: 2, label: "Út" },
    { value: 3, label: "St" },
    { value: 4, label: "Čt" },
    { value: 5, label: "Pá" },
    { value: 6, label: "So" },
    { value: 7, label: "Ne" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E07B53]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1F1A17]">Termíny</h1>
          <p className="text-[#6B5D54]">Správa dostupných termínů pro rezervace</p>
        </div>
        {!isCreating && !isBulkCreating && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setFormData({ ...formData, lessonId: lessons[0]?.id || 0 });
                setIsCreating(true);
              }}
              className="inline-flex items-center gap-2 bg-white text-[#E07B53] border-2 border-[#E07B53] px-6 py-3 rounded-xl font-semibold hover:bg-[#FFE5E5] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Jeden termín
            </button>
            <button
              onClick={() => {
                setBulkFormData({ ...bulkFormData, lessonId: lessons[0]?.id || 0 });
                setIsBulkCreating(true);
              }}
              className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Hromadně
            </button>
          </div>
        )}
      </div>

      {/* Single Slot Form */}
      {isCreating && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F1A17]">Nový termín</h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-[#FBF9F6] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6B5D54]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Lekce *
                </label>
                <select
                  value={formData.lessonId}
                  onChange={(e) =>
                    setFormData({ ...formData, lessonId: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                >
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Datum *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Začátek *
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Konec *
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
              >
                <Check className="w-5 h-5" />
                Vytvořit termín
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl font-semibold text-[#6B5D54] hover:bg-[#FBF9F6] transition-colors"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Creation Form */}
      {isBulkCreating && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F1A17]">Hromadné vytvoření termínů</h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-[#FBF9F6] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6B5D54]" />
            </button>
          </div>

          <form onSubmit={handleBulkSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Lekce *
                </label>
                <select
                  value={bulkFormData.lessonId}
                  onChange={(e) =>
                    setBulkFormData({ ...bulkFormData, lessonId: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                >
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.name} ({lesson.durationMinutes} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Od data *
                </label>
                <input
                  type="date"
                  required
                  value={bulkFormData.startDate}
                  onChange={(e) =>
                    setBulkFormData({ ...bulkFormData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Do data *
                </label>
                <input
                  type="date"
                  required
                  value={bulkFormData.endDate}
                  onChange={(e) =>
                    setBulkFormData({ ...bulkFormData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Čas začátku *
                </label>
                <input
                  type="time"
                  required
                  value={bulkFormData.startTime}
                  onChange={(e) =>
                    setBulkFormData({ ...bulkFormData, startTime: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-3">
                Dny v týdnu *
              </label>
              <div className="flex flex-wrap gap-2">
                {dayLabels.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => {
                      const isSelected = bulkFormData.days.includes(day.value);
                      setBulkFormData({
                        ...bulkFormData,
                        days: isSelected
                          ? bulkFormData.days.filter((d) => d !== day.value)
                          : [...bulkFormData.days, day.value],
                      });
                    }}
                    className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                      bulkFormData.days.includes(day.value)
                        ? "bg-[#E07B53] text-white"
                        : "bg-[#FBF9F6] text-[#6B5D54] hover:bg-[#FFE5E5]"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
              >
                <Check className="w-5 h-5" />
                Vytvořit termíny
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl font-semibold text-[#6B5D54] hover:bg-[#FBF9F6] transition-colors"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <select
          value={selectedLessonFilter || ""}
          onChange={(e) =>
            setSelectedLessonFilter(e.target.value ? parseInt(e.target.value) : null)
          }
          className="px-4 py-2 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
        >
          <option value="">Všechny lekce</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </select>
      </div>

      {/* Time Slots List */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBF9F6] border-b border-[#EBE6DF]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Lekce
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Datum a čas
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Stav
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DF]">
              {filteredSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-[#FBF9F6] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#E07B53]" />
                      </div>
                      <span className="font-semibold text-[#1F1A17]">
                        {getLessonName(slot.lessonId)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#6B5D54]" />
                      <span className="text-[#1F1A17]">
                        {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime).split(" ").pop()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleAvailability(slot)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        slot.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {slot.available ? "Volný" : "Obsazený"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-[#6B5D54] group-hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSlots.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#6B5D54]">
                    Zatím žádné termíny.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
