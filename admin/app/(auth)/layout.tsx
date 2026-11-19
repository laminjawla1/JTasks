"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — `dark` makes shadcn tokens resolve to the dark theme */}
      <aside className="dark relative hidden overflow-hidden bg-background p-12 text-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-20 size-96 rounded-full bg-emerald-500/30 blur-3xl"
        />
        <Link
          href="/"
          className="relative flex items-center gap-2 font-semibold"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            J
          </span>
          JTasks
        </Link>

        <div className="relative">
          <h2 className="max-w-md text-4xl font-semibold tracking-tight">
            Plan work.{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Ship together.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Workspaces, projects, boards and tasks in one clean place, with the
            access controls your team needs.
          </p>
        </div>

        <p className="relative text-sm text-muted-foreground">
          © {year ?? 2026} JTasks
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 font-semibold lg:hidden"
          >
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              J
            </span>
            JTasks
          </Link>
          {children}
        </div>
      </main>
    </div>
  )
}
