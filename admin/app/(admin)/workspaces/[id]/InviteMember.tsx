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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { FormErrors } from "@/definitions"
import { workspaceMemberService } from "@/services/workspaceMembers"
import { workspaceService } from "@/services/workspaces"
import { UUID } from "crypto"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export type RoleOption = { id: string; name: string }

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
  const [roleId, setRoleId] = useState<UUID>()
  const [errors, setErrors] = useState<FormErrors>({})

  const roleItems = roles.map((r) => ({ value: String(r.id), label: r.name }))

  const invite = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!roleId) {
      toast.add({
        type: "error",
        description: "Role is required",
      })
      return
    }

    try {
      setLoading(true)
      setErrors({})
      const response = await workspaceMemberService.inviteMember(workspaceId, {
        email,
        roleId,
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
              role they should have.
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

            <Field data-invalid={!!errors.roleId}>
              <FieldLabel htmlFor="roleId">Role</FieldLabel>
              <Select
                items={roleItems}
                value={roleId}
                onValueChange={(value) => value && setRoleId(value)}
                disabled={loading}
                required
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
              Send invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default InviteMember
