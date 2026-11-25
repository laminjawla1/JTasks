"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Sidebar from "@/components/layout/Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { userAuthStore } from "@/store/store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const token = userAuthStore((s) => s.token)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only decide after mount, once the persisted store has loaded
    if (mounted && !token) router.replace("/login")
  }, [mounted, token, router])

  // Avoid flashing protected UI while checking
  if (!mounted || !token) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2
          className="size-8 animate-spin text-primary"
          aria-label="Loading"
        />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar />
      {/* SidebarInset renders a <main>, so the page body is a plain div */}
      <SidebarInset className="min-w-0 bg-muted/40">
        <Navbar />
        <div className="flex-1 p-6">{children}</div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
