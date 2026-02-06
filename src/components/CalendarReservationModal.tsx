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
  Loader2,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import MonthlyCalendar, { type CalendarCourse } from "./MonthlyCalendar";

interface CalendarReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CalendarCourse[];
  preselectedCourseId?: number | null;
  prefillData?: {
    name: string;
    email: string;
    phone: string;
  } | null;
  quizLevel?: string | null;
  onSubmit: (data: {
    courseId: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    quizLevel?: string;
  }) => Promise<{ success: boolean; error?: string }>;
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

type Step = "calendar" | "form" | "success";

export default function CalendarReservationModal({
  isOpen,
  onClose,
  courses,
  preselectedCourseId,
  prefillData,
  quizLevel,
  onSubmit,
}: CalendarReservationModalProps) {
  const [step, setStep] = useState<Step>("calendar");
  const [selectedCourse, setSelectedCourse] = useState<CalendarCourse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    gdprConsent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize with preselected course and prefill data
  useEffect(() => {
    if (isOpen) {
      // Reset state
      setStep(preselectedCourseId ? "form" : "calendar");
      setSubmitError(null);
      setErrors({});

      // Set preselected course
      if (preselectedCourseId) {
        const course = courses.find((c) => c.id === preselectedCourseId);
        if (course && !course.isFull) {
          setSelectedCourse(course);
        }
      } else {
        setSelectedCourse(null);
      }

      // Prefill form data
      setFormData({
        name: prefillData?.name || "",
        email: prefillData?.email || "",
        phone: prefillData?.phone || "",
        message: "",
        gdprConsent: false,
      });
    }
  }, [isOpen, preselectedCourseId, prefillData, courses]);

  // Prevent body scroll
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

  const handleSelectCourse = (course: CalendarCourse, date: Date) => {
    if (course.isFull) return;
    setSelectedCourse(course);
    setSelectedDate(date);
    setStep("form");
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
      const result = await onSubmit({
        courseId: selectedCourse.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        quizLevel: quizLevel || undefined,
      });

      if (result.success) {
        setStep("success");
      } else {
        setSubmitError(result.error || "Něco se pokazilo. Zkuste to znovu.");
      }
    } catch {
      setSubmitError("Nepodařilo se odeslat rezervaci. Zkuste to znovu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("cs-CZ").format(price) + " Kč";
  };

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
            className="fixed inset-0 sm:inset-4 md:inset-6 lg:inset-10 xl:inset-16 bg-white sm:rounded-2xl md:rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-[#EBE6DF] bg-gradient-to-r from-[#E07B53] to-[#C4613D]">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                {step === "form" && (
                  <button
                    onClick={() => setStep("calendar")}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                )}
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white truncate">
                  {step === "calendar" && "Vyberte kurz"}
                  {step === "form" && "Dokončit rezervaci"}
                  {step === "success" && "Odesláno!"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
              {/* Step: Calendar */}
              {step === "calendar" && (
                <MonthlyCalendar
                  courses={courses}
                  onSelectCourse={handleSelectCourse}
                  selectedCourseId={selectedCourse?.id}
                />
              )}

              {/* Step: Form */}
              {step === "form" && selectedCourse && (
                <div className="max-w-2xl mx-auto">
                  {/* Selected Course Summary */}
                  <div className="bg-[#FBF9F6] rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border-2 border-[#E07B53]">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-white ${
                          selectedCourse.almostFull ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                      >
                        {selectedCourse.availableSpots} volná
                      </span>
                      {selectedCourse.badge && (
                        <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#E07B53] text-white uppercase">
                          {selectedCourse.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-xl font-bold text-[#1F1A17] capitalize mb-2 sm:mb-3">
                      {selectedCourse.level}
                    </h3>

                    {selectedDate && (
                      <p className="text-xs sm:text-sm text-[#6B5D54] mb-2 sm:mb-3">
                        Termín:{" "}
                        <span className="font-semibold text-[#1F1A17]">
                          {selectedDate.toLocaleDateString("cs-CZ", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[#6B5D54]">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E07B53] flex-shrink-0" />
                        <span className="capitalize truncate">{selectedCourse.dayOfWeek}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[#6B5D54]">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E07B53] flex-shrink-0" />
                        <span>{selectedCourse.timeStart}–{selectedCourse.timeEnd}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[#6B5D54]">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E07B53] flex-shrink-0" />
                        <span>Max {selectedCourse.maxStudents}</span>
                      </div>
                      <div className="font-bold text-[#E07B53]">
                        {formatPrice(selectedCourse.priceCzk)}
                      </div>
                    </div>

                    <button
                      onClick={() => setStep("calendar")}
                      className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#E07B53] hover:underline active:opacity-70"
                    >
                      ← Změnit kurz
                    </button>
                  </div>

                  {/* Reservation Form */}
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#1F1A17] mb-1.5 sm:mb-2">
                        Jméno a příjmení *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6B5D54]" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base ${
                            errors.name
                              ? "border-red-400 focus:border-red-500"
                              : "border-[#EBE6DF] focus:border-[#E07B53]"
                          } focus:outline-none transition-colors bg-white`}
                          placeholder="Jan Novák"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#1F1A17] mb-1.5 sm:mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6B5D54]" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base ${
                            errors.email
                              ? "border-red-400 focus:border-red-500"
                              : "border-[#EBE6DF] focus:border-[#E07B53]"
                          } focus:outline-none transition-colors bg-white`}
                          placeholder="jan@email.cz"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#1F1A17] mb-1.5 sm:mb-2">
                        Telefon *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6B5D54]" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base ${
                            errors.phone
                              ? "border-red-400 focus:border-red-500"
                              : "border-[#EBE6DF] focus:border-[#E07B53]"
                          } focus:outline-none transition-colors bg-white`}
                          placeholder="+420 123 456 789"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#1F1A17] mb-1.5 sm:mb-2">
                        Zpráva (volitelné)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-[#6B5D54]" />
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          rows={2}
                          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-[#EBE6DF] focus:border-[#E07B53] focus:outline-none transition-colors bg-white resize-none text-sm sm:text-base"
                          placeholder="Máte nějaké dotazy?"
                        />
                      </div>
                    </div>

                    {/* GDPR */}
                    <div>
                      <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.gdprConsent}
                          onChange={(e) => handleInputChange("gdprConsent", e.target.checked)}
                          className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-[#EBE6DF] text-[#E07B53] focus:ring-[#E07B53] flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-[#6B5D54]">
                          Souhlasím se zpracováním osobních údajů. *
                        </span>
                      </label>
                      {errors.gdprConsent && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.gdprConsent}</p>
                      )}
                    </div>

                    {/* Error */}
                    {submitError && (
                      <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-600 text-xs sm:text-sm">
                        {submitError}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#E07B53] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg hover:bg-[#C4613D] active:bg-[#B35636] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E07B53]/30 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          Odesílám...
                        </>
                      ) : (
                        "Odeslat rezervaci"
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Step: Success */}
              {step === "success" && selectedCourse && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto text-center py-4 sm:py-8"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1F1A17] mb-2 sm:mb-3">
                    Děkujeme!
                  </h3>
                  <p className="text-sm sm:text-base text-[#6B5D54] mb-4 sm:mb-6">
                    Vaši rezervaci jsme obdrželi. Brzy vás budeme kontaktovat.
                  </p>

                  <div className="bg-[#FBF9F6] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left mb-6 sm:mb-8">
                    <p className="text-xs sm:text-sm text-[#6B5D54] mb-1.5 sm:mb-2">Vybraný kurz:</p>
                    <p className="font-bold text-sm sm:text-base text-[#1F1A17] capitalize">{selectedCourse.level}</p>
                    <p className="text-xs sm:text-sm text-[#6B5D54]">
                      {selectedCourse.dayOfWeek} • {selectedCourse.timeStart}–{selectedCourse.timeEnd}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#E07B53] mt-1">
                      {formatPrice(selectedCourse.priceCzk)}
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#E07B53] text-white rounded-full font-semibold text-sm sm:text-base hover:bg-[#C4613D] active:bg-[#B35636] transition-colors"
                  >
                    Zavřít
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
