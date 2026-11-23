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
import { FormErrors } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import { useWorkspaceStore } from "@/store/store"
import { UUID } from "crypto"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export interface CreateWorkspace {
  name: string
  description: string
}

interface CreateWorkspaceProps {
  open: boolean
  setOpen: (state: boolean) => void
}

const CreateWorkspace = ({ open, setOpen }: CreateWorkspaceProps) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [errors, setErrors] = useState<FormErrors>({})

  const { workspaces, update } = useWorkspaceStore()

  const createWorkspace = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setLoading(true)
      const response = await workspaceService.createWorkspace({
        name,
        description,
      })
      if (response.ok) {
        const workspace = await response.json()
        toast.add({
          type: "success",
          description: "Workspace created successfully",
        })
        update([workspace, ...workspaces])
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
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={createWorkspace} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Create workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {/* Only the fields scroll, so the header and footer always stay visible */}
          <div className="-mx-1 max-h-[60svh] overflow-y-auto px-1 py-1">
            <FieldGroup className="gap-5">
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
                <FieldLabel htmlFor="description">
                  Description{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="What is this workspace for?"
                  className="min-h-24 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!errors.description}
                />
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
              Create workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspace
