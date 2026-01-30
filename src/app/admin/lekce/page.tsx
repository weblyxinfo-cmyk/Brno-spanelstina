"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, BookOpen } from "lucide-react";
import {
  getLessonsAdmin,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/app/actions/admin-booking";

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

const categories = [
  { value: "individual", label: "Individuální" },
  { value: "group", label: "Skupinová" },
  { value: "intensive", label: "Intenzivní" },
];

export default function AdminLekcePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durationMinutes: 60,
    priceCzk: 500,
    maxStudents: 1,
    category: "individual",
    active: true,
    sortOrder: 0,
  });

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    const data = await getLessonsAdmin();
    setLessons(data);
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      durationMinutes: 60,
      priceCzk: 500,
      maxStudents: 1,
      category: "individual",
      active: true,
      sortOrder: 0,
    });
    setEditingId(null);
    setIsCreating(false);
  }

  function startEdit(lesson: Lesson) {
    setFormData({
      name: lesson.name,
      description: lesson.description || "",
      durationMinutes: lesson.durationMinutes,
      priceCzk: lesson.priceCzk,
      maxStudents: lesson.maxStudents || 1,
      category: lesson.category,
      active: lesson.active ?? true,
      sortOrder: lesson.sortOrder || 0,
    });
    setEditingId(lesson.id);
    setIsCreating(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      const result = await updateLesson(editingId, formData);
      if (result.success) {
        loadLessons();
        resetForm();
      } else {
        alert(result.error);
      }
    } else {
      const result = await createLesson(formData);
      if (result.success) {
        loadLessons();
        resetForm();
      } else {
        alert(result.error);
      }
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Opravdu chcete smazat tuto lekci?")) {
      const result = await deleteLesson(id);
      if (result.success) {
        loadLessons();
      } else {
        alert(result.error);
      }
    }
  }

  function formatPrice(priceCzk: number): string {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
    }).format(priceCzk);
  }

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
          <h1 className="text-3xl font-bold text-[#1F1A17]">Lekce</h1>
          <p className="text-[#6B5D54]">Správa typů lekcí pro rezervační systém</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Přidat lekci
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F1A17]">
              {editingId ? "Upravit lekci" : "Nová lekce"}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-[#FBF9F6] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6B5D54]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Název lekce *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                  placeholder="např. Individuální lekce"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Kategorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Cena (Kč) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.priceCzk}
                  onChange={(e) =>
                    setFormData({ ...formData, priceCzk: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Délka (minuty) *
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  step="15"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationMinutes: parseInt(e.target.value) || 60,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Max. studentů
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxStudents: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Pořadí řazení
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#EBE6DF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E07B53]"></div>
                </label>
                <span className="text-sm font-semibold text-[#1F1A17]">Aktivní</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                Popis
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors resize-none"
                placeholder="Popis lekce..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
              >
                <Check className="w-5 h-5" />
                {editingId ? "Uložit změny" : "Vytvořit lekci"}
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

      {/* Lessons List */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBF9F6] border-b border-[#EBE6DF]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Lekce
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Kategorie
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Délka
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Cena
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Aktivní
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DF]">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-[#FBF9F6] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#E07B53]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1F1A17]">{lesson.name}</p>
                        {lesson.description && (
                          <p className="text-sm text-[#6B5D54] line-clamp-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-[#FFE5E5] text-[#E07B53] text-xs font-semibold px-3 py-1 rounded-full">
                      {categories.find((c) => c.value === lesson.category)?.label ||
                        lesson.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#6B5D54]">{lesson.durationMinutes} min</td>
                  <td className="px-6 py-4 font-semibold text-[#1F1A17]">
                    {formatPrice(lesson.priceCzk)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {lesson.active ? (
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    ) : (
                      <span className="inline-block w-3 h-3 bg-[#EBE6DF] rounded-full"></span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(lesson)}
                        className="p-2 hover:bg-[#FFE5E5] rounded-lg transition-colors group"
                      >
                        <Pencil className="w-4 h-4 text-[#6B5D54] group-hover:text-[#E07B53]" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-[#6B5D54] group-hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6B5D54]">
                    Zatím žádné lekce. Přidejte první lekci.
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
