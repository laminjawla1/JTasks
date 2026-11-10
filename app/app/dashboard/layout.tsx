"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = Cookies.get("auth_token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          </div>
          <p className="text-gray-600 font-medium"> Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-2 md:my-40">
      <Navbar />
      <main>{children}</main>
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center justify-center">
          <span className="text-[11px] font-medium tracking-wide text-slate-400">
            Powered by{" "}
            <span className="font-semibold text-slate-500">
              JGroup Technologies
            </span>{" "}
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
