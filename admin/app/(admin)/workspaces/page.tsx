"use client"
import { FormEvent, useState } from "react"
import CreateWorkspace from "./CreateWorkspace"
import { Workspace } from "@/definitions"
import { Button } from "@/components/ui/button"
import { Loader2, Pencil, Plus, Trash } from "lucide-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
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

import { useWorkspaceStore } from "@/store/store"
import UpdateWorkspace from "./UpdateWorkspace"
import { Badge } from "@/components/ui/badge"
import { workspaceService } from "@/services/workspaces"
import { toast } from "@/components/ui/toast"

const Workspaces = () => {
  const { workspaces, update } = useWorkspaceStore()
  const [createWorkspace, setCreateWorkspace] = useState(false)
  const [updateWorkspace, setUpdateWorkspace] = useState<Workspace | null>(null)
  const [deleteWorkspace, setDeleteWorkspace] = useState<Workspace | null>(null)

  const [openUpdateWorkspace, setOpenUpdateWorkspace] = useState(false)
  const [openDeleteWorkspace, setOpenDeleteWorkspace] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDeleteWorkspace = async (e: FormEvent) => {
    e.preventDefault()
    if (!deleteWorkspace) return
    try {
      setLoading(true)
      const response = await workspaceService.deleteWorkspace(
        deleteWorkspace.id
      )
      if (response.ok) {
        update(workspaces.filter((w) => w.id !== deleteWorkspace.id))
        setOpenDeleteWorkspace(false)
        toast.add({
          type: "success",
          description: "Workspace deleted successfully",
        })
      } else {
        const data = await response.json()
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
    <>
      {createWorkspace && (
        <CreateWorkspace open={createWorkspace} setOpen={setCreateWorkspace} />
      )}

      {updateWorkspace && (
        <UpdateWorkspace
          workspace={updateWorkspace}
          open={openUpdateWorkspace}
          setOpen={setOpenUpdateWorkspace}
        />
      )}

      {deleteWorkspace && (
        <Dialog
          open={openDeleteWorkspace}
          onOpenChange={setOpenDeleteWorkspace}
        >
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleDeleteWorkspace}>
              <DialogHeader>
                <DialogTitle>
                  Delete Workspace ({deleteWorkspace.name})
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this workspace
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button disabled={loading} type="submit" variant="destructive">
                  {loading && <Loader2 className="animate-spin" />}
                  Delete
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>
          <Button onClick={() => setCreateWorkspace(true)}>
            <Plus />
            New Workspace
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card key={workspace.id}>
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
                <CardDescription>{workspace.description}</CardDescription>
                <CardAction className="flex items-center justify-between gap-2">
                  <Pencil
                    className="cursor-pointer"
                    size={20}
                    onClick={() => {
                      setUpdateWorkspace(workspace)
                      setOpenUpdateWorkspace(true)
                    }}
                  />
                  <Trash
                    onClick={() => {
                      setDeleteWorkspace(workspace)
                      setOpenDeleteWorkspace(true)
                    }}
                    className="cursor-pointer hover:text-red-600"
                  />
                </CardAction>
              </CardHeader>
              <CardFooter className="flex items-center justify-between text-xs">
                <p className="font-light italic">{workspace.slug}</p>
                <Badge>{workspace.status}</Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
        {workspaces.length === 0 && (
          <div className="flex h-[50%] flex-col items-center justify-center">
            <p>You don't have any workspaces. Please create one.</p>
            <Button className="mt-2" onClick={() => setCreateWorkspace(true)}>
              Create your first workspace
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default Workspaces
