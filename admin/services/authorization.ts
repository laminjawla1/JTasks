import { apiRequest } from "../api"
import { UUID } from "crypto"

export const authorizationService = {
  getPrivileges: () => apiRequest(`/authorization/privileges`),

  createRole: (
    workspaceId: UUID,
    data: { name: string; privilegeIds: Array<string> }
  ) =>
    apiRequest(`/workspaces/${workspaceId}/roles`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),

  updateRole: (
    workspaceId: UUID,
    roleId: UUID,
    data: { name: string; privilegeIds: Array<string> }
  ) =>
    apiRequest(`/workspaces/${workspaceId}/roles/${roleId}`, {
      method: "PUT",
      body: data as unknown as BodyInit,
    }),

  getRoles: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/roles`),

  get: (workspaceId: UUID) => apiRequest(`/workspaces/${workspaceId}`),

  deleteRole: (workspaceId: UUID, roleId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/roles/${roleId}`, {
      method: "DELETE",
    }),
}
