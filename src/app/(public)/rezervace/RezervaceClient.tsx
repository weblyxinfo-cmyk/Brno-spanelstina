"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import LessonSelector from "@/components/booking/LessonSelector";
import CalendarView from "@/components/booking/CalendarView";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import BookingForm from "@/components/booking/BookingForm";
import BookingSummary from "@/components/booking/BookingSummary";
import {
  getAvailableDates,
  getTimeSlotsForDate,
  createBooking,
} from "@/app/actions/booking";

interface Lesson {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCzk: number;
  maxStudents: number | null;
  category: string;
  active: boolean | null;
  sortOrder: number | null;
}

interface TimeSlot {
  id: number;
  lessonId: number | null;
  startTime: string;
  endTime: string;
  available: boolean | null;
}

interface BookingFormData {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  notes: string;
}

type Step = "lesson" | "date" | "time" | "form" | "summary";

const steps: { key: Step; label: string }[] = [
  { key: "lesson", label: "Lekce" },
  { key: "date", label: "Datum" },
  { key: "time", label: "Čas" },
  { key: "form", label: "Údaje" },
  { key: "summary", label: "Souhrn" },
];

interface RezervaceClientProps {
  initialLessons: Lesson[];
}

export default function RezervaceClient({ initialLessons }: RezervaceClientProps) {
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled");

  const [currentStep, setCurrentStep] = useState<Step>("lesson");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available dates when lesson is selected
  useEffect(() => {
    if (selectedLesson) {
      setIsLoading(true);
      getAvailableDates(selectedLesson.id)
        .then(setAvailableDates)
        .finally(() => setIsLoading(false));
    }
  }, [selectedLesson]);

  // Load time slots when date is selected
  useEffect(() => {
    if (selectedLesson && selectedDate) {
      setIsLoading(true);
      getTimeSlotsForDate(selectedLesson.id, selectedDate)
        .then(setTimeSlots)
        .finally(() => setIsLoading(false));
    }
  }, [selectedLesson, selectedDate]);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setCurrentStep("date");
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setCurrentStep("time");
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setCurrentStep("form");
  };

  const handleFormSubmit = (data: BookingFormData) => {
    setBookingData(data);
    setCurrentStep("summary");
  };

  const handleConfirm = async () => {
    if (!selectedLesson || !selectedTimeSlot || !bookingData) return;

    setIsLoading(true);
    setError(null);

    try {
      const bookingResult = await createBooking({
        lessonId: selectedLesson.id,
        timeSlotId: selectedTimeSlot.id,
        studentName: bookingData.studentName,
        studentEmail: bookingData.studentEmail,
        studentPhone: bookingData.studentPhone || undefined,
        notes: bookingData.notes || undefined,
      });

      if (!bookingResult.success || !bookingResult.bookingId) {
        setError(bookingResult.error || "Nepodařilo se vytvořit rezervaci.");
        setIsLoading(false);
        return;
      }

      // Přesměrování na potvrzení
      window.location.href = `/rezervace/potvrzeni?booking_id=${bookingResult.bookingId}`;
    } catch (err) {
      console.error("Booking error:", err);
      setError("Nastala neočekávaná chyba. Zkuste to prosím znovu.");
      setIsLoading(false);
    }
  };

  const goBack = () => {
    const stepOrder: Step[] = ["lesson", "date", "time", "form", "summary"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="bg-[#FBF9F6] min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-12 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FFE5E5] to-transparent opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white text-[#E07B53] px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm mb-6 uppercase tracking-wider">
              <span>📅</span> Online rezervace
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-[#1F1A17] leading-tight mb-6"
          >
            Zarezervujte si{" "}
            <span className="font-[family-name:var(--font-playfair)] italic font-medium text-[#E07B53]">
              lekci
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[#6B5D54]"
          >
            Vyberte typ lekce, termín a zaplaťte bezpečně online
          </motion.p>
        </div>
      </section>

      {/* Cancelled Warning */}
      {cancelled && (
        <div className="max-w-4xl mx-auto px-6 mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-amber-800">
              Platba byla zrušena. Můžete zkusit rezervaci znovu.
            </p>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <section className="px-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        isCompleted
                          ? "bg-[#E07B53] text-white"
                          : isActive
                          ? "bg-[#E07B53] text-white"
                          : "bg-[#EBE6DF] text-[#6B5D54]"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 hidden sm:block ${
                        isActive ? "text-[#E07B53] font-semibold" : "text-[#6B5D54]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 sm:w-20 h-1 mx-2 rounded ${
                        index < currentStepIndex ? "bg-[#E07B53]" : "bg-[#EBE6DF]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Back Button */}
      {currentStep !== "lesson" && (
        <section className="px-6 mb-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={goBack}
              disabled={isLoading}
              className="inline-flex items-center gap-2 text-[#6B5D54] hover:text-[#E07B53] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zpět
            </button>
          </div>
        </section>
      )}

      {/* Error Message */}
      {error && (
        <section className="px-6 mb-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === "lesson" && (
              <motion.div
                key="lesson"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-[#1F1A17] text-center mb-8">
                  Vyberte typ lekce
                </h2>
                <LessonSelector
                  lessons={initialLessons}
                  selectedId={selectedLesson?.id || null}
                  onSelect={handleLessonSelect}
                />
              </motion.div>
            )}

            {currentStep === "date" && (
              <motion.div
                key="date"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-[#1F1A17] text-center mb-8">
                  Vyberte datum
                </h2>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E07B53]" />
                  </div>
                ) : (
                  <CalendarView
                    availableDates={availableDates}
                    selectedDate={selectedDate}
                    onSelect={handleDateSelect}
                  />
                )}
              </motion.div>
            )}

            {currentStep === "time" && selectedDate && (
              <motion.div
                key="time"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-[#1F1A17] text-center mb-8">
                  Vyberte čas
                </h2>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E07B53]" />
                  </div>
                ) : (
                  <TimeSlotPicker
                    timeSlots={timeSlots}
                    selectedId={selectedTimeSlot?.id || null}
                    onSelect={handleTimeSlotSelect}
                    selectedDate={selectedDate}
                  />
                )}
              </motion.div>
            )}

            {currentStep === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-[#1F1A17] text-center mb-8">
                  Vyplňte kontaktní údaje
                </h2>
                <BookingForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </motion.div>
            )}

            {currentStep === "summary" &&
              selectedLesson &&
              selectedTimeSlot &&
              bookingData && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookingSummary
                    lesson={selectedLesson}
                    timeSlot={selectedTimeSlot}
                    bookingData={bookingData}
                    onConfirm={handleConfirm}
                    onBack={goBack}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
