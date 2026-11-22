"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Plus } from "lucide-react"
import CreateProject from "./CreateProject"
import { useState } from "react"
import { Project } from "@/definitions"
import { useContextStore } from "@/store/contextStore"
import { useProjectsStore, useWorkspaceStore } from "@/store/store"
import { Badge } from "@/components/ui/badge"

const Projects = () => {
  const { workspaces } = useWorkspaceStore()
  const activeWorkspaceId = useContextStore((s) => s.activeWorkspaceId)
  const workspace = workspaces.find((w) => w.id === activeWorkspaceId)
  const { projects, update } = useProjectsStore()
  const [createProject, setCreateProject] = useState(false)

  return (
    <>
      {createProject && (
        <CreateProject
          open={createProject}
          onCreate={(project: Project) => {
            setCreateProject(false)
            update([project, ...projects])
          }}
        />
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <Button onClick={() => setCreateProject(true)}>
            <Plus />
            New Project
          </Button>
        </div>

        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25 pl-4">Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="pr-4 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="pl-4 font-medium">
                    {project.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.startDate.toString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.endDate?.toString()}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <Badge
                      variant={
                        project.status as
                          | "PENDING"
                          | "PROGRESS"
                          | "SUSPENDED"
                          | "COMPLETED"
                          | "CANCELLED"
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Pagination className="flex items-center justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}
export default Projects
