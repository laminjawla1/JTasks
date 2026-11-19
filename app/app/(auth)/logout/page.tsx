"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/store";
import { useContextStore } from "@/store/contextStore";

export default function Logout() {
  const router = useRouter();
  const { logout } = userAuthStore();

  useEffect(() => {
    logout();
    router.replace("/login");
    router.refresh();
    useContextStore.getState().reset();
  }, [router]);

  return (
    <main className="flex min-h-svh items-center justify-center bg-white">
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-4"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
        <p className="text-sm font-medium text-slate-600">Logging you out...</p>
      </div>
    </main>
  );
}
