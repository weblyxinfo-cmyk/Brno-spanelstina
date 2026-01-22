"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, BookOpen } from "lucide-react";
import { getCourses, createCourse, updateCourse, deleteCourse } from "@/app/actions/admin";

interface Course {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  badge: string | null;
  category: string;
  featured: boolean | null;
}

const categories = [
  "skupinove",
  "individualni",
  "intenzivni",
  "online",
  "firemni",
  "priprava",
];

const categoryLabels: Record<string, string> = {
  skupinove: "Skupinové kurzy",
  individualni: "Individuální výuka",
  intenzivni: "Intenzivní kurzy",
  online: "Online kurzy",
  firemni: "Firemní kurzy",
  priprava: "Příprava na zkoušky",
};

export default function AdminKurzyPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon: "",
    badge: "",
    category: "skupinove",
    featured: false,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const data = await getCourses();
    setCourses(data);
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      icon: "",
      badge: "",
      category: "skupinove",
      featured: false,
    });
    setEditingId(null);
    setIsCreating(false);
  }

  function startEdit(course: Course) {
    setFormData({
      title: course.title,
      subtitle: course.subtitle || "",
      description: course.description || "",
      icon: course.icon || "",
      badge: course.badge || "",
      category: course.category,
      featured: course.featured || false,
    });
    setEditingId(course.id);
    setIsCreating(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      const result = await updateCourse(editingId, formData);
      if (result.success) {
        loadCourses();
        resetForm();
      } else {
        alert(result.error);
      }
    } else {
      const result = await createCourse(formData);
      if (result.success) {
        loadCourses();
        resetForm();
      } else {
        alert(result.error);
      }
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Opravdu chcete smazat tento kurz?")) {
      const result = await deleteCourse(id);
      if (result.success) {
        loadCourses();
      } else {
        alert(result.error);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C41E3A]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1F1A17]">Kurzy</h1>
          <p className="text-[#6B5D54]">Správa kurzů španělštiny</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9E1830] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Přidat kurz
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F1A17]">
              {editingId ? "Upravit kurz" : "Nový kurz"}
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
                  Název kurzu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. Skupinové kurzy"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Kategorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Podtitulek
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. 2-6 studentů ve skupině"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Ikona (emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. 👥"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Badge
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. Nejoblíbenější"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#EBE6DF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C41E3A]"></div>
                </label>
                <span className="text-sm font-semibold text-[#1F1A17]">
                  Zobrazit na homepage
                </span>
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
                className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors resize-none"
                placeholder="Popis kurzu..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9E1830] transition-colors"
              >
                <Check className="w-5 h-5" />
                {editingId ? "Uložit změny" : "Vytvořit kurz"}
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

      {/* Courses List */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBF9F6] border-b border-[#EBE6DF]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Kurz
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Kategorie
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Badge
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Featured
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DF]">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-[#FBF9F6] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center text-xl">
                        {course.icon || <BookOpen className="w-5 h-5 text-[#C41E3A]" />}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1F1A17]">{course.title}</p>
                        {course.subtitle && (
                          <p className="text-sm text-[#6B5D54]">{course.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#6B5D54]">
                      {categoryLabels[course.category] || course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {course.badge && (
                      <span className="inline-block bg-[#FFE5E5] text-[#C41E3A] text-xs font-semibold px-3 py-1 rounded-full">
                        {course.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {course.featured ? (
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    ) : (
                      <span className="inline-block w-3 h-3 bg-[#EBE6DF] rounded-full"></span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(course)}
                        className="p-2 hover:bg-[#FFE5E5] rounded-lg transition-colors group"
                      >
                        <Pencil className="w-4 h-4 text-[#6B5D54] group-hover:text-[#C41E3A]" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-[#6B5D54] group-hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B5D54]">
                    Zatím žádné kurzy. Přidejte první kurz.
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
