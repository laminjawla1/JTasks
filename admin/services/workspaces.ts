import { User } from "@/definitions"
import { apiRequest } from "../api"
import { UUID } from "crypto"

export const workspaceService = {
  getProjects: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/projects`),

  getMembers: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/members`),
}
