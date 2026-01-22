"use client";

import { useEffect, useState } from "react";
import { Save, Search, Globe, Image, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from "lucide-react";
import { getAllSeoMeta, updateSeoMeta } from "@/app/actions/admin";

interface SeoItem {
  id: number;
  page: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

const pages = [
  { id: "homepage", label: "Hlavní stránka", path: "/" },
  { id: "o-nas", label: "O nás", path: "/o-nas" },
  { id: "kurzy", label: "Kurzy", path: "/kurzy" },
  { id: "lektori", label: "Lektoři", path: "/lektori" },
  { id: "reference", label: "Reference", path: "/reference" },
  { id: "kontakt", label: "Kontakt", path: "/kontakt" },
  { id: "jazykove-urovne", label: "Jazykové úrovně", path: "/jazykove-urovne" },
];

export default function AdminSeoPage() {
  const [seoData, setSeoData] = useState<SeoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedPage, setExpandedPage] = useState<string | null>("homepage");
  const [formData, setFormData] = useState<Record<string, Partial<SeoItem>>>({});

  useEffect(() => {
    loadSeoData();
  }, []);

  async function loadSeoData() {
    const data = await getAllSeoMeta();
    setSeoData(data);

    // Initialize form data
    const initialData: Record<string, Partial<SeoItem>> = {};
    pages.forEach((page) => {
      const existing = data.find((d) => d.page === page.id);
      initialData[page.id] = existing || {
        title: "",
        description: "",
        keywords: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
      };
    });
    setFormData(initialData);
    setLoading(false);
  }

  function handleChange(page: string, field: keyof SeoItem, value: string) {
    setFormData((prev) => ({
      ...prev,
      [page]: { ...prev[page], [field]: value },
    }));
  }

  async function handleSave(pageId: string) {
    setSaving(pageId);

    const data = formData[pageId];
    const result = await updateSeoMeta(pageId, {
      title: data.title || undefined,
      description: data.description || undefined,
      keywords: data.keywords || undefined,
      ogTitle: data.ogTitle || undefined,
      ogDescription: data.ogDescription || undefined,
      ogImage: data.ogImage || undefined,
    });

    setSaving(null);
    if (result.success) {
      loadSeoData();
    } else {
      alert(result.error);
    }
  }

  function getSeoScore(pageId: string): { score: number; issues: string[] } {
    const data = formData[pageId];
    const issues: string[] = [];
    let score = 0;

    // Title check
    if (data?.title) {
      if (data.title.length >= 30 && data.title.length <= 60) {
        score += 25;
      } else {
        issues.push(`Title má ${data.title.length} znaků (ideálně 30-60)`);
        score += 10;
      }
    } else {
      issues.push("Chybí title");
    }

    // Description check
    if (data?.description) {
      if (data.description.length >= 120 && data.description.length <= 160) {
        score += 25;
      } else {
        issues.push(`Description má ${data.description.length} znaků (ideálně 120-160)`);
        score += 10;
      }
    } else {
      issues.push("Chybí meta description");
    }

    // Keywords check
    if (data?.keywords && data.keywords.length > 0) {
      score += 15;
    } else {
      issues.push("Chybí klíčová slova");
    }

    // OG tags check
    if (data?.ogTitle) score += 15;
    else issues.push("Chybí OG title");

    if (data?.ogDescription) score += 10;
    else issues.push("Chybí OG description");

    if (data?.ogImage) score += 10;
    else issues.push("Chybí OG obrázek");

    return { score, issues };
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F1A17]">SEO Nastavení</h1>
        <p className="text-[#6B5D54]">Optimalizace pro vyhledávače a sociální sítě</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {pages.map((page) => {
          const { score } = getSeoScore(page.id);
          return (
            <button
              key={page.id}
              onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}
              className={`bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow ${
                expandedPage === page.id ? "ring-2 ring-[#E07B53]" : ""
              }`}
            >
              <div
                className={`text-2xl font-bold mb-1 ${
                  score >= 80
                    ? "text-green-500"
                    : score >= 50
                    ? "text-orange-500"
                    : "text-red-500"
                }`}
              >
                {score}%
              </div>
              <div className="text-xs text-[#6B5D54] truncate">{page.label}</div>
            </button>
          );
        })}
      </div>

      {/* Detailed SEO Form */}
      <div className="space-y-4">
        {pages.map((page) => {
          const { score, issues } = getSeoScore(page.id);
          const isExpanded = expandedPage === page.id;

          return (
            <div key={page.id} className="bg-white rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedPage(isExpanded ? null : page.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#FBF9F6] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      score >= 80
                        ? "bg-green-100"
                        : score >= 50
                        ? "bg-orange-100"
                        : "bg-red-100"
                    }`}
                  >
                    {score >= 80 ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <AlertCircle
                        className={`w-6 h-6 ${
                          score >= 50 ? "text-orange-500" : "text-red-500"
                        }`}
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-[#1F1A17] block">
                      {page.label}
                    </span>
                    <span className="text-sm text-[#6B5D54]">{page.path}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-lg font-bold ${
                      score >= 80
                        ? "text-green-500"
                        : score >= 50
                        ? "text-orange-500"
                        : "text-red-500"
                    }`}
                  >
                    {score}%
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#6B5D54]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#6B5D54]" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-6">
                  {/* Issues */}
                  {issues.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-orange-700 mb-2">
                        Doporučení pro zlepšení:
                      </p>
                      <ul className="text-sm text-orange-600 space-y-1">
                        {issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Basic SEO */}
                  <div className="border-t border-[#EBE6DF] pt-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#6B5D54] uppercase tracking-wider mb-4">
                      <Search className="w-4 h-4" />
                      Základní SEO
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1F1A17] mb-2">
                          Title tag
                          <span className="text-[#6B5D54] font-normal ml-2">
                            ({formData[page.id]?.title?.length || 0}/60)
                          </span>
                        </label>
                        <input
                          type="text"
                          value={formData[page.id]?.title || ""}
                          onChange={(e) => handleChange(page.id, "title", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                          placeholder="Nadpis stránky | Španělština Brno"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1F1A17] mb-2">
                          Meta description
                          <span className="text-[#6B5D54] font-normal ml-2">
                            ({formData[page.id]?.description?.length || 0}/160)
                          </span>
                        </label>
                        <textarea
                          value={formData[page.id]?.description || ""}
                          onChange={(e) => handleChange(page.id, "description", e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors resize-none"
                          placeholder="Stručný popis stránky pro vyhledávače..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1F1A17] mb-2">
                          Klíčová slova
                        </label>
                        <input
                          type="text"
                          value={formData[page.id]?.keywords || ""}
                          onChange={(e) => handleChange(page.id, "keywords", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                          placeholder="španělština, kurzy, brno, výuka"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Open Graph */}
                  <div className="border-t border-[#EBE6DF] pt-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#6B5D54] uppercase tracking-wider mb-4">
                      <Globe className="w-4 h-4" />
                      Sociální sítě (Open Graph)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1F1A17] mb-2">
                          OG Title
                        </label>
                        <input
                          type="text"
                          value={formData[page.id]?.ogTitle || ""}
                          onChange={(e) => handleChange(page.id, "ogTitle", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                          placeholder="Nadpis pro sociální sítě"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1F1A17] mb-2">
                          OG Description
                        </label>
                        <textarea
                          value={formData[page.id]?.ogDescription || ""}
                          onChange={(e) => handleChange(page.id, "ogDescription", e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors resize-none"
                          placeholder="Popis pro sociální sítě..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1F1A17] mb-2">
                          OG Image URL
                        </label>
                        <input
                          type="text"
                          value={formData[page.id]?.ogImage || ""}
                          onChange={(e) => handleChange(page.id, "ogImage", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                          placeholder="https://brno-spanelstina.cz/og-image.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave(page.id)}
                    disabled={saving === page.id}
                    className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving === page.id ? "Ukládám..." : "Uložit SEO"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
