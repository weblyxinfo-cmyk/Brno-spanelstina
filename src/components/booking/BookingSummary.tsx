"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, Mail, Phone, CheckCircle, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

interface Lesson {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCzk: number;
  maxStudents: number | null;
  category: string;
}

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

interface BookingData {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  notes: string;
}

interface BookingSummaryProps {
  lesson: Lesson;
  timeSlot: TimeSlot;
  bookingData: BookingData;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

function formatPrice(priceCzk: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
  }).format(priceCzk);
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookingSummary({
  lesson,
  timeSlot,
  bookingData,
  onConfirm,
  onBack,
  isLoading,
}: BookingSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg mx-auto"
    >
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-[#1F1A17] mb-6 text-center">
          Souhrn rezervace
        </h3>

        {/* Lesson Info */}
        <div className="bg-[#FBF9F6] rounded-xl p-4 mb-6">
          <h4 className="font-bold text-[#1F1A17] text-lg mb-2">{lesson.name}</h4>
          {lesson.description && (
            <p className="text-sm text-[#6B5D54]">{lesson.description}</p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#E07B53]" />
            </div>
            <div>
              <p className="text-xs text-[#6B5D54]">Datum</p>
              <p className="font-semibold text-[#1F1A17] capitalize">
                {formatDate(timeSlot.startTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#E07B53]" />
            </div>
            <div>
              <p className="text-xs text-[#6B5D54]">Čas</p>
              <p className="font-semibold text-[#1F1A17]">
                {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#E07B53]" />
            </div>
            <div>
              <p className="text-xs text-[#6B5D54]">Místo</p>
              <p className="font-semibold text-[#1F1A17]">
                {SITE_CONFIG.contact.address}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-[#EBE6DF] pt-6 mb-6 space-y-3">
          <h4 className="text-sm font-semibold text-[#6B5D54] uppercase tracking-wider mb-3">
            Kontaktní údaje
          </h4>

          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-[#6B5D54]" />
            <span className="text-[#1F1A17]">{bookingData.studentName}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#6B5D54]" />
            <span className="text-[#1F1A17]">{bookingData.studentEmail}</span>
          </div>

          {bookingData.studentPhone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#6B5D54]" />
              <span className="text-[#1F1A17]">{bookingData.studentPhone}</span>
            </div>
          )}
        </div>

        {/* Confirmation Info */}
        <div className="bg-[#d4edda] rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800 mb-1">
                Potvrzení na email
              </p>
              <p className="text-sm text-green-700">
                Po odeslání obdržíte potvrzení rezervace na váš email.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 py-4 rounded-xl font-semibold text-[#6B5D54] hover:bg-[#FBF9F6] transition-colors disabled:opacity-50"
          >
            Zpět
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-[#E07B53] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#C4613D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E07B53]/30"
          >
            {isLoading ? "Odesílám..." : "Potvrdit rezervaci"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
