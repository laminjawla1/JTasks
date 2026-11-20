"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { User } from "lucide-react"
import {
  useMembershipStore,
  useProjectsStore,
  userAuthStore,
} from "@/store/store"
import { useContextStore } from "@/store/contextStore"
import { useActiveWorkspaceId } from "@/hooks/useActiveWorkspaceId"
import { UUID } from "crypto"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { projectsService } from "@/services/projects"
import { workspaceService } from "@/services/workspaces"

type Project = { id: number | string; name: string }

const Navbar = () => {
  const user = userAuthStore((s) => s.user)
  const memberships = useMembershipStore((s) => s.memberships)
  const workspaceId = useActiveWorkspaceId()
  const setWorkspace = useContextStore((s) => s.setWorkspace)
  const setProject = useContextStore((s) => s.setProject)
  const storedProjectId = useContextStore((s) =>
    workspaceId ? s.projectByWorkspace[workspaceId] : undefined
  )
  const { projects, update } = useProjectsStore()
  const [loading, setLoading] = useState(false)

  const workspaces = memberships?.map((m) => m.workspace) ?? []
  const firstWorkspaceId = workspaces[0] ? workspaces[0].id : null

  // Default to the first workspace when nothing valid is selected
  useEffect(() => {
    if (!workspaceId && firstWorkspaceId) setWorkspace(firstWorkspaceId)
  }, [workspaceId, firstWorkspaceId, setWorkspace])

  const projectExists = !!projects?.some(
    (p) => String(p.id) === storedProjectId
  )
  const projectId = projectExists ? storedProjectId! : null

  // Fetch projects whenever the active workspace changes
  useEffect(() => {
    if (!workspaceId) return

    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        if (projects && projects.length > 0) return
        const response = await workspaceService.getProjects(workspaceId)
        console.log(response)
        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.statusText}`)
        }
        const data = await response.json()
        if (!cancelled) {
          console.log(data)
          console.log(`Peojects fetched: ${data}`)
          update(data)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [workspaceId])

  // Forget a remembered project that no longer exists (deleted, access removed)
  useEffect(() => {
    if (workspaceId && projects && storedProjectId && !projectExists) {
      setProject(workspaceId, null)
    }
  }, [workspaceId, projects, storedProjectId, projectExists, setProject])

  // Base UI's Select needs value -> label pairs to show the selected name
  const workspaceItems = workspaces.map((w) => ({
    value: String(w.id),
    label: w.name,
  }))
  const projectItems =
    projects?.map((p) => ({ value: String(p.id), label: p.name })) ?? []

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-1 h-5" />

        <Select
          items={workspaceItems}
          value={workspaceId ? String(workspaceId) : null}
          onValueChange={(value) => value && setWorkspace(value as UUID)}
        >
          <SelectTrigger aria-label="Workspace" className="min-w-40">
            <SelectValue placeholder="Select a workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaceItems.map((w) => (
              <SelectItem key={w.value} value={w.value}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {workspaceId && (
          <>
            <span aria-hidden className="text-muted-foreground">
              /
            </span>
            {projects && projects.length === 0 ? (
              <Button
                variant="link"
                nativeButton={false}
                render={
                  <Link
                    href={`/projects?create=true&workspace=${workspaceId}`}
                  />
                }
              >
                + Create a project
              </Button>
            ) : (
              <Select
                items={projectItems}
                value={projectId}
                disabled={loading}
                onValueChange={(value) =>
                  value && setProject(workspaceId, value as UUID)
                }
              >
                <SelectTrigger aria-label="Project" className="min-w-40">
                  <SelectValue
                    placeholder={
                      loading ? "Loading projects..." : "Select a project"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {projectItems.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground">
          <User className="size-4" />
        </span>
        <div className="text-sm">
          {user ? `${user.firstName} ${user.lastName}` : "\u00A0"}
        </div>
      </div>
    </header>
  )
}

export default Navbar
