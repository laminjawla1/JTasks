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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { FormErrors, WorkspaceMember } from "@/definitions"
import { workspaceMemberService } from "@/services/workspaceMembers"
import { UUID } from "crypto"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import RoleMultiSelect, { RoleOption } from "./RoleMultiSelect"

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
  const [roleIds, setRoleIds] = useState<string[]>(
    member.roles?.map((r) => String(r.id)) ?? []
  )
  const [errors, setErrors] = useState<FormErrors>({})

  // ASSUMPTION: adapt to your real update-roles endpoint. It should replace
  // the member's roles with exactly this list.
  const updateRoles = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setLoading(true)
      setErrors({})
      const response = await workspaceMemberService.updateMemberRole(
        workspaceId,
        member.id,
        { roleIds: roleIds as UUID[] }
      )
      if (response.ok) {
        toast.add({
          type: "success",
          description: "Roles updated successfully",
        })
        onUpdated()
        setOpen(false)
      } else {
        const data = await response.json().catch(() => null)
        if (data?.errors) setErrors(data.errors)
        else {
          toast.add({
            type: "error",
            description: data?.message || "Unable to update roles",
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
        <form onSubmit={updateRoles} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Change roles</DialogTitle>
            <DialogDescription>
              Choose the roles for{" "}
              <span className="font-medium text-foreground">
                {member.user.firstName} {member.user.lastName}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field data-invalid={!!(errors.roleIds || errors.roleId)}>
              <FieldLabel htmlFor="roleIds">Roles</FieldLabel>
              <RoleMultiSelect
                id="roleIds"
                roles={roles}
                value={roleIds}
                onChange={setRoleIds}
                disabled={loading}
                invalid={!!(errors.roleIds || errors.roleId)}
              />
              <FieldDescription>
                {roles.some(
                  (r) => r.systemRole && roleIds.includes(String(r.id))
                )
                  ? "System roles such as Owner are locked. They can't be removed or given to anyone else."
                  : "You can pick more than one role."}
              </FieldDescription>
              {(errors.roleIds || errors.roleId) && (
                <FieldError>{errors.roleIds || errors.roleId}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button disabled={loading || roleIds.length === 0} type="submit">
              {loading && <Loader2 className="animate-spin" />}
              Save roles
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeMemberRole
