"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, CreditCard, GripVertical } from "lucide-react";
import { getPricing, createPricing, updatePricing, deletePricing } from "@/app/actions/admin";

interface Pricing {
  id: number;
  name: string;
  description: string | null;
  price: string;
  period: string | null;
  icon: string | null;
  features: string | null;
  featured: boolean | null;
  sortOrder: number | null;
}

export default function AdminCenikPage() {
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    period: "",
    icon: "",
    features: [""],
    featured: false,
    sortOrder: 0,
  });

  useEffect(() => {
    loadPricing();
  }, []);

  async function loadPricing() {
    const data = await getPricing();
    setPricing(data);
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      price: "",
      period: "",
      icon: "",
      features: [""],
      featured: false,
      sortOrder: pricing.length,
    });
    setEditingId(null);
    setIsCreating(false);
  }

  function startEdit(item: Pricing) {
    let features: string[] = [""];
    try {
      if (item.features) features = JSON.parse(item.features);
    } catch {
      // Keep default
    }

    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      period: item.period || "",
      icon: item.icon || "",
      features: features.length > 0 ? features : [""],
      featured: item.featured || false,
      sortOrder: item.sortOrder || 0,
    });
    setEditingId(item.id);
    setIsCreating(false);
  }

  function addFeature() {
    setFormData({ ...formData, features: [...formData.features, ""] });
  }

  function updateFeature(index: number, value: string) {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  }

  function removeFeature(index: number) {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({ ...formData, features: newFeatures });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const submitData = {
      ...formData,
      features: formData.features.filter((f) => f.trim() !== ""),
    };

    if (editingId) {
      const result = await updatePricing(editingId, submitData);
      if (result.success) {
        loadPricing();
        resetForm();
      } else {
        alert(result.error);
      }
    } else {
      const result = await createPricing(submitData);
      if (result.success) {
        loadPricing();
        resetForm();
      } else {
        alert(result.error);
      }
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Opravdu chcete smazat tuto položku ceníku?")) {
      const result = await deletePricing(id);
      if (result.success) {
        loadPricing();
      } else {
        alert(result.error);
      }
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
          <h1 className="text-3xl font-bold text-[#1F1A17]">Ceník</h1>
          <p className="text-[#6B5D54]">Správa ceníku kurzů</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => {
              setFormData((prev) => ({ ...prev, sortOrder: pricing.length }));
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Přidat položku
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F1A17]">
              {editingId ? "Upravit položku" : "Nová položka"}
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
                  Název *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                  placeholder="např. Skupinový kurz"
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                  placeholder="např. 👥"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Cena *
                </label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                  placeholder="např. 2 990 Kč"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                  Období
                </label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                  placeholder="např. /měsíc"
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
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
                  <div className="w-11 h-6 bg-[#EBE6DF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E07B53]"></div>
                </label>
                <span className="text-sm font-semibold text-[#1F1A17]">
                  Zvýrazněná položka
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                Popis
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                placeholder="např. Nejoblíbenější volba"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                Co je zahrnuto
              </label>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors"
                      placeholder="např. 90 minut týdně"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-3 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-sm text-[#E07B53] font-semibold hover:underline"
                >
                  + Přidat položku
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
              >
                <Check className="w-5 h-5" />
                {editingId ? "Uložit změny" : "Vytvořit položku"}
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

      {/* Pricing List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricing.map((item) => {
          let features: string[] = [];
          try {
            if (item.features) features = JSON.parse(item.features);
          } catch {
            // Keep empty
          }

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-6 relative group ${
                item.featured ? "ring-2 ring-[#E07B53]" : ""
              }`}
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 bg-[#FBF9F6] hover:bg-[#FFE5E5] rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 text-[#E07B53]" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-[#FBF9F6] hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {item.featured && (
                <span className="absolute -top-3 left-6 bg-[#E07B53] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Doporučeno
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#FFE5E5] rounded-xl flex items-center justify-center text-2xl">
                  {item.icon || <CreditCard className="w-6 h-6 text-[#E07B53]" />}
                </div>
                <div>
                  <h3 className="font-bold text-[#1F1A17]">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-[#6B5D54]">{item.description}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-[#1F1A17]">{item.price}</span>
                {item.period && (
                  <span className="text-[#6B5D54] text-sm">{item.period}</span>
                )}
              </div>

              {features.length > 0 && (
                <ul className="space-y-2">
                  {features.slice(0, 4).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-[#6B5D54]"
                    >
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {features.length > 4 && (
                    <li className="text-sm text-[#6B5D54]">
                      +{features.length - 4} dalších...
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}

        {pricing.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-[#6B5D54]">
            Zatím žádné položky ceníku. Přidejte první položku.
          </div>
        )}
      </div>
    </div>
  );
}
