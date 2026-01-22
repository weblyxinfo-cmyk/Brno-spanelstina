"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Star, Quote, CheckCircle, XCircle, Clock } from "lucide-react";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, approveTestimonial } from "@/app/actions/admin";

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string | null;
  course: string | null;
  rating: number | null;
  featured: boolean | null;
  approved: boolean | null;
  createdAt: string | null;
}

export default function AdminReferencePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [formData, setFormData] = useState({
    text: "",
    author: "",
    role: "",
    course: "",
    rating: 5,
    featured: false,
    approved: false,
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      text: "",
      author: "",
      role: "",
      course: "",
      rating: 5,
      featured: false,
      approved: false,
    });
    setEditingId(null);
    setIsCreating(false);
  }

  function startEdit(testimonial: Testimonial) {
    setFormData({
      text: testimonial.text,
      author: testimonial.author,
      role: testimonial.role || "",
      course: testimonial.course || "",
      rating: testimonial.rating || 5,
      featured: testimonial.featured || false,
      approved: testimonial.approved || false,
    });
    setEditingId(testimonial.id);
    setIsCreating(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      const result = await updateTestimonial(editingId, formData);
      if (result.success) {
        loadTestimonials();
        resetForm();
      } else {
        alert(result.error);
      }
    } else {
      const result = await createTestimonial({ ...formData, approved: true });
      if (result.success) {
        loadTestimonials();
        resetForm();
      } else {
        alert(result.error);
      }
    }
  }

  async function handleApprove(id: number, approve: boolean) {
    const result = await approveTestimonial(id, approve);
    if (result.success) {
      loadTestimonials();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Opravdu chcete smazat tuto referenci?")) {
      const result = await deleteTestimonial(id);
      if (result.success) {
        loadTestimonials();
      } else {
        alert(result.error);
      }
    }
  }

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "pending") return !t.approved;
    if (filter === "approved") return t.approved;
    return true;
  });

  const pendingCount = testimonials.filter((t) => !t.approved).length;
  const approvedCount = testimonials.filter((t) => t.approved).length;

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
          <h1 className="text-3xl font-bold text-[#1F1A17]">Reference</h1>
          <p className="text-[#6B5D54]">
            {pendingCount > 0
              ? `${pendingCount} čeká na schválení`
              : "Všechny reference schváleny"}
          </p>
        </div>
        <div className="flex gap-3">
          {!isCreating && !editingId && (
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Přidat referenci
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
            filter === "all"
              ? "bg-[#E07B53] text-white"
              : "bg-white text-[#6B5D54] hover:bg-[#FBF9F6]"
          }`}
        >
          Vše ({testimonials.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
            filter === "pending"
              ? "bg-[#E07B53] text-white"
              : "bg-white text-[#6B5D54] hover:bg-[#FBF9F6]"
          }`}
        >
          <Clock className="w-4 h-4" />
          Čeká na schválení ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${
            filter === "approved"
              ? "bg-[#E07B53] text-white"
              : "bg-white text-[#6B5D54] hover:bg-[#FBF9F6]"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Schválené ({approvedCount})
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F1A17]">
              {editingId ? "Upravit referenci" : "Nová reference"}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-[#FBF9F6] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6B5D54]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                Text reference *
              </label>
              <textarea
                required
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors resize-none"
                placeholder="Reference od studenta..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Autor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                  placeholder="např. Jan N."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Role / popis
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                  placeholder="např. Student skupinového kurzu"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Kurz
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                  placeholder="např. Skupinový kurz B1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Hodnocení
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-2 hover:bg-[#FBF9F6] rounded-lg transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-[#EBE6DF]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#EBE6DF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E07B53]"></div>
                </label>
                <span className="text-sm font-semibold text-[#1F1A17]">
                  Featured
                </span>
              </div>

              {editingId && (
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.approved}
                      onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#EBE6DF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                  <span className="text-sm font-semibold text-[#1F1A17]">
                    Schváleno
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
              >
                <Check className="w-5 h-5" />
                {editingId ? "Uložit změny" : "Vytvořit referenci"}
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

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`bg-white rounded-2xl p-6 relative group ${
              !testimonial.approved ? "ring-2 ring-orange-300" : ""
            }`}
          >
            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              {testimonial.approved ? (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Schváleno
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Čeká na schválení
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!testimonial.approved && (
                <button
                  onClick={() => handleApprove(testimonial.id, true)}
                  className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  title="Schválit"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </button>
              )}
              {testimonial.approved && (
                <button
                  onClick={() => handleApprove(testimonial.id, false)}
                  className="p-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  title="Zrušit schválení"
                >
                  <XCircle className="w-4 h-4 text-orange-600" />
                </button>
              )}
              <button
                onClick={() => startEdit(testimonial)}
                className="p-2 bg-[#FBF9F6] hover:bg-[#FFE5E5] rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4 text-[#E07B53]" />
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="p-2 bg-[#FBF9F6] hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            <div className="pt-8">
              <Quote className="w-8 h-8 text-[#FFE5E5] mb-4" />

              <p className="text-[#1F1A17] mb-4 line-clamp-3">{testimonial.text}</p>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (testimonial.rating || 5)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-[#EBE6DF]"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1F1A17]">{testimonial.author}</p>
                  {testimonial.role && (
                    <p className="text-sm text-[#6B5D54]">{testimonial.role}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {testimonial.course && (
                    <span className="text-xs bg-[#FBF9F6] text-[#6B5D54] px-2 py-1 rounded-full">
                      {testimonial.course}
                    </span>
                  )}
                  {testimonial.featured && (
                    <span className="text-xs bg-[#FFE5E5] text-[#E07B53] px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {testimonial.createdAt && (
                <p className="text-xs text-[#6B5D54] mt-3">
                  {new Date(testimonial.createdAt).toLocaleDateString("cs-CZ")}
                </p>
              )}
            </div>
          </div>
        ))}

        {filteredTestimonials.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-[#6B5D54]">
            {filter === "pending"
              ? "Žádné reference nečekají na schválení"
              : filter === "approved"
              ? "Žádné schválené reference"
              : "Zatím žádné reference. Přidejte první referenci."}
          </div>
        )}
      </div>
    </div>
  );
}
