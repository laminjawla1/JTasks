"use client"
import { useState } from "react"
import CreateWorkspace from "./CreateWorkspace"
import { Workspace } from "@/definitions"
import { Button } from "@/components/ui/button"
import { Pencil, Plus } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useWorkspaceStore } from "@/store/store"

const Workspaces = () => {
  const { workspaces, update } = useWorkspaceStore()
  const [createWorkspace, setCreateWorkspace] = useState(false)

  return (
    <>
      {createWorkspace && (
        <CreateWorkspace open={createWorkspace} setOpen={setCreateWorkspace} />
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
                  <Pencil size={20} />
                </CardAction>
              </CardHeader>
              <CardFooter>
                <p>{workspace.slug}</p>
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
