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
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { FormErrors } from "@/definitions"
import { workspaceMemberService } from "@/services/workspaceMembers"
import { UUID } from "crypto"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import RoleMultiSelect, { RoleOption } from "./RoleMultiSelect"

export type { RoleOption }

interface InviteMemberProps {
  workspaceId: UUID
  roles: RoleOption[]
  open: boolean
  setOpen: (state: boolean) => void
  onInvited: () => void
}

const InviteMember = ({
  workspaceId,
  roles,
  open,
  setOpen,
  onInvited,
}: InviteMemberProps) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [roleIds, setRoleIds] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  const invite = async (event: React.FormEvent) => {
    event.preventDefault()

    if (roleIds.length === 0) {
      toast.add({
        type: "error",
        description: "Select at least one role",
      })
      return
    }

    try {
      setLoading(true)
      setErrors({})
      const response = await workspaceMemberService.inviteMember(workspaceId, {
        email,
        roleIds: roleIds as UUID[],
      })
      if (response.ok) {
        toast.add({
          type: "success",
          description: `Invitation sent to ${email}`,
        })
        onInvited()
        setOpen(false)
      } else {
        const data = await response.json().catch(() => null)
        if (data?.errors) setErrors(data.errors)
        else {
          toast.add({
            type: "error",
            description: data?.message || "Unable to send invitation",
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
        <form onSubmit={invite} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>
              Enter the email of the person you want to invite and choose the
              roles they should have.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-5">
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="off"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.email}
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

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
                You can pick more than one role.
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
              Send invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default InviteMember
