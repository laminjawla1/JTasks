"use client"

import { useEffect, useState } from "react"
import { Plus, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { Workspace } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import CreateRole from "./CreateRole"

export type Role = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

const formatDate = (value: string) => new Date(value).toLocaleDateString()

const Roles = ({ workspace }: { workspace: Workspace | null }) => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const fetchRoles = async () => {
    if (!workspace) return
    try {
      setLoading(true)
      const response = await workspaceService.getRoles(workspace.id)
      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      }
    } catch (error) {
      toast.add({
        type: "error",
        description: "Unable to fetch roles",
      })
    } finally {
      setLoading(false)
    }
  }

  // Re-run when the workspace arrives (it is null on the first render)
  useEffect(() => {
    fetchRoles()
  }, [workspace?.id])

  if (!workspace) return

  return (
    <>
      {createOpen && (
        <CreateRole
          workspaceId={workspace.id}
          open={createOpen}
          setOpen={setCreateOpen}
          onCreated={fetchRoles}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Roles &amp; permissions</CardTitle>
          <CardDescription>
            Create roles and choose what each one is allowed to do.
          </CardDescription>
          <CardAction>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus />
              Create role
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="pl-4">Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="pr-4">Last updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && roles.length === 0 ? (
                  [0, 1, 2].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={3} className="px-4 py-3">
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No roles yet. Create one to start assigning permissions.
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                            <ShieldCheck className="size-4" />
                          </span>
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(role.createdAt)}
                      </TableCell>
                      <TableCell className="pr-4 text-muted-foreground">
                        {formatDate(role.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default Roles
