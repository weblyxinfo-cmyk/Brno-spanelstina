import { getDashboardStats, getMessages } from "@/app/actions/admin";
import Link from "next/link";
import { BookOpen, Users, Star, Mail, ArrowRight, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, messages] = await Promise.all([
    getDashboardStats(),
    getMessages(),
  ]);

  const recentMessages = messages.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F1A17]">Dashboard</h1>
        <p className="text-[#6B5D54]">Přehled obsahu a aktivit</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Link
          href="/admin/kurzy"
          className="bg-white rounded-xl p-5 hover:shadow-md transition-all border border-[#EBE6DF] hover:border-[#E07B53] group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B5D54] mb-1">Kurzů</p>
              <p className="text-2xl font-bold text-[#1F1A17]">{stats.courses}</p>
            </div>
            <BookOpen className="w-5 h-5 text-[#6B5D54] group-hover:text-[#E07B53] transition-colors" />
          </div>
        </Link>

        <Link
          href="/admin/lektori"
          className="bg-white rounded-xl p-5 hover:shadow-md transition-all border border-[#EBE6DF] hover:border-[#E07B53] group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B5D54] mb-1">Lektorů</p>
              <p className="text-2xl font-bold text-[#1F1A17]">{stats.lektori}</p>
            </div>
            <Users className="w-5 h-5 text-[#6B5D54] group-hover:text-[#E07B53] transition-colors" />
          </div>
        </Link>

        <Link
          href="/admin/reference"
          className="bg-white rounded-xl p-5 hover:shadow-md transition-all border border-[#EBE6DF] hover:border-[#E07B53] group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B5D54] mb-1">Referencí</p>
              <p className="text-2xl font-bold text-[#1F1A17]">{stats.testimonials}</p>
            </div>
            <Star className="w-5 h-5 text-[#6B5D54] group-hover:text-[#E07B53] transition-colors" />
          </div>
        </Link>

        <Link
          href="/admin/zpravy"
          className="bg-white rounded-xl p-5 hover:shadow-md transition-all border border-[#EBE6DF] hover:border-[#E07B53] group relative"
        >
          {stats.unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#E07B53] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {stats.unreadMessages}
            </span>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B5D54] mb-1">Zpráv</p>
              <p className="text-2xl font-bold text-[#1F1A17]">{stats.messages}</p>
            </div>
            <Mail className="w-5 h-5 text-[#6B5D54] group-hover:text-[#E07B53] transition-colors" />
          </div>
        </Link>

        <div className="bg-white rounded-xl p-5 border border-[#EBE6DF]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B5D54] mb-1">Zobrazení</p>
              <p className="text-2xl font-bold text-[#1F1A17]">{stats.pageViews.toLocaleString("cs-CZ")}</p>
            </div>
            <Eye className="w-5 h-5 text-[#6B5D54]" />
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1F1A17]">Poslední zprávy</h2>
          <Link
            href="/admin/zpravy"
            className="text-[#E07B53] font-medium text-sm hover:underline flex items-center gap-1"
          >
            Zobrazit vše <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-[#6B5D54] text-center py-8">Zatím žádné zprávy</p>
        ) : (
          <div className="space-y-4">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border ${
                  msg.read
                    ? "border-[#EBE6DF] bg-[#FBF9F6]"
                    : "border-[#E07B53] bg-[#FFE5E5]/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#1F1A17]">{msg.name}</span>
                  <span className="text-xs text-[#6B5D54]">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleDateString("cs-CZ")
                      : ""}
                  </span>
                </div>
                <p className="text-sm text-[#6B5D54] truncate">{msg.message}</p>
                {msg.courseType && (
                  <span className="inline-block mt-2 text-xs bg-white px-2 py-1 rounded-full text-[#6B5D54]">
                    {msg.courseType}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
