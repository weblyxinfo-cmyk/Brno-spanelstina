"use client";

import { useEffect, useState } from "react";
import { Save, BarChart3, Users, Award, Calendar } from "lucide-react";
import { getSettings, updateMultipleSettings } from "@/app/actions/admin";

interface Setting {
  id: number;
  key: string;
  value: string | null;
}

export default function AdminNastaveniPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    stats_students: "",
    stats_years: "",
    stats_dele: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const data = await getSettings();
    const settingsMap: Record<string, string> = {};
    data.forEach((s: Setting) => {
      settingsMap[s.key] = s.value || "";
    });

    setFormData({
      stats_students: settingsMap["stats_students"] || "500+",
      stats_years: settingsMap["stats_years"] || "15+",
      stats_dele: settingsMap["stats_dele"] || "98%",
    });
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const result = await updateMultipleSettings(formData);

    setSaving(false);
    if (result.success) {
      alert("Nastavení bylo uloženo.");
    } else {
      alert(result.error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F1A17]">Nastavení</h1>
        <p className="text-[#6B5D54]">Statistiky a informace zobrazené na webu</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Stats Settings */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1F1A17] mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#C41E3A]" />
            Statistiky na stránce Reference
          </h2>

          <p className="text-sm text-[#6B5D54] mb-6 bg-[#FBF9F6] p-4 rounded-xl">
            Tyto hodnoty se zobrazují na stránce Reference. Průměrné hodnocení se počítá automaticky ze schválených recenzí.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#1F1A17] mb-2">
                <Users className="w-4 h-4 text-[#C41E3A]" />
                Počet studentů
              </label>
              <input
                type="text"
                value={formData.stats_students}
                onChange={(e) => setFormData({ ...formData, stats_students: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                placeholder="např. 500+"
              />
              <p className="text-xs text-[#6B5D54] mt-1">Zobrazí se jako &quot;spokojených studentů&quot;</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#1F1A17] mb-2">
                <Calendar className="w-4 h-4 text-[#C41E3A]" />
                Let zkušeností
              </label>
              <input
                type="text"
                value={formData.stats_years}
                onChange={(e) => setFormData({ ...formData, stats_years: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                placeholder="např. 15+"
              />
              <p className="text-xs text-[#6B5D54] mt-1">Zobrazí se jako &quot;let zkušeností&quot;</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#1F1A17] mb-2">
                <Award className="w-4 h-4 text-[#C41E3A]" />
                Úspěšnost u DELE
              </label>
              <input
                type="text"
                value={formData.stats_dele}
                onChange={(e) => setFormData({ ...formData, stats_dele: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors"
                placeholder="např. 98%"
              />
              <p className="text-xs text-[#6B5D54] mt-1">Zobrazí se jako &quot;úspěšnost u DELE&quot;</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#FFE5E5]/30 rounded-xl">
            <p className="text-sm text-[#9E1830]">
              <strong>Průměrné hodnocení</strong> se počítá automaticky ze všech schválených recenzí a nelze jej ručně upravit.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9E1830] transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "Ukládám..." : "Uložit nastavení"}
        </button>
      </form>
    </div>
  );
}
