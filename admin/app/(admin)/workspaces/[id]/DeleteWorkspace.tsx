"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { Workspace } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import { useWorkspaceStore } from "@/store/store"

interface DeleteWorkspaceProps {
  workspace: Workspace
  open: boolean
  setOpen: (state: boolean) => void
}

const DeleteWorkspace = ({
  workspace,
  open,
  setOpen,
}: DeleteWorkspaceProps) => {
  const router = useRouter()
  const { workspaces, update } = useWorkspaceStore()
  const [loading, setLoading] = useState(false)
  const [confirmation, setConfirmation] = useState("")

  const confirmed = confirmation === workspace.name

  const destroy = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!confirmed) return
    try {
      setLoading(true)
      const response = await workspaceService.deleteWorkspace(workspace.id)
      if (response.ok) {
        update(workspaces.filter((w) => w.id !== workspace.id))
        toast.add({
          type: "success",
          description: "Workspace deleted successfully",
        })
        setOpen(false)
        router.push("/workspaces")
      } else {
        const data = await response.json().catch(() => null)
        toast.add({
          type: "error",
          description: data?.message || "Unable to delete workspace",
          priority: "high",
        })
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
        <form onSubmit={destroy} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Delete workspace</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {workspace.name}
              </span>{" "}
              along with its projects, boards and tasks.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>This action cannot be undone.</AlertDescription>
          </Alert>

          <Field>
            <FieldLabel htmlFor="confirmation">
              Type{" "}
              <span className="font-mono font-semibold">
                "{workspace.name}"
              </span>{" "}
              to confirm
            </FieldLabel>
            <Input
              id="confirmation"
              autoComplete="off"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              disabled={loading}
            />
          </Field>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || !confirmed}
            >
              {loading && <Loader2 className="animate-spin" />}
              Delete workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteWorkspace
