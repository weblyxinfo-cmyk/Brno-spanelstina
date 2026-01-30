"use client";

import { useEffect, useState } from "react";
import { Trash2, Calendar, User, Mail, Phone, Clock, CreditCard } from "lucide-react";
import {
  getBookingsAdmin,
  getLessonsAdmin,
  getAllTimeSlots,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
} from "@/app/actions/admin-booking";

interface Booking {
  id: number;
  timeSlotId: number | null;
  lessonId: number | null;
  studentName: string;
  studentEmail: string;
  studentPhone: string | null;
  status: string;
  stripeSessionId: string | null;
  pricePaid: number | null;
  notes: string | null;
  createdAt: string | null;
}

interface Lesson {
  id: number;
  name: string;
}

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  paidBookings: number;
  cancelledBookings: number;
  activeLessons: number;
  availableSlots: number;
  totalRevenue: number;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Čekající", color: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Potvrzeno", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Zrušeno", color: "bg-red-100 text-red-700" },
};

export default function AdminRezervacePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  async function loadData() {
    setLoading(true);
    const [bookingsData, lessonsData, slotsData, statsData] = await Promise.all([
      getBookingsAdmin(statusFilter),
      getLessonsAdmin(),
      getAllTimeSlots(),
      getBookingStats(),
    ]);
    setBookings(bookingsData);
    setLessons(lessonsData);
    setTimeSlots(slotsData);
    setStats(statsData);
    setLoading(false);
  }

  async function handleStatusChange(id: number, status: string) {
    const result = await updateBookingStatus(id, status);
    if (result.success) {
      loadData();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Opravdu chcete smazat tuto rezervaci?")) {
      const result = await deleteBooking(id);
      if (result.success) {
        loadData();
      } else {
        alert(result.error);
      }
    }
  }

  function getLessonName(lessonId: number | null): string {
    if (!lessonId) return "-";
    return lessons.find((l) => l.id === lessonId)?.name || "-";
  }

  function getTimeSlotInfo(slotId: number | null): TimeSlot | null {
    if (!slotId) return null;
    return timeSlots.find((s) => s.id === slotId) || null;
  }

  function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString("cs-CZ", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatPrice(priceCzk: number): string {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
    }).format(priceCzk);
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
        <h1 className="text-3xl font-bold text-[#1F1A17]">Rezervace</h1>
        <p className="text-[#6B5D54]">Přehled všech rezervací</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#E07B53]" />
              </div>
              <span className="text-sm text-[#6B5D54]">Celkem</span>
            </div>
            <p className="text-3xl font-bold text-[#1F1A17]">{stats.totalBookings}</p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-[#6B5D54]">Čekající</span>
            </div>
            <p className="text-3xl font-bold text-[#1F1A17]">{stats.pendingBookings}</p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-[#6B5D54]">Potvrzeno</span>
            </div>
            <p className="text-3xl font-bold text-[#1F1A17]">{stats.paidBookings}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {["all", "pending", "confirmed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              statusFilter === status
                ? "bg-[#E07B53] text-white"
                : "bg-white text-[#6B5D54] hover:bg-[#FFE5E5]"
            }`}
          >
            {status === "all"
              ? "Všechny"
              : statusLabels[status]?.label || status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBF9F6] border-b border-[#EBE6DF]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Student
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Lekce
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Termín
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Cena
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Stav
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[#6B5D54]">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DF]">
              {bookings.map((booking) => {
                const slot = getTimeSlotInfo(booking.timeSlotId);
                const statusInfo = statusLabels[booking.status] || {
                  label: booking.status,
                  color: "bg-gray-100 text-gray-700",
                };

                return (
                  <tr key={booking.id} className="hover:bg-[#FBF9F6] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-[#E07B53]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1F1A17]">
                            {booking.studentName}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-[#6B5D54]">
                            <Mail className="w-3 h-3" />
                            {booking.studentEmail}
                          </div>
                          {booking.studentPhone && (
                            <div className="flex items-center gap-1 text-sm text-[#6B5D54]">
                              <Phone className="w-3 h-3" />
                              {booking.studentPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#1F1A17]">
                        {getLessonName(booking.lessonId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {slot ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#6B5D54]" />
                          <span className="text-[#1F1A17]">
                            {formatDateTime(slot.startTime)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#6B5D54]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {booking.pricePaid ? (
                        <span className="font-semibold text-[#1F1A17]">
                          {formatPrice(booking.pricePaid)}
                        </span>
                      ) : (
                        <span className="text-[#6B5D54]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${statusInfo.color}`}
                      >
                        <option value="pending">Čekající</option>
                        <option value="confirmed">Potvrzeno</option>
                        <option value="cancelled">Zrušeno</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-[#6B5D54] group-hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6B5D54]">
                    Zatím žádné rezervace.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
