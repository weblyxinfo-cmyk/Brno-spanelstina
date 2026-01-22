"use client";

import { useActionState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, type AuthResult } from "@/app/actions/auth";
import { Lock, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [state, formAction, isPending] = useActionState<AuthResult | null, FormData>(
    login,
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.push(redirectTo);
      router.refresh();
    }
  }, [state?.success, router, redirectTo]);

  return (
    <div className="min-h-screen bg-[#EBE6DF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C41E3A] rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F1A17] font-['Outfit']">
            Admin Panel
          </h1>
          <p className="text-[#6B5D54] mt-2 font-['Outfit']">
            Spanelstina Brno
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1F1A17] mb-6 font-['Outfit']">
            Prihlaseni
          </h2>

          <form action={formAction} className="space-y-6">
            {/* Error Message */}
            {state?.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium font-['Outfit']">
                  {state.error}
                </span>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#6B5D54] mb-2 font-['Outfit']"
              >
                Heslo
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                required
                disabled={isPending}
                className="w-full px-4 py-3 bg-[#FBF9F6] border border-[#EBE6DF] rounded-xl text-[#1F1A17] placeholder-[#6B5D54]/50 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed font-['Outfit']"
                placeholder="Zadejte heslo"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-[#C41E3A] text-white font-semibold rounded-xl hover:bg-[#9E1830] focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Outfit']"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Prihlasuji...
                </>
              ) : (
                "Prihlasit se"
              )}
            </button>
          </form>

          {/* Back to website */}
          <div className="mt-6 pt-6 border-t border-[#EBE6DF] text-center">
            <a
              href="/"
              className="text-sm text-[#6B5D54] hover:text-[#C41E3A] transition-colors font-['Outfit']"
            >
              Zpet na web
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#6B5D54]/60 mt-8 font-['Outfit']">
          Spanelstina Brno CMS v1.0
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EBE6DF] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C41E3A]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
