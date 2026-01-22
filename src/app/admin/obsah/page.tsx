"use client";

import { useEffect, useState } from "react";
import { Save, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { getAllPageContent, updateMultiplePageContent } from "@/app/actions/admin";

interface ContentItem {
  id: number;
  page: string;
  section: string;
  key: string;
  value: string | null;
}

// Define editable content structure for each page
const pageStructure: Record<string, Record<string, string[]>> = {
  homepage: {
    hero: ["title", "subtitle", "description", "cta_text"],
    about: ["title", "description"],
    cta: ["title", "description", "button_text"],
  },
  "o-nas": {
    hero: ["title", "subtitle", "description"],
    mission: ["title", "description"],
    values: ["title", "description"],
  },
  kurzy: {
    hero: ["title", "subtitle", "description"],
    cta: ["title", "description"],
  },
  lektori: {
    hero: ["title", "subtitle", "description"],
  },
  reference: {
    hero: ["title", "subtitle", "description"],
    cta: ["title", "description"],
  },
  kontakt: {
    hero: ["title", "subtitle", "description"],
    info: ["address", "email", "phone", "hours"],
  },
  "jazykove-urovne": {
    hero: ["title", "subtitle", "description"],
  },
};

const pageLabels: Record<string, string> = {
  homepage: "Hlavní stránka",
  "o-nas": "O nás",
  kurzy: "Kurzy",
  lektori: "Lektoři",
  reference: "Reference",
  kontakt: "Kontakt",
  "jazykove-urovne": "Jazykové úrovně",
};

const sectionLabels: Record<string, string> = {
  hero: "Hero sekce",
  about: "O nás",
  mission: "Mise",
  values: "Hodnoty",
  cta: "Call to Action",
  info: "Kontaktní informace",
};

const keyLabels: Record<string, string> = {
  title: "Nadpis",
  subtitle: "Podnadpis",
  description: "Popis",
  cta_text: "Text tlačítka",
  button_text: "Text tlačítka",
  address: "Adresa",
  email: "Email",
  phone: "Telefon",
  hours: "Otevírací doba",
};

export default function AdminObsahPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedPages, setExpandedPages] = useState<string[]>(["homepage"]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    const data = await getAllPageContent();
    setContent(data);

    // Initialize form data with existing content
    const initialData: Record<string, string> = {};
    data.forEach((item) => {
      const key = `${item.page}:${item.section}:${item.key}`;
      initialData[key] = item.value || "";
    });
    setFormData(initialData);
    setLoading(false);
  }

  function togglePage(page: string) {
    setExpandedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  }

  function handleChange(page: string, section: string, key: string, value: string) {
    const formKey = `${page}:${section}:${key}`;
    setFormData((prev) => ({ ...prev, [formKey]: value }));
    setHasChanges(true);
  }

  function getValue(page: string, section: string, key: string): string {
    const formKey = `${page}:${section}:${key}`;
    return formData[formKey] || "";
  }

  async function handleSave() {
    setSaving(true);

    const items: Array<{ page: string; section: string; key: string; value: string }> = [];

    Object.entries(formData).forEach(([key, value]) => {
      const [page, section, fieldKey] = key.split(":");
      items.push({ page, section, key: fieldKey, value });
    });

    const result = await updateMultiplePageContent(items);

    setSaving(false);
    if (result.success) {
      setHasChanges(false);
      alert("Obsah byl uložen.");
    } else {
      alert(result.error);
    }
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
          <h1 className="text-3xl font-bold text-[#1F1A17]">Obsah stránek</h1>
          <p className="text-[#6B5D54]">Upravte texty zobrazené na webu</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "Ukládám..." : "Uložit změny"}
        </button>
      </div>

      {hasChanges && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-orange-700 text-sm">
            Máte neuložené změny. Nezapomeňte je uložit.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(pageStructure).map(([pageName, sections]) => (
          <div key={pageName} className="bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => togglePage(pageName)}
              className="w-full flex items-center justify-between p-6 hover:bg-[#FBF9F6] transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#E07B53]" />
                <span className="font-bold text-[#1F1A17]">
                  {pageLabels[pageName] || pageName}
                </span>
              </div>
              {expandedPages.includes(pageName) ? (
                <ChevronUp className="w-5 h-5 text-[#6B5D54]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#6B5D54]" />
              )}
            </button>

            {expandedPages.includes(pageName) && (
              <div className="px-6 pb-6 space-y-6">
                {Object.entries(sections).map(([sectionName, keys]) => (
                  <div key={sectionName} className="border-t border-[#EBE6DF] pt-6">
                    <h3 className="text-sm font-semibold text-[#6B5D54] uppercase tracking-wider mb-4">
                      {sectionLabels[sectionName] || sectionName}
                    </h3>
                    <div className="space-y-4">
                      {keys.map((fieldKey) => (
                        <div key={fieldKey}>
                          <label className="block text-sm font-medium text-[#1F1A17] mb-2">
                            {keyLabels[fieldKey] || fieldKey}
                          </label>
                          {fieldKey === "description" ? (
                            <textarea
                              value={getValue(pageName, sectionName, fieldKey)}
                              onChange={(e) =>
                                handleChange(pageName, sectionName, fieldKey, e.target.value)
                              }
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors resize-none"
                            />
                          ) : (
                            <input
                              type="text"
                              value={getValue(pageName, sectionName, fieldKey)}
                              onChange={(e) =>
                                handleChange(pageName, sectionName, fieldKey, e.target.value)
                              }
                              className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
