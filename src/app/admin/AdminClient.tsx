"use client";

import { useState } from "react";
import { Mail, Phone, Calendar, Check, Eye, User } from "lucide-react";
import { markMessageAsRead } from "@/app/actions/contact";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  courseType: string | null;
  message: string;
  createdAt: string | null;
  read: boolean | null;
}

interface AdminClientProps {
  messages: Message[];
}

export default function AdminClient({ messages: initialMessages }: AdminClientProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleMarkAsRead = async (id: number) => {
    const result = await markMessageAsRead(id);
    if (result.success) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
      );
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-[#FBF9F6] pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F1A17] mb-2">
            Admin Panel
          </h1>
          <p className="text-[#6B5D54]">
            Správa kontaktních zpráv ({unreadCount} nepřečtených)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="font-bold text-[#1F1A17] mb-4">
              Zprávy ({messages.length})
            </h2>
            {messages.length === 0 ? (
              <p className="text-[#6B5D54] text-center py-8">
                Zatím žádné zprávy
              </p>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${
                    selectedMessage?.id === msg.id
                      ? "bg-[#E07B53] text-white"
                      : msg.read
                      ? "bg-white hover:bg-[#EBE6DF]"
                      : "bg-white border-l-4 border-[#E07B53] hover:bg-[#EBE6DF]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" />
                    <span className="font-semibold truncate">{msg.name}</span>
                    {!msg.read && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedMessage?.id === msg.id
                            ? "bg-white"
                            : "bg-[#E07B53]"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`text-sm truncate ${
                      selectedMessage?.id === msg.id
                        ? "text-white/80"
                        : "text-[#6B5D54]"
                    }`}
                  >
                    {msg.message.slice(0, 50)}...
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      selectedMessage?.id === msg.id
                        ? "text-white/60"
                        : "text-[#6B5D54]/60"
                    }`}
                  >
                    {msg.courseType || "Obecný dotaz"}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1F1A17]">
                      {selectedMessage.name}
                    </h2>
                    {selectedMessage.courseType && (
                      <span className="inline-block mt-2 text-xs bg-[#FFE5E5] text-[#C4613D] px-3 py-1 rounded-full font-medium">
                        {selectedMessage.courseType}
                      </span>
                    )}
                  </div>
                  {!selectedMessage.read && (
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#C4613D] transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Označit jako přečtené
                    </button>
                  )}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-[#EBE6DF]">
                  <div className="flex items-center gap-3 text-[#6B5D54]">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="hover:text-[#E07B53] transition-colors"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-3 text-[#6B5D54]">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="hover:text-[#E07B53] transition-colors"
                      >
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-[#6B5D54]">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {selectedMessage.createdAt
                        ? new Date(selectedMessage.createdAt).toLocaleString(
                            "cs-CZ"
                          )
                        : "Neznámé datum"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1F1A17] mb-3">Zpráva</h3>
                  <p className="text-[#6B5D54] leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-8 flex gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Dotaz na kurzy španělštiny`}
                    className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#C4613D] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Odpovědět emailem
                  </a>
                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="inline-flex items-center gap-2 bg-white text-[#1F1A17] px-6 py-3 rounded-full font-semibold border-2 border-[#EBE6DF] hover:border-[#E07B53] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Zavolat
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center">
                <Eye className="w-12 h-12 text-[#EBE6DF] mx-auto mb-4" />
                <p className="text-[#6B5D54]">
                  Vyberte zprávu ze seznamu
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
