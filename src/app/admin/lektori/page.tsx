"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, User } from "lucide-react";
import { getLektori, createLektor, updateLektor, deleteLektor } from "@/app/actions/admin";

interface Lektor {
  id: number;
  name: string;
  role: string | null;
  origin: string | null;
  originFlag: string | null;
  badge: string | null;
  badgeIcon: string | null;
  avatar: string | null;
  bio: string | null;
  highlights: string | null;
}

export default function AdminLektoriPage() {
  const [lektori, setLektori] = useState<Lektor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    origin: "",
    originFlag: "",
    badge: "",
    badgeIcon: "",
    avatar: "",
    bio: [""],
    highlights: [{ icon: "", text: "" }],
  });

  useEffect(() => {
    loadLektori();
  }, []);

  async function loadLektori() {
    const data = await getLektori();
    setLektori(data);
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      name: "",
      role: "",
      origin: "",
      originFlag: "",
      badge: "",
      badgeIcon: "",
      avatar: "",
      bio: [""],
      highlights: [{ icon: "", text: "" }],
    });
    setEditingId(null);
    setIsCreating(false);
  }

  function startEdit(lektor: Lektor) {
    let bio: string[] = [""];
    let highlights: Array<{ icon: string; text: string }> = [{ icon: "", text: "" }];

    try {
      if (lektor.bio) bio = JSON.parse(lektor.bio);
      if (lektor.highlights) highlights = JSON.parse(lektor.highlights);
    } catch {
      // Keep defaults
    }

    setFormData({
      name: lektor.name,
      role: lektor.role || "",
      origin: lektor.origin || "",
      originFlag: lektor.originFlag || "",
      badge: lektor.badge || "",
      badgeIcon: lektor.badgeIcon || "",
      avatar: lektor.avatar || "",
      bio: bio.length > 0 ? bio : [""],
      highlights: highlights.length > 0 ? highlights : [{ icon: "", text: "" }],
    });
    setEditingId(lektor.id);
    setIsCreating(false);
  }

  function addBioParagraph() {
    setFormData({ ...formData, bio: [...formData.bio, ""] });
  }

  function updateBio(index: number, value: string) {
    const newBio = [...formData.bio];
    newBio[index] = value;
    setFormData({ ...formData, bio: newBio });
  }

  function removeBio(index: number) {
    if (formData.bio.length > 1) {
      const newBio = formData.bio.filter((_, i) => i !== index);
      setFormData({ ...formData, bio: newBio });
    }
  }

  function addHighlight() {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, { icon: "", text: "" }],
    });
  }

  function updateHighlight(index: number, field: "icon" | "text", value: string) {
    const newHighlights = [...formData.highlights];
    newHighlights[index][field] = value;
    setFormData({ ...formData, highlights: newHighlights });
  }

  function removeHighlight(index: number) {
    if (formData.highlights.length > 1) {
      const newHighlights = formData.highlights.filter((_, i) => i !== index);
      setFormData({ ...formData, highlights: newHighlights });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const submitData = {
      ...formData,
      bio: formData.bio.filter((b) => b.trim() !== ""),
      highlights: formData.highlights.filter((h) => h.text.trim() !== ""),
    };

    if (editingId) {
      const result = await updateLektor(editingId, submitData);
      if (result.success) {
        loadLektori();
        resetForm();
      } else {
        alert(result.error);
      }
    } else {
      const result = await createLektor(submitData);
      if (result.success) {
        loadLektori();
        resetForm();
      } else {
        alert(result.error);
      }
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Opravdu chcete smazat tohoto lektora?")) {
      const result = await deleteLektor(id);
      if (result.success) {
        loadLektori();
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
          <h1 className="text-3xl font-bold text-[#1F1A17]">Lektoři</h1>
          <p className="text-[#6B5D54]">Správa lektorů španělštiny</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9E1830] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Přidat lektora
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F1A17]">
              {editingId ? "Upravit lektora" : "Nový lektor"}
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
                  Jméno *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. Rodrigo García"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. Hlavní lektor"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Původ
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. Madrid, Španělsko"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Vlajka původu (emoji)
                </label>
                <input
                  type="text"
                  value={formData.originFlag}
                  onChange={(e) => setFormData({ ...formData, originFlag: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. 🇪🇸"
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
                  placeholder="např. Rodilý mluvčí"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Badge ikona (emoji)
                </label>
                <input
                  type="text"
                  value={formData.badgeIcon}
                  onChange={(e) => setFormData({ ...formData, badgeIcon: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. 🎯"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="URL obrázku lektora"
                />
              </div>
            </div>

            {/* Bio Paragraphs */}
            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                Bio (odstavce)
              </label>
              <div className="space-y-3">
                {formData.bio.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <textarea
                      value={paragraph}
                      onChange={(e) => updateBio(index, e.target.value)}
                      rows={2}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors resize-none"
                      placeholder="Odstavec bio..."
                    />
                    <button
                      type="button"
                      onClick={() => removeBio(index)}
                      className="p-3 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBioParagraph}
                  className="text-sm text-[#C41E3A] font-semibold hover:underline"
                >
                  + Přidat odstavec
                </button>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                Highlights
              </label>
              <div className="space-y-3">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight.icon}
                      onChange={(e) => updateHighlight(index, "icon", e.target.value)}
                      className="w-20 px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors text-center"
                      placeholder="🎓"
                    />
                    <input
                      type="text"
                      value={highlight.text}
                      onChange={(e) => updateHighlight(index, "text", e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                      placeholder="např. 10 let zkušeností"
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="p-3 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHighlight}
                  className="text-sm text-[#C41E3A] font-semibold hover:underline"
                >
                  + Přidat highlight
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9E1830] transition-colors"
              >
                <Check className="w-5 h-5" />
                {editingId ? "Uložit změny" : "Vytvořit lektora"}
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

      {/* Lektori List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lektori.map((lektor) => (
          <div
            key={lektor.id}
            className="bg-white rounded-2xl p-6 relative group"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEdit(lektor)}
                className="p-2 bg-[#FBF9F6] hover:bg-[#FFE5E5] rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4 text-[#C41E3A]" />
              </button>
              <button
                onClick={() => handleDelete(lektor.id)}
                className="p-2 bg-[#FBF9F6] hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#FFE5E5] rounded-2xl flex items-center justify-center">
                {lektor.avatar ? (
                  <img
                    src={lektor.avatar}
                    alt={lektor.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-[#C41E3A]" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-[#1F1A17]">{lektor.name}</h3>
                {lektor.role && (
                  <p className="text-sm text-[#6B5D54]">{lektor.role}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {lektor.origin && (
                <span className="text-xs bg-[#FBF9F6] text-[#6B5D54] px-3 py-1 rounded-full">
                  {lektor.originFlag} {lektor.origin}
                </span>
              )}
              {lektor.badge && (
                <span className="text-xs bg-[#FFE5E5] text-[#C41E3A] px-3 py-1 rounded-full">
                  {lektor.badgeIcon} {lektor.badge}
                </span>
              )}
            </div>
          </div>
        ))}

        {lektori.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-[#6B5D54]">
            Zatím žádní lektoři. Přidejte prvního lektora.
          </div>
        )}
      </div>
    </div>
  );
}
