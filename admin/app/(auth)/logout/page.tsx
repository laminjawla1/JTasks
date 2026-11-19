"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { userAuthStore } from "@/store/store"
import { useContextStore } from "@/store/contextStore"

export default function Logout() {
  const router = useRouter()
  const { logout } = userAuthStore()

  useEffect(() => {
    logout()
    router.replace("/login")
    router.refresh()
    useContextStore.getState().reset()
  }, [router])

  return (
    <main className="flex min-h-svh items-center justify-center bg-background">
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Logging you out...
        </p>
      </div>
    </main>
  )
}
