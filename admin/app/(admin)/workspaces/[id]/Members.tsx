"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Loader2,
  Lock,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import { Workspace, WorkspaceMember } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import ChangeMemberRole from "./ChangeMemberRole"
import InviteMember, { RoleOption } from "./InviteMember"
import { workspaceMemberService } from "@/services/workspaceMembers"

const fullName = (member: WorkspaceMember) =>
  `${member.user.firstName} ${member.user.lastName}`

const initials = (member: WorkspaceMember) =>
  `${member.user.firstName?.[0] ?? ""}${member.user.lastName?.[0] ?? ""}`.toUpperCase()

// Members holding a system role (e.g. the owner) can't be removed here
const hasSystemRole = (member: WorkspaceMember) =>
  !!member.roles?.some((r) => r.systemRole)

const Members = ({ workspace }: { workspace: Workspace | null }) => {
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const [inviteOpen, setInviteOpen] = useState(false)
  const [roleTarget, setRoleTarget] = useState<WorkspaceMember | null>(null)
  const [removeTarget, setRemoveTarget] = useState<WorkspaceMember | null>(null)
  const [removing, setRemoving] = useState(false)

  const fetchMembers = async () => {
    if (!workspace) return
    try {
      setLoading(true)
      const response = await workspaceMemberService.getAll(workspace.id)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      toast.add({
        type: "error",
        description: "Unable to fetch members",
      })
    } finally {
      setLoading(false)
    }
  }

  // ASSUMPTION: adapt to your real roles endpoint
  const fetchRoles = async () => {
    if (!workspace) return
    try {
      const response = await workspaceService.getRoles(workspace.id)
      if (response.ok) {
        const data = await response.json()
        setRoles(
          data.map((r: RoleOption) => ({
            id: r.id,
            name: r.name,
            systemRole: r.systemRole,
          }))
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Re-run when the workspace arrives (it is null on the first render)
  useEffect(() => {
    fetchMembers()
    fetchRoles()
  }, [workspace?.id])

  // ASSUMPTION: adapt to your real remove-member endpoint
  const removeMember = async () => {
    if (!workspace || !removeTarget) return
    try {
      setRemoving(true)
      const response = await workspaceMemberService.removeMember(
        workspace.id,
        removeTarget.id
      )
      if (response.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id))
        setRemoveTarget(null)
        toast.add({
          type: "success",
          description: "Member removed successfully",
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
      setRemoving(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return members
    return members.filter(
      (m) =>
        fullName(m).toLowerCase().includes(q) ||
        m.user.email?.toLowerCase().includes(q)
    )
  }, [members, search])

  if (!workspace) return

  return (
    <>
      {inviteOpen && (
        <InviteMember
          workspaceId={workspace.id}
          roles={roles}
          open={inviteOpen}
          setOpen={setInviteOpen}
          onInvited={fetchMembers}
        />
      )}

      {roleTarget && (
        <ChangeMemberRole
          workspaceId={workspace.id}
          member={roleTarget}
          roles={roles}
          open={!!roleTarget}
          setOpen={(open) => !open && setRoleTarget(null)}
          onUpdated={fetchMembers}
        />
      )}

      {removeTarget && (
        <Dialog
          open={!!removeTarget}
          onOpenChange={(open) => !open && setRemoveTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove member</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove{" "}
                <span className="font-medium text-foreground">
                  {fullName(removeTarget)}
                </span>{" "}
                from this workspace? They will lose access immediately.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button
                variant="destructive"
                disabled={removing}
                onClick={removeMember}
              >
                {removing && <Loader2 className="animate-spin" />}
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Invite people, change their roles or remove them from this
            workspace.
          </CardDescription>
          <CardAction>
            <Button onClick={() => setInviteOpen(true)}>
              <UserPlus />
              Invite member
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              aria-label="Search members"
              className="pl-8"
            />
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="pl-4">Member</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-12 pr-4">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && members.length === 0 ? (
                  [0, 1, 2].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5} className="px-4 py-3">
                        <Skeleton className="h-9 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {members.length === 0
                        ? "No members yet. Invite someone to get started."
                        : "No members match your search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{initials(member)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {fullName(member)}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.roles?.length ? (
                            member.roles.map((r) => (
                              <Badge key={r.id} variant="secondary">
                                {r.systemRole && <Lock />}
                                {r.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No role
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.status === "ACTIVE" ? "default" : "outline"
                          }
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Actions for ${fullName(member)}`}
                              />
                            }
                          >
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setRoleTarget(member)}
                            >
                              <ShieldCheck />
                              Change roles
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              disabled={hasSystemRole(member)}
                              onClick={() => setRemoveTarget(member)}
                            >
                              <Trash2 />
                              Remove from workspace
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

export default Members
