"use client"

import { Button } from "@/components/ui/button"
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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { FormErrors, WorkspaceMember } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import { UUID } from "crypto"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { RoleOption } from "./InviteMember"
import { workspaceMemberService } from "@/services/workspaceMembers"

interface ChangeMemberRoleProps {
  workspaceId: UUID
  member: WorkspaceMember
  roles: RoleOption[]
  open: boolean
  setOpen: (state: boolean) => void
  onUpdated: () => void
}

const ChangeMemberRole = ({
  workspaceId,
  member,
  roles,
  open,
  setOpen,
  onUpdated,
}: ChangeMemberRoleProps) => {
  const [loading, setLoading] = useState(false)
  const [roleId, setRoleId] = useState<UUID>(member.roles[0].id)
  const [errors, setErrors] = useState<FormErrors>({})

  const roleItems = roles.map((r) => ({ value: String(r.id), label: r.name }))

  // ASSUMPTION: adapt to your real change-role endpoint and payload
  const updateRole = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setLoading(true)
      setErrors({})
      const response = await workspaceMemberService.updateMemberRole(
        workspaceId,
        member.id,
        { roleId }
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
            description: data?.message || "Unable to update role",
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
      <DialogContent className="sm:max-w-md">
        <form onSubmit={updateRole} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>
              Choose a new role for{" "}
              <span className="font-medium text-foreground">
                {member.user.firstName} {member.user.lastName}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field data-invalid={!!errors.roleId}>
              <FieldLabel htmlFor="roleId">Role</FieldLabel>
              <Select
                items={roleItems}
                value={roleId}
                onValueChange={(value) => value && setRoleId(value)}
                disabled={loading}
              >
                <SelectTrigger
                  id="roleId"
                  aria-invalid={!!errors.roleId}
                  className="w-full"
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleItems.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && <FieldError>{errors.roleId}</FieldError>}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button disabled={loading || !roleId} type="submit">
              {loading && <Loader2 className="animate-spin" />}
              Save role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeMemberRole
