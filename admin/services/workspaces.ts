import { apiRequest } from "../api"
import { UUID } from "crypto"
import { CreateProject } from "@/app/(admin)/projects/CreateProject"
import { CreateWorkspace } from "@/app/(admin)/workspaces/CreateWorkspace"

export const workspaceService = {
  getProjects: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/projects`),

  getAll: () => apiRequest(`/workspaces`),

  getRoles: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/roles`),

  getSettings: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/settings`),

  getAuditLogs: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/audit-logs`),

  inviteMember: (workspaceId: UUID, data: CreateProject) =>
    apiRequest(`/workspaces/${workspaceId}/projects`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),

  createProject: (workspaceId: UUID, data: CreateProject) =>
    apiRequest(`/workspaces/${workspaceId}/projects`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),

  createWorkspace: (data: CreateWorkspace) =>
    apiRequest(`/workspaces`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),

  get: (workspaceId: UUID) => apiRequest(`/workspaces/${workspaceId}`),

  updateWorkspace: (workspaceId: UUID, data: CreateWorkspace) =>
    apiRequest(`/workspaces/${workspaceId}`, {
      method: "PUT",
      body: data as unknown as BodyInit,
    }),

  deleteWorkspace: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}`, {
      method: "DELETE",
    }),

  transferOwnership: (workspaceId: UUID, data: { memberId: UUID }) =>
    apiRequest(`/workspaces/${workspaceId}/transfer`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),
}
