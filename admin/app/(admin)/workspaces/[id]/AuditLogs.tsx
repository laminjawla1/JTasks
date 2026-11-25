import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { Workspace, WorkspaceMember } from "@/definitions"
import { workspaceService } from "@/services/workspaces"
import { useEffect, useState } from "react"

const AuditLogs = ({ workspace }: { workspace: Workspace | null }) => {
  const [members, setAuditLogs] = useState<WorkspaceMember[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAuditLogs = async () => {
    if (!workspace) return
    try {
      setLoading(true)
      const response = await workspaceService.getAuditLogs(workspace.id)
      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data)
      }
    } catch (error) {
      toast.add({
        type: "error",
        description: "Unable to fetch roles",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  if (!workspace) return

  return (
    <Card>
      <CardHeader>
        <CardTitle>AuditLogs</CardTitle>
        <CardDescription>
          Manage roles. Create roles and set permissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Page views are up 25% compared to last month.
      </CardContent>
    </Card>
  )
}

export default AuditLogs
