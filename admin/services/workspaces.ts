import { apiRequest } from "../api"
import { UUID } from "crypto"
import { CreateProject } from "@/app/(admin)/projects/CreateProject"

export const workspaceService = {
  getProjects: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/projects`),

  getAll: () => apiRequest(`/workspaces`),

  getMembers: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/members`),

  createProject: (workspaceId: UUID, data: CreateProject) =>
    apiRequest(`/workspaces/${workspaceId}/projects`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),

  createWorkspace: (data: { name: string; description: string }) =>
    apiRequest(`/workspaces`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),
}
