"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
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
import { FormErrors, Role } from "@/definitions"
import { authorizationService } from "@/services/authorization"
import { UUID } from "crypto"

type Privilege = { id: string; name: string }

const ACTION_ORDER = ["CREATE", "READ", "UPDATE", "DELETE"]

const titleCase = (s: string) =>
  s.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())

const resourceLabel = (resource: string) =>
  resource.split("_").map(titleCase).join(" · ")

const parsePrivilege = (name: string) => {
  const parts = name.split("_")
  const action = parts.pop() ?? ""
  return { resource: parts.join("_"), action }
}

interface UpdateRoleProps {
  workspaceId: UUID
  role: Role | null
  open: boolean
  setOpen: (state: boolean) => void
  onUpdated: () => void
}

const UpdateRole = ({
  workspaceId,
  role,
  open,
  setOpen,
  onUpdated,
}: UpdateRoleProps) => {
  const [loading, setLoading] = useState(false)
  const [loadingPrivileges, setLoadingPrivileges] = useState(false)
  const [name, setName] = useState(role?.name || "")
  const [privileges, setPrivileges] = useState<Privilege[]>([])
  const [selected, setSelected] = useState<Set<string>>(
    new Set(role?.privileges.map((p) => p.id))
  )
  const [errors, setErrors] = useState<FormErrors>({})

  const fetchPrivileges = async () => {
    try {
      setLoadingPrivileges(true)
      const response = await authorizationService.getPrivileges()
      if (response.ok) {
        const data = await response.json()
        setPrivileges(data)
      }
    } catch (error) {
      toast.add({
        type: "error",
        description: "Unable to fetch privileges",
      })
    } finally {
      setLoadingPrivileges(false)
    }
  }

  useEffect(() => {
    fetchPrivileges()
  }, [])

  // Group into rows (resource) x columns (action)
  const { rows, actions } = useMemo(() => {
    const byResource = new Map<string, Map<string, Privilege>>()
    const seenActions = new Set<string>()

    for (const p of privileges) {
      const { resource, action } = parsePrivilege(p.name)
      seenActions.add(action)
      if (!byResource.has(resource)) byResource.set(resource, new Map())
      byResource.get(resource)!.set(action, p)
    }

    const actions = [
      ...ACTION_ORDER.filter((a) => seenActions.has(a)),
      ...[...seenActions].filter((a) => !ACTION_ORDER.includes(a)).sort(),
    ]
    const rows = [...byResource.entries()].map(([resource, perms]) => ({
      resource,
      perms,
    }))
    return { rows, actions }
  }, [privileges])

  const toggle = (ids: string[], checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)))
      return next
    })
  }

  const allIds = privileges.map((p) => p.id)
  const allSelected = allIds.length > 0 && selected.size === allIds.length

  const updateRole = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!role) return
    try {
      setLoading(true)
      setErrors({})
      const response = await authorizationService.updateRole(
        workspaceId,
        role?.id,
        {
          name,
          privilegeIds: [...selected],
        }
      )
      if (response.ok) {
        toast.add({
          type: "success",
          description: "Role updated successfully",
        })
        onUpdated()
        setOpen(false)
      } else {
        const data = await response.json().catch(() => null)
        if (data?.errors) setErrors(data.errors)
        else {
          toast.add({
            type: "error",
            description: data?.message || "Unable to create role",
            priority: "high",
          })
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={updateRole} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Update role</DialogTitle>
            <DialogDescription>
              Rename the role and tick the permissions it should have.
            </DialogDescription>
          </DialogHeader>

          {/* Only the body scrolls, so the header and footer always stay visible */}
          <div className="-mx-1 max-h-[60svh] space-y-5 overflow-y-auto px-1 py-1">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Role name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Project manager"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Permissions</span>
                  <Badge variant="secondary">
                    {selected.size} / {allIds.length}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={loading || allIds.length === 0}
                  onClick={() => toggle(allIds, !allSelected)}
                >
                  {allSelected ? "Clear all" : "Select all"}
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="pl-4">Resource</TableHead>
                      <TableHead className="w-16 text-center">All</TableHead>
                      {actions.map((action) => (
                        <TableHead key={action} className="w-20 text-center">
                          {titleCase(action)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingPrivileges ? (
                      [0, 1, 2, 3].map((i) => (
                        <TableRow key={i}>
                          <TableCell
                            colSpan={actions.length + 2}
                            className="px-4 py-3"
                          >
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : rows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={actions.length + 2}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No permissions available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map(({ resource, perms }) => {
                        const rowIds = [...perms.values()].map((p) => p.id)
                        const count = rowIds.filter((id) =>
                          selected.has(id)
                        ).length
                        return (
                          <TableRow key={resource}>
                            <TableCell className="pl-4 font-medium">
                              {resourceLabel(resource)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                aria-label={`Select all ${resourceLabel(resource)} permissions`}
                                checked={count === rowIds.length}
                                indeterminate={
                                  count > 0 && count < rowIds.length
                                }
                                disabled={loading}
                                onCheckedChange={(checked) =>
                                  toggle(rowIds, !!checked)
                                }
                              />
                            </TableCell>
                            {actions.map((action) => {
                              const privilege = perms.get(action)
                              return (
                                <TableCell key={action} className="text-center">
                                  {privilege ? (
                                    <Checkbox
                                      aria-label={`${titleCase(action)} ${resourceLabel(resource)}`}
                                      checked={selected.has(privilege.id)}
                                      disabled={loading}
                                      onCheckedChange={(checked) =>
                                        toggle([privilege.id], !!checked)
                                      }
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">
                                      —
                                    </span>
                                  )}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              {errors.privilegeIds && (
                <p className="text-sm text-destructive">
                  {errors.privilegeIds}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button disabled={loading || !name.trim()} type="submit">
              {loading && <Loader2 className="animate-spin" />}
              Update role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateRole
