"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import { submitCourseReservation } from "@/app/actions/course-reservation";
import type { ScheduleCourse } from "@/components/CourseTable";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: ScheduleCourse | null;
  allCourses?: ScheduleCourse[];
  prefillData?: {
    name: string;
    email: string;
    phone: string;
  } | null;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  gdprConsent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  gdprConsent?: string;
}

export default function ReservationModal({
  isOpen,
  onClose,
  course,
  allCourses = [],
  prefillData = null,
}: ReservationModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<ScheduleCourse | null>(course);
  const [formData, setFormData] = useState<FormData>({
    name: prefillData?.name || "",
    email: prefillData?.email || "",
    phone: prefillData?.phone || "",
    message: "",
    gdprConsent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update selected course when prop changes
  useEffect(() => {
    setSelectedCourse(course);
  }, [course]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: prefillData?.name || "",
        email: prefillData?.email || "",
        phone: prefillData?.phone || "",
        message: "",
        gdprConsent: false,
      });
      setErrors({});
      setIsSuccess(false);
      setSubmitError(null);
    }
  }, [isOpen, prefillData]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Zadejte jméno (min. 2 znaky)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Zadejte email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Zadejte platný email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Zadejte telefon";
    } else if (!/^[+]?[\d\s-]{9,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Zadejte platné telefonní číslo";
    }

    if (!formData.gdprConsent) {
      newErrors.gdprConsent = "Musíte souhlasit se zpracováním údajů";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedCourse) {
      setSubmitError("Vyberte kurz");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCourseReservation({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || undefined,
        courseName: selectedCourse.uroven,
        courseDay: selectedCourse.den,
        courseTime: selectedCourse.cas,
        coursePrice: selectedCourse.cena,
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setSubmitError(result.error || "Něco se pokazilo. Zkuste to znovu.");
      }
    } catch {
      setSubmitError("Nepodařilo se odeslat rezervaci. Zkuste to znovu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Generate unique key for course selection
  const getCourseKey = (c: ScheduleCourse, index: number) =>
    `${c.uroven}-${c.den}-${c.cas}-${index}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#EBE6DF] bg-gradient-to-r from-[#E07B53] to-[#C4613D]">
              <h2 className="text-xl font-bold text-white">
                {isSuccess ? "Rezervace odeslána!" : "Rezervace kurzu"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F1A17] mb-3">
                    Děkujeme za váš zájem!
                  </h3>
                  <p className="text-[#6B5D54] mb-6">
                    Vaši rezervaci jsme obdrželi. Brzy vás budeme kontaktovat
                    s dalšími informacemi.
                  </p>
                  {selectedCourse && (
                    <div className="bg-[#FBF9F6] rounded-2xl p-4 text-left">
                      <p className="text-sm text-[#6B5D54] mb-2">Vybraný kurz:</p>
                      <p className="font-bold text-[#1F1A17] capitalize">
                        {selectedCourse.uroven}
                      </p>
                      <p className="text-sm text-[#6B5D54]">
                        {selectedCourse.den} • {selectedCourse.cas}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    className="mt-8 px-8 py-3 bg-[#E07B53] text-white rounded-full font-semibold hover:bg-[#C4613D] transition-colors"
                  >
                    Zavřít
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Course Selection (if no course pre-selected or show dropdown) */}
                  {(!selectedCourse || allCourses.length > 0) && (
                    <div>
                      <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                        Vybraný kurz *
                      </label>
                      {allCourses.length > 0 ? (
                        <select
                          value={
                            selectedCourse
                              ? getCourseKey(selectedCourse, allCourses.indexOf(selectedCourse))
                              : ""
                          }
                          onChange={(e) => {
                            const idx = allCourses.findIndex(
                              (c, i) => getCourseKey(c, i) === e.target.value
                            );
                            setSelectedCourse(idx >= 0 ? allCourses[idx] : null);
                          }}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
                        >
                          <option value="">-- Vyberte kurz --</option>
                          {allCourses.map((c, i) => (
                            <option key={getCourseKey(c, i)} value={getCourseKey(c, i)}>
                              {c.uroven} • {c.den} • {c.cas} • {c.cena}
                            </option>
                          ))}
                        </select>
                      ) : selectedCourse ? (
                        <div className="bg-[#FBF9F6] rounded-xl p-4 border-2 border-[#E07B53]">
                          <div className="flex items-center gap-3 text-[#1F1A17]">
                            <Calendar className="w-4 h-4 text-[#E07B53]" />
                            <span className="font-semibold capitalize">
                              {selectedCourse.uroven}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-[#6B5D54]">
                            <span>{selectedCourse.den}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {selectedCourse.cas}
                            </span>
                            <span className="font-semibold text-[#1F1A17]">
                              {selectedCourse.cena}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                      Jméno a příjmení *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5D54]" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                          errors.name
                            ? "border-red-400 focus:border-red-500"
                            : "border-[#EBE6DF] focus:border-[#E07B53]"
                        } focus:outline-none transition-colors bg-white`}
                        placeholder="Jan Novák"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5D54]" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                          errors.email
                            ? "border-red-400 focus:border-red-500"
                            : "border-[#EBE6DF] focus:border-[#E07B53]"
                        } focus:outline-none transition-colors bg-white`}
                        placeholder="jan@email.cz"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                      Telefon *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5D54]" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                          errors.phone
                            ? "border-red-400 focus:border-red-500"
                            : "border-[#EBE6DF] focus:border-[#E07B53]"
                        } focus:outline-none transition-colors bg-white`}
                        placeholder="+420 123 456 789"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                      Zpráva (volitelné)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#6B5D54]" />
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={3}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors bg-white resize-none"
                        placeholder="Máte nějaké dotazy nebo speciální požadavky?"
                      />
                    </div>
                  </div>

                  {/* GDPR Consent */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.gdprConsent}
                        onChange={(e) =>
                          handleInputChange("gdprConsent", e.target.checked)
                        }
                        className="mt-1 w-5 h-5 rounded border-2 border-[#EBE6DF] text-[#E07B53] focus:ring-[#E07B53] cursor-pointer"
                      />
                      <span className="text-sm text-[#6B5D54]">
                        Souhlasím se zpracováním osobních údajů za účelem vyřízení
                        rezervace kurzu. *
                      </span>
                    </label>
                    {errors.gdprConsent && (
                      <p className="mt-1 text-sm text-red-500">{errors.gdprConsent}</p>
                    )}
                  </div>

                  {/* Error message */}
                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      {submitError}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedCourse}
                    className="w-full bg-[#E07B53] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#C4613D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E07B53]/30 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Odesílám...
                      </>
                    ) : (
                      "Odeslat rezervaci"
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
