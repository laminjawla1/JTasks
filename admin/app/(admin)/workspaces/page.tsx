"use client"
import { FormEvent, useState } from "react"
import CreateWorkspace from "./CreateWorkspace"
import { Workspace } from "@/definitions"
import { Button } from "@/components/ui/button"
import { Loader2, Pencil, Plus, Settings, Trash } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
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
import { useRouter } from "next/navigation"

const Workspaces = () => {
  const router = useRouter()
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
            <form onSubmit={handleDeleteWorkspace} className="grid gap-4">
              <DialogHeader>
                <DialogTitle>Delete workspace</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-foreground">
                    {deleteWorkspace.name}
                  </span>
                  ? This action cannot be undone.
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="cursor-pointer transition hover:shadow-lg hover:shadow-primary/5 hover:ring-primary/40"
              onClick={() => router.push(`/workspaces/${workspace.id}`)}
            >
              <CardHeader>
                <CardTitle className="truncate">{workspace.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-10">
                  {workspace.description}
                </CardDescription>
                <CardAction className="flex items-center gap-1"></CardAction>
              </CardHeader>
              <CardFooter className="flex items-center justify-between gap-2 text-xs">
                <p className="truncate font-mono text-muted-foreground">
                  {workspace.slug}
                </p>
                <Badge>{workspace.status}</Badge>
              </CardFooter>
            </Card>
          ))}
        </div>

        {workspaces.length === 0 && (
          <Card className="mx-auto mt-16 max-w-md border border-dashed text-center ring-0">
            <CardHeader>
              <CardTitle className="text-xl">No workspaces yet</CardTitle>
              <CardDescription>
                You don&apos;t have any workspaces. Please create one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCreateWorkspace(true)}>
                <Plus />
                Create your first workspace
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

export default Workspaces
