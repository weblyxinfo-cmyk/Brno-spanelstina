import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Star,
  CreditCard,
  Mail,
  Settings,
  FileText,
  Search,
  Calendar,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { LogoutButton } from "./components/LogoutButton";
import AdminContent from "@/components/admin/AdminContent";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Obsah stránek", href: "/admin/obsah", icon: FileText },
  { name: "SEO", href: "/admin/seo", icon: Search },
  { name: "Kurzy", href: "/admin/kurzy", icon: BookOpen },
  { name: "Lektoři", href: "/admin/lektori", icon: Users },
  { name: "Úrovně", href: "/admin/urovne", icon: BarChart3 },
  { name: "Reference", href: "/admin/reference", icon: Star },
  { name: "Ceník", href: "/admin/cenik", icon: CreditCard },
  { name: "Zprávy", href: "/admin/zpravy", icon: Mail },
  { name: "Nastavení", href: "/admin/nastaveni", icon: Settings },
  { name: "---", href: "#", icon: null }, // Separator
  { name: "Rezervace", href: "/admin/rezervace", icon: CalendarCheck },
  { name: "Lekce", href: "/admin/lekce", icon: Calendar },
  { name: "Termíny", href: "/admin/terminy", icon: Clock },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FBF9F6]">
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#1F1A17] z-50 flex items-center px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E07B53] rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">Admin Panel</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Zpět na web →
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-[#EBE6DF] overflow-y-auto z-40">
        <nav className="p-4 space-y-1">
          {navigation.map((item, index) => {
            if (item.name === "---") {
              return (
                <div key={`sep-${index}`} className="my-4 border-t border-[#EBE6DF]" />
              );
            }
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B5D54] hover:bg-[#FBF9F6] hover:text-[#E07B53] transition-colors group"
              >
                {Icon && <Icon className="w-5 h-5 group-hover:text-[#E07B53]" />}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#EBE6DF]">
          <div className="mb-3">
            <LogoutButton />
          </div>
          <div className="bg-[#FFE5E5] rounded-xl p-4">
            <p className="text-sm font-semibold text-[#C4613D] mb-1">
              Španělština Brno
            </p>
            <p className="text-xs text-[#C4613D]/70">CMS v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 pt-16 min-h-screen">
        <AdminContent>{children}</AdminContent>
      </main>
    </div>
  );
}
