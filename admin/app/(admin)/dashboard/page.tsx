"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { UUID } from "crypto"

import { useActiveWorkspaceStore, useWorkspaceStore } from "@/store/store"
import { useContextStore } from "@/store/contextStore"
import { dashboardService } from "@/services/dashboard"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type ProjectSummary = {
  id: UUID
  name: string
  description?: string | null
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  memberCount: number
  boards: { id: UUID; name: string; taskCount: number }[]
}

function Stat({
  label,
  value,
  danger = false,
}: {
  label: string
  value: number
  danger?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle
          className={cn(
            "text-3xl font-semibold tracking-tight",
            danger && "text-destructive"
          )}
        >
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

function EmptyState({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <Card className="mx-auto mt-16 max-w-md border border-dashed text-center ring-0">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}

const Dashboard = () => {
  const { workspaces } = useWorkspaceStore()
  const { activeWorkspace } = useActiveWorkspaceStore()
  const projectId = useContextStore((s) =>
    activeWorkspace ? s.projectByWorkspace[activeWorkspace.id] : undefined
  )
  const [summary, setSummary] = useState<ProjectSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refetch whenever the selected project changes
  useEffect(() => {
    if (!projectId) return

    let cancelled = false
    setLoading(true)
    setError(null)
    setSummary(null)

    ;(async () => {
      try {
        const response = await dashboardService.getProjectSummary(projectId)
        if (!response.ok) {
          throw new Error(`Error fetching summary: ${response.statusText}`)
        }
        const data = await response.json()
        if (!cancelled) setSummary(data)
      } catch (err) {
        console.error("Error fetching dashboard summary:", err)
        if (!cancelled) setError("Failed to load project summary.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [projectId])

  if (!workspaces || workspaces.length === 0) {
    return (
      <EmptyState
        title="No workspace yet"
        description="Create your first workspace, or ask a teammate to invite you."
      >
        <Button
          nativeButton={false}
          render={<Link href="/workspaces?create=true" />}
        >
          Create a workspace
        </Button>
      </EmptyState>
    )
  }

  if (!projectId) {
    return (
      <EmptyState
        title="Select a project"
        description="Choose a project from the menu at the top to see its summary."
      />
    )
  }

  // Also covers the first render, before the effect has started the fetch
  if (loading || (!summary && !error)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Could not load this project{error ? `: ${error}` : "."}
        </AlertDescription>
      </Alert>
    )
  }

  const percent = summary.totalTasks
    ? Math.round((summary.completedTasks / summary.totalTasks) * 100)
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {summary.name}
        </h1>
        {summary.description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {summary.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total tasks" value={summary.totalTasks} />
        <Stat label="Completed" value={summary.completedTasks} />
        <Stat
          label="Overdue"
          value={summary.overdueTasks}
          danger={summary.overdueTasks > 0}
        />
        <Stat label="Members" value={summary.memberCount} />
      </div>

      <Card>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">{percent}%</span>
          </div>
          <Progress value={percent} aria-label="Project progress" />
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg font-semibold">Boards</h2>
        {summary.boards.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No boards yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summary.boards.map((board) => (
              <Link
                key={board.id}
                href={`/projects/${summary.id}/boards/${board.id}`}
                className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Card className="h-full transition hover:shadow-lg hover:shadow-primary/5 hover:ring-primary/40">
                  <CardHeader>
                    <CardTitle>{board.name}</CardTitle>
                    <CardDescription>
                      {board.taskCount}{" "}
                      {board.taskCount === 1 ? "task" : "tasks"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
