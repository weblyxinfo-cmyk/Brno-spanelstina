"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

interface BookingFormData {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  notes: string;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  isLoading?: boolean;
}

export default function BookingForm({ onSubmit, isLoading }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Vyplňte prosím vaše jméno";
    }

    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = "Vyplňte prosím váš email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      newErrors.studentEmail = "Zadejte platnou emailovou adresu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
          Jméno a příjmení *
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5D54]" />
          <input
            type="text"
            value={formData.studentName}
            onChange={(e) =>
              setFormData({ ...formData, studentName: e.target.value })
            }
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
              errors.studentName
                ? "border-red-400 focus:border-red-500"
                : "border-[#EBE6DF] focus:border-[#E07B53]"
            } focus:outline-none transition-colors bg-white`}
            placeholder="Jan Novák"
          />
        </div>
        {errors.studentName && (
          <p className="mt-1 text-sm text-red-500">{errors.studentName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5D54]" />
          <input
            type="email"
            value={formData.studentEmail}
            onChange={(e) =>
              setFormData({ ...formData, studentEmail: e.target.value })
            }
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
              errors.studentEmail
                ? "border-red-400 focus:border-red-500"
                : "border-[#EBE6DF] focus:border-[#E07B53]"
            } focus:outline-none transition-colors bg-white`}
            placeholder="jan@email.cz"
          />
        </div>
        {errors.studentEmail && (
          <p className="mt-1 text-sm text-red-500">{errors.studentEmail}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
          Telefon (nepovinné)
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5D54]" />
          <input
            type="tel"
            value={formData.studentPhone}
            onChange={(e) =>
              setFormData({ ...formData, studentPhone: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors bg-white"
            placeholder="+420 123 456 789"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
          Poznámka (nepovinné)
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#6B5D54]" />
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={3}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors bg-white resize-none"
            placeholder="Máte nějaké speciální požadavky?"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#E07B53] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#C4613D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E07B53]/30"
      >
        {isLoading ? "Zpracování..." : "Pokračovat k souhrnu"}
      </button>
    </motion.form>
  );
}
