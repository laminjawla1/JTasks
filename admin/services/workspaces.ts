import { apiRequest } from "../api"
import { UUID } from "crypto"
import { CreateProject } from "@/app/(admin)/projects/CreateProject"

export const workspaceService = {
  getProjects: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/projects`),

  getMembers: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/members`),

  createProject: (workspaceId: UUID, data: CreateProject) =>
    apiRequest(`/workspaces/${workspaceId}/projects`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),
}
