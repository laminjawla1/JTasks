"use client"

import { useEffect, useState } from "react"
import {
  Loader2,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react"

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { Role, Workspace } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import CreateRole from "./CreateRole"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authorizationService } from "@/services/authorization"

const formatDate = (value: string) => new Date(value).toLocaleDateString()

const Roles = ({ workspace }: { workspace: Workspace | null }) => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const [deleting, setDeleting] = useState(false)
  const [modifyRole, setModifyRole] = useState<Role | null>(null)
  const [deleteRole, setDeleteRole] = useState<Role | null>(null)

  const fetchRoles = async () => {
    if (!workspace) return
    try {
      setLoading(true)
      const response = await workspaceService.getRoles(workspace.id)
      if (response.ok) {
        const data = await response.json()
        console.log(data)
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

  // ASSUMPTION: adapt to your real remove-member endpoint
  const handleDeleteRole = async () => {
    if (!workspace || !deleteRole) return
    try {
      setDeleting(true)
      const response = await authorizationService.deleteRole(
        workspace.id,
        deleteRole.id
      )
      if (response.ok) {
        setRoles((prev) => prev.filter((m) => m.id !== deleteRole.id))
        setDeleteRole(null)
        toast.add({
          type: "success",
          description: "Role removed successfully",
        })
      } else {
        const data = await response.json().catch(() => null)
        toast.add({
          type: "error",
          description: data?.message || "Unable to remove member",
          priority: "high",
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setDeleting(false)
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

      {deleteRole && (
        <Dialog
          open={!!deleteRole}
          onOpenChange={(open) => !open && setDeleteRole(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete role</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {deleteRole.name}
                </span>{" "}
                role? This action is not reversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button
                variant="destructive"
                disabled={deleting}
                onClick={handleDeleteRole}
              >
                {deleting && <Loader2 className="animate-spin" />}
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                        {formatDate(role.createdAt.toString())}
                      </TableCell>
                      <TableCell className="t.toString()ext-muted-foreground pr-4">
                        {formatDate(role.updatedAt.toString())}
                      </TableCell>
                      {!role.systemRole && (
                        <TableCell className="pr-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label={`Actions for ${role.name}`}
                                />
                              }
                            >
                              <MoreHorizontal />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setModifyRole(role)}
                              >
                                <ShieldCheck />
                                Modify
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeleteRole(role)}
                              >
                                <Trash2 />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
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
