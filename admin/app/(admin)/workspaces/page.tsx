"use client"
import { useState } from "react"
import CreateWorkspace from "./CreateWorkspace"
import { Workspace } from "@/definitions"
import { Button } from "@/components/ui/button"
import { Pencil, Plus } from "lucide-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useWorkspaceStore } from "@/store/store"
import UpdateWorkspace from "./UpdateWorkspace"
import { Badge } from "@/components/ui/badge"

const Workspaces = () => {
  const { workspaces } = useWorkspaceStore()
  const [createWorkspace, setCreateWorkspace] = useState(false)
  const [updateWorkspace, setUpdateWorkspace] = useState<Workspace | null>(null)

  const [openUpdateWorkspace, setOpenUpdateWorkspace] = useState(false)

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
                <CardAction>
                  <Pencil
                    size={20}
                    onClick={() => {
                      setUpdateWorkspace(workspace)
                      setOpenUpdateWorkspace(true)
                    }}
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
