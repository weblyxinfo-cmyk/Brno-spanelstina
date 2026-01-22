"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, Phone, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { getMessages, markAsRead, deleteMessage } from "@/app/actions/admin";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  courseType: string | null;
  message: string;
  read: boolean | null;
  createdAt: string | null;
}

export default function AdminZpravyPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  }

  async function handleMarkAsRead(id: number) {
    const result = await markAsRead(id);
    if (result.success) {
      loadMessages();
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Opravdu chcete smazat tuto zprávu?")) {
      const result = await deleteMessage(id);
      if (result.success) {
        loadMessages();
      } else {
        alert(result.error);
      }
    }
  }

  function toggleExpand(id: number) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // Mark as read when expanding
      const msg = messages.find((m) => m.id === id);
      if (msg && !msg.read) {
        handleMarkAsRead(id);
      }
    }
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.read;
    if (filter === "read") return msg.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C41E3A]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1F1A17]">Zprávy</h1>
          <p className="text-[#6B5D54]">
            {unreadCount > 0
              ? `${unreadCount} nepřečtených zpráv`
              : "Všechny zprávy přečteny"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              filter === "all"
                ? "bg-[#C41E3A] text-white"
                : "bg-white text-[#6B5D54] hover:bg-[#FBF9F6]"
            }`}
          >
            Vše ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              filter === "unread"
                ? "bg-[#C41E3A] text-white"
                : "bg-white text-[#6B5D54] hover:bg-[#FBF9F6]"
            }`}
          >
            Nepřečtené ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              filter === "read"
                ? "bg-[#C41E3A] text-white"
                : "bg-white text-[#6B5D54] hover:bg-[#FBF9F6]"
            }`}
          >
            Přečtené ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-2xl overflow-hidden transition-shadow ${
              !msg.read ? "ring-2 ring-[#C41E3A]/30" : ""
            }`}
          >
            {/* Message Header */}
            <div
              className="p-6 cursor-pointer hover:bg-[#FBF9F6] transition-colors"
              onClick={() => toggleExpand(msg.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.read ? "bg-[#EBE6DF]" : "bg-[#FFE5E5]"
                  }`}
                >
                  {msg.read ? (
                    <MailOpen className="w-6 h-6 text-[#6B5D54]" />
                  ) : (
                    <Mail className="w-6 h-6 text-[#C41E3A]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-[#1F1A17]">{msg.name}</h3>
                    {!msg.read && (
                      <span className="w-2 h-2 bg-[#C41E3A] rounded-full"></span>
                    )}
                    {msg.courseType && (
                      <span className="text-xs bg-[#FBF9F6] text-[#6B5D54] px-2 py-1 rounded-full">
                        {msg.courseType}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#6B5D54] truncate">{msg.message}</p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  {msg.createdAt && (
                    <span className="text-xs text-[#6B5D54] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleDateString("cs-CZ")}
                    </span>
                  )}
                  {expandedId === msg.id ? (
                    <ChevronUp className="w-5 h-5 text-[#6B5D54]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#6B5D54]" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === msg.id && (
              <div className="px-6 pb-6 border-t border-[#EBE6DF]">
                <div className="pt-6 space-y-4">
                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={`mailto:${msg.email}`}
                      className="inline-flex items-center gap-2 text-sm text-[#C41E3A] hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      {msg.email}
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="inline-flex items-center gap-2 text-sm text-[#C41E3A] hover:underline"
                      >
                        <Phone className="w-4 h-4" />
                        {msg.phone}
                      </a>
                    )}
                  </div>

                  {/* Full Message */}
                  <div className="bg-[#FBF9F6] rounded-xl p-4">
                    <p className="text-[#1F1A17] whitespace-pre-wrap">{msg.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${msg.email}?subject=Re: Dotaz na kurzy španělštiny`}
                      className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#9E1830] transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Odpovědět
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="inline-flex items-center gap-2 bg-white text-[#1F1A17] px-5 py-2.5 rounded-xl font-semibold text-sm border-2 border-[#EBE6DF] hover:border-[#C41E3A] transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Zavolat
                      </a>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg.id);
                      }}
                      className="inline-flex items-center gap-2 bg-white text-red-500 px-5 py-2.5 rounded-xl font-semibold text-sm border-2 border-[#EBE6DF] hover:border-red-500 transition-colors ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Smazat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-[#6B5D54]">
            {filter === "unread"
              ? "Žádné nepřečtené zprávy"
              : filter === "read"
              ? "Žádné přečtené zprávy"
              : "Zatím žádné zprávy"}
          </div>
        )}
      </div>
    </div>
  );
}
