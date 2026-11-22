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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { FormErrors, Workspace } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import { useWorkspaceStore } from "@/store/store"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface UpdateWorkspaceProps {
  workspace: Workspace
  open: boolean
  setOpen: (state: boolean) => void
}

const UpdateWorkspace = ({
  workspace,
  open,
  setOpen,
}: UpdateWorkspaceProps) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>(workspace.name)
  const [description, setDescription] = useState<string>(workspace.description)
  const [errors, setErrors] = useState<FormErrors>({})

  const { workspaces, update } = useWorkspaceStore()

  const updateWorkspace = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setLoading(true)
      const response = await workspaceService.updateWorkspace(workspace.id, {
        name,
        description,
      })
      if (response.ok) {
        const workspace = await response.json()
        toast.add({
          type: "success",
          description: "Workspace updated successfully",
        })
        update([workspace, ...workspaces.filter((w) => w.id !== workspace.id)])
        setOpen(false)
      } else {
        const data = await response.json()
        if (data?.errors) setErrors(data.errors)
        else {
          toast.add({
            type: "error",
            description: data?.message || "Unable to create",
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
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={updateWorkspace}>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Update a workspace here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="-mx-1 max-h-[60svh] overflow-y-auto px-1 py-1">
            <FieldGroup className="grid gap-x-4 gap-y-5">
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Workspace name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <FieldError>{errors.name}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!errors.description}
                ></Textarea>
                {errors.description && (
                  <FieldError>{errors.description}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button disabled={loading} type="submit">
              {loading && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateWorkspace
