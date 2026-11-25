"use client"

import { useEffect, useState } from "react"
import { Loader2, TriangleAlert } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { FormErrors, Workspace, WorkspaceMember } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import { UUID } from "crypto"
import { workspaceMemberService } from "@/services/workspaceMembers"

interface TransferOwnershipProps {
  workspace: Workspace
  open: boolean
  setOpen: (state: boolean) => void
  onTransferred: () => void
}

const TransferOwnership = ({
  workspace,
  open,
  setOpen,
  onTransferred,
}: TransferOwnershipProps) => {
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [loading, setLoading] = useState(false)
  const [memberId, setMemberId] = useState<UUID>()
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true)
        const response = await workspaceMemberService.getAll(workspace.id)
        if (response.ok) setMembers(await response.json())
      } catch (error) {
        toast.add({ type: "error", description: "Unable to fetch members" })
      } finally {
        setLoadingMembers(false)
      }
    }
    fetchMembers()
  }, [workspace.id])

  const items = members.map((m) => ({
    value: String(m.id),
    label: `${m.user.firstName} ${m.user.lastName} (${m.user.email})`,
  }))

  // ASSUMPTION: adapt to your real transfer-ownership endpoint and payload
  const transfer = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!memberId) return
    try {
      setLoading(true)
      setErrors({})
      const response = await workspaceService.transferOwnership(workspace.id, {
        memberId,
      })
      if (response.ok) {
        toast.add({
          type: "success",
          description: "Ownership transferred successfully",
        })
        onTransferred()
        setOpen(false)
      } else {
        const data = await response.json().catch(() => null)
        if (data?.errors) setErrors(data.errors)
        else {
          toast.add({
            type: "error",
            description: data?.message || "Unable to transfer ownership",
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
        <form onSubmit={transfer} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Transfer ownership</DialogTitle>
            <DialogDescription>
              Choose the member who will become the new owner of{" "}
              <span className="font-medium text-foreground">
                {workspace.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>
              You will lose owner privileges. Only the new owner can undo this.
            </AlertDescription>
          </Alert>

          <FieldGroup>
            <Field data-invalid={!!errors.memberId}>
              <FieldLabel htmlFor="memberId">New owner</FieldLabel>
              <Select
                items={items}
                value={memberId}
                onValueChange={(value) => value && setMemberId(value)}
                disabled={loading || loadingMembers}
              >
                <SelectTrigger
                  id="memberId"
                  aria-invalid={!!errors.memberId}
                  className="w-full"
                >
                  <SelectValue
                    placeholder={
                      loadingMembers ? "Loading members..." : "Select a member"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {items.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.memberId && <FieldError>{errors.memberId}</FieldError>}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || !memberId}
            >
              {loading && <Loader2 className="animate-spin" />}
              Transfer ownership
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TransferOwnership
