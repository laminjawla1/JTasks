import { Workspace } from "@/definitions"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatTimestamp } from "@/utils"

const Details = ({ workspace }: { workspace: Workspace | null }) => {
  if (!workspace) return
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>
          Core information about this workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="ID" mono>
            {workspace.id}
          </DetailItem>
          <DetailItem label="Name">{workspace.name}</DetailItem>
          <DetailItem label="Slug" mono>
            {workspace.slug}
          </DetailItem>
          <DetailItem label="Status">
            <Badge>{workspace.status}</Badge>
          </DetailItem>
          <DetailItem label="Created at">
            {formatTimestamp(workspace.createdAt.toString())}
          </DetailItem>
          <DetailItem label="Updated at">
            {formatTimestamp(workspace.updatedAt.toString())}
          </DetailItem>
        </dl>
      </CardContent>
    </Card>
  )
}

const DetailItem = ({
  label,
  mono = false,
  children,
}: {
  label: string
  mono?: boolean
  children: React.ReactNode
}) => {
  return (
    <div className="min-w-0 space-y-1.5">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className={cn("truncate text-sm", mono && "font-mono text-xs")}>
        {children}
      </dd>
    </div>
  )
}

export default Details
