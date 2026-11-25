"use client"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import Details from "@/app/(admin)/workspaces/[id]/Details"
import { Workspace } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import { UUID } from "crypto"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Members from "./Members"
import { ChevronLeft, Info, Logs, Settings, Shield, Users } from "lucide-react"
import Roles from "./Roles"
import { Settings as SettingsPage } from "./Settings"
import AuditLogs from "./AuditLogs"

export const TAB_LISTS = [
  { id: "details", icon: Info, label: "Details" },
  { id: "members", icon: Users, label: "Members" },
  { id: "roles", icon: Shield, label: "Roles & Permissions" },
  { id: "auditlogs", icon: Logs, label: "Audit Logs" },
  { id: "settings", icon: Settings, label: "Settings" },
]

const WorkspacePage = () => {
  const { id } = useParams()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchWorkspace = async () => {
    try {
      setLoading(true)
      const response = await workspaceService.get(id as UUID)
      if (response.ok) {
        const data = await response.json()
        setWorkspace(data)
      }
    } catch (error) {
      toast.add({
        type: "error",
        description: "Unable to load workspace",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkspace()
  }, [])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/workspaces"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Workspaces
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            {workspace ? (
              <>
                <h1 className="truncate text-2xl font-semibold tracking-tight">
                  {workspace.name}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  {workspace.description ||
                    "Manage details, members, roles and more."}
                </p>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-80 max-w-full" />
              </>
            )}
          </div>

          {workspace && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">
                {workspace.slug}
              </span>
              <Badge>{workspace.status}</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Tabs — a centered spinner stands in while the workspace loads */}
      {loading && !workspace ? (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-64 flex-col items-center justify-center gap-3 text-sm text-muted-foreground"
        >
          <Spinner className="size-6 text-primary" />
          Loading workspace...
        </div>
      ) : (
        <Tabs defaultValue="details" className="w-full gap-6">
          <div className="-mx-1 overflow-x-auto px-1">
            <TabsList variant="line" className="w-max min-w-full justify-start">
              {TAB_LISTS.map((tab) => (
                <TabsTrigger value={tab.id} key={tab.id}>
                  <tab.icon />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="details">
            <Details workspace={workspace} />
          </TabsContent>

          <TabsContent value="members">
            <Members workspace={workspace} />
          </TabsContent>

          <TabsContent value="roles">
            <Roles workspace={workspace} />
          </TabsContent>

          <TabsContent value="auditlogs">
            <AuditLogs workspace={workspace} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPage
              workspace={workspace}
              onUpdated={(workspace: Workspace) => setWorkspace(workspace)}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default WorkspacePage
