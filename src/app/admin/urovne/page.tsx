"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, GripVertical } from "lucide-react";
import { getLevels, createLevel, updateLevel, deleteLevel } from "@/app/actions/admin";

interface Level {
  id: number;
  code: string;
  label: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  grammarTitle: string | null;
  grammar: string | null;
  color: string | null;
  sortOrder: number | null;
}

const colorOptions = [
  { value: "#22C55E", label: "Zelená (A1)" },
  { value: "#84CC16", label: "Limetková (A2)" },
  { value: "#EAB308", label: "Žlutá (B1)" },
  { value: "#F97316", label: "Oranžová (B2)" },
  { value: "#EF4444", label: "Červená (C1)" },
  { value: "#DC2626", label: "Tmavě červená (C2)" },
];

export default function AdminUrovnePage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    label: "",
    title: "",
    subtitle: "",
    description: "",
    grammarTitle: "",
    grammar: [""],
    color: "#22C55E",
    sortOrder: 0,
  });

  useEffect(() => {
    loadLevels();
  }, []);

  async function loadLevels() {
    const data = await getLevels();
    setLevels(data);
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      code: "",
      label: "",
      title: "",
      subtitle: "",
      description: "",
      grammarTitle: "",
      grammar: [""],
      color: "#22C55E",
      sortOrder: levels.length,
    });
    setEditingId(null);
    setIsCreating(false);
  }

  function startEdit(level: Level) {
    let grammar: string[] = [""];
    try {
      if (level.grammar) grammar = JSON.parse(level.grammar);
    } catch {
      // Keep default
    }

    setFormData({
      code: level.code,
      label: level.label || "",
      title: level.title,
      subtitle: level.subtitle || "",
      description: level.description || "",
      grammarTitle: level.grammarTitle || "",
      grammar: grammar.length > 0 ? grammar : [""],
      color: level.color || "#22C55E",
      sortOrder: level.sortOrder || 0,
    });
    setEditingId(level.id);
    setIsCreating(false);
  }

  function addGrammarItem() {
    setFormData({ ...formData, grammar: [...formData.grammar, ""] });
  }

  function updateGrammar(index: number, value: string) {
    const newGrammar = [...formData.grammar];
    newGrammar[index] = value;
    setFormData({ ...formData, grammar: newGrammar });
  }

  function removeGrammar(index: number) {
    if (formData.grammar.length > 1) {
      const newGrammar = formData.grammar.filter((_, i) => i !== index);
      setFormData({ ...formData, grammar: newGrammar });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const submitData = {
      ...formData,
      grammar: formData.grammar.filter((g) => g.trim() !== ""),
    };

    if (editingId) {
      const result = await updateLevel(editingId, submitData);
      if (result.success) {
        loadLevels();
        resetForm();
      } else {
        alert(result.error);
      }
    } else {
      const result = await createLevel(submitData);
      if (result.success) {
        loadLevels();
        resetForm();
      } else {
        alert(result.error);
      }
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Opravdu chcete smazat tuto úroveň?")) {
      const result = await deleteLevel(id);
      if (result.success) {
        loadLevels();
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
          <h1 className="text-3xl font-bold text-[#1F1A17]">Jazykové úrovně</h1>
          <p className="text-[#6B5D54]">Správa CEFR úrovní</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => {
              setFormData((prev) => ({ ...prev, sortOrder: levels.length }));
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9E1830] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Přidat úroveň
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F1A17]">
              {editingId ? "Upravit úroveň" : "Nová úroveň"}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-[#FBF9F6] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6B5D54]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Kód *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. A1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. Začátečník"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Pořadí
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Název *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  placeholder="např. Úplný začátečník"
                />
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
                  placeholder="např. Breakthrough"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Barva
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                  >
                    {colorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-[#EBE6DF]"
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
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
                placeholder="Co student zvládne na této úrovni..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                Nadpis gramatiky
              </label>
              <input
                type="text"
                value={formData.grammarTitle}
                onChange={(e) => setFormData({ ...formData, grammarTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                placeholder="např. Co se naučíte"
              />
            </div>

            {/* Grammar Items */}
            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                Gramatické body
              </label>
              <div className="space-y-3">
                {formData.grammar.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateGrammar(index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                      placeholder="např. Přítomný čas pravidelných sloves"
                    />
                    <button
                      type="button"
                      onClick={() => removeGrammar(index)}
                      className="p-3 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGrammarItem}
                  className="text-sm text-[#C41E3A] font-semibold hover:underline"
                >
                  + Přidat bod
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9E1830] transition-colors"
              >
                <Check className="w-5 h-5" />
                {editingId ? "Uložit změny" : "Vytvořit úroveň"}
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

      {/* Levels List */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="space-y-1 p-4">
          {levels.map((level) => (
            <div
              key={level.id}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#FBF9F6] transition-colors group"
            >
              <GripVertical className="w-5 h-5 text-[#EBE6DF] cursor-grab" />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg"
                style={{ backgroundColor: level.color || "#22C55E" }}
              >
                {level.code}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-[#1F1A17]">{level.title}</h3>
                  {level.label && (
                    <span className="text-xs bg-[#FBF9F6] text-[#6B5D54] px-2 py-1 rounded-full">
                      {level.label}
                    </span>
                  )}
                </div>
                {level.subtitle && (
                  <p className="text-sm text-[#6B5D54]">{level.subtitle}</p>
                )}
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(level)}
                  className="p-2 hover:bg-[#FFE5E5] rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 text-[#C41E3A]" />
                </button>
                <button
                  onClick={() => handleDelete(level.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}

          {levels.length === 0 && (
            <div className="p-12 text-center text-[#6B5D54]">
              Zatím žádné úrovně. Přidejte první úroveň.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
