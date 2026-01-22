"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B5D54] hover:bg-[#FBF9F6] hover:text-[#C41E3A] transition-colors group w-full text-left"
    >
      <LogOut className="w-5 h-5 group-hover:text-[#C41E3A]" />
      <span className="font-medium">Odhlásit se</span>
    </button>
  );
}
