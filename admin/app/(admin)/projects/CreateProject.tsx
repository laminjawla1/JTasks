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
import { WorkspaceMembership } from "@/services/memberships"
import { projectsService } from "@/services/projects"
import { workspaceService } from "@/services/workspaces"
import { useContextStore } from "@/store/contextStore"
import { useMembershipStore } from "@/store/store"
import { UUID } from "crypto"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export interface CreateProject {
  name: string
  leadId: UUID
  startDate: Date
  endDate: Date | null
}

interface CreateProjectProps {
  open: boolean
  onCreate: () => void
  render?: React.ReactElement
}

const CreateProject = ({ open, onCreate }: CreateProjectProps) => {
  const { memberships } = useMembershipStore()
  const workspaces = memberships.map((m) => m.workspace)
  const activeWorkspaceId = useContextStore((s) => s.activeWorkspaceId)
  const workspace = workspaces.find((w) => w.id == activeWorkspaceId)

  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<
    { value: string; label: string }[] | null
  >()
  const [name, setName] = useState<string>("")
  const [leadId, setLeadId] = useState<UUID | null>()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await workspaceService.getMembers(workspace?.id as UUID)
      if (!response.ok) return
      const members = await response.json()
      setUsers(
        members.map((member: WorkspaceMembership) => ({
          value: String(member.id),
          label: `${member.user.firstName} ${member.user.lastName}`,
        }))
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchMembers()
  }, [])

  const createProject = async () => {
    try {
      setLoading(true)
      const payload: CreateProject = {
        name: name,
        leadId: leadId as UUID,
        startDate: startDate as Date,
        endDate,
      }
      const response = await projectsService.create(
        workspace?.slug || "",
        payload
      )
      if (response.ok) {
        toast.add({
          type: "success",
          description: "Project created successfully",
        })
        onCreate?.()
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
    <Dialog open={open} onOpenChange={onCreate}>
      <form>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>
              Create a new project here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {/* Only the fields scroll, so the header and footer always stay visible */}
          <div className="-mx-1 max-h-[60svh] overflow-y-auto px-1 py-1">
            <FieldGroup className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="workspace">
                  Project will be created in this workspace
                </FieldLabel>
                <Input
                  disabled
                  id="workspace"
                  name="workspace"
                  required
                  value={workspace?.name}
                />
              </Field>

              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Project name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <FieldError>{errors.name}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.leadId}>
                <FieldLabel htmlFor="leadId">Lead</FieldLabel>
                <Select
                  required
                  items={users || []}
                  value={leadId ? String(leadId) : null}
                  onValueChange={(value) => value && setLeadId(value as UUID)}
                  disabled={loading}
                >
                  <SelectTrigger
                    id="leadId"
                    aria-label="Lead"
                    aria-invalid={!!errors.leadId}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.leadId && <FieldError>{errors.leadId}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.startDate}>
                <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                <Input
                  required
                  id="startDate"
                  name="startDate"
                  placeholder="Start date"
                  type="date"
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  disabled={loading}
                  aria-invalid={!!errors.startDate}
                />
                {errors.startDate && (
                  <FieldError>{errors.startDate}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!errors.endDate}>
                <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                <Input
                  required
                  id="endDate"
                  name="endDate"
                  placeholder="end date"
                  type="date"
                  disabled={loading}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  aria-invalid={!!errors.endDate}
                />
                {errors.endDate && <FieldError>{errors.endDate}</FieldError>}
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button disabled={loading} type="submit" onClick={createProject}>
              {loading && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default CreateProject
