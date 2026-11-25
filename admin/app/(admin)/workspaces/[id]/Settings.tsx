"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
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
import DeleteWorkspace from "./DeleteWorkspace"
import TransferOwnership from "./TransferOwnership"

interface SettingsProps {
  workspace: Workspace | null
  onUpdated?: (workspace: Workspace) => void
}

export const Settings = ({ workspace, onUpdated }: SettingsProps) => {
  const [name, setName] = useState(workspace?.name ?? "")
  const [description, setDescription] = useState(workspace?.description ?? "")
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [transferOpen, setTransferOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { workspaces, update } = useWorkspaceStore()

  if (!workspace) return

  const dirty =
    name.trim() !== workspace.name ||
    description !== (workspace.description ?? "")

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setSaving(true)
      setErrors({})
      const response = await workspaceService.updateWorkspace(workspace.id, {
        name,
        description,
      })
      if (response.ok) {
        const updated = await response.json()
        toast.add({
          type: "success",
          description: "Workspace updated successfully",
        })
        update(workspaces.map((w) => (w.id === updated.id ? updated : w)))
        onUpdated?.(updated)
      } else {
        const data = await response.json().catch(() => null)
        if (data?.errors) setErrors(data.errors)
        else {
          toast.add({
            type: "error",
            description: data?.message || "Unable to update workspace",
            priority: "high",
          })
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {transferOpen && (
        <TransferOwnership
          workspace={workspace}
          open={transferOpen}
          setOpen={setTransferOpen}
          onTransferred={() => onUpdated?.(workspace)}
        />
      )}

      {deleteOpen && (
        <DeleteWorkspace
          workspace={workspace}
          open={deleteOpen}
          setOpen={setDeleteOpen}
        />
      )}

      <div className="space-y-6">
        {/* General */}
        <Card>
          <form onSubmit={save} className="contents">
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>
                Update how this workspace appears to your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="max-w-2xl gap-5">
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="name">Workspace name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={saving}
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
                    disabled={saving}
                    aria-invalid={!!errors.description}
                  />
                  {errors.description && (
                    <FieldError>{errors.description}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="slug">Slug</FieldLabel>
                  <Input
                    id="slug"
                    value={workspace.slug}
                    readOnly
                    disabled
                    className="font-mono"
                  />
                  <FieldDescription>
                    The slug is generated for you and can&apos;t be changed.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={saving || !dirty}
                onClick={() => {
                  setName(workspace.name)
                  setDescription(workspace.description ?? "")
                  setErrors({})
                }}
              >
                Reset
              </Button>
              <Button type="submit" disabled={saving || !dirty}>
                {saving && <Loader2 className="animate-spin" />}
                Save changes
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Danger zone */}
        <Card className="ring-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>
              These actions are sensitive. Please be careful.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Transfer ownership</p>
                <p className="text-sm text-muted-foreground">
                  Hand this workspace over to another member. You will lose
                  owner privileges.
                </p>
              </div>
              <Button variant="outline" onClick={() => setTransferOpen(true)}>
                Transfer ownership
              </Button>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Delete workspace</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this workspace and everything in it. This
                  can&apos;t be undone.
                </p>
              </div>
              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                Delete workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Settings
