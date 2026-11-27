import { apiRequest } from "../api"
import { UUID } from "crypto"

export const workspaceMemberService = {
  getAll: (workspaceId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/members`),

  inviteMember: (workspaceId: UUID, data: { email: string; roleIds: UUID[] }) =>
    apiRequest(`/workspaces/${workspaceId}/members`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),

  removeMember: (workspaceId: UUID, workspaceMemberId: UUID) =>
    apiRequest(`/workspaces/${workspaceId}/members/${workspaceMemberId}`, {
      method: "DELETE",
    }),

  updateMemberRole: (
    workspaceId: UUID,
    workspaceMemberId: UUID,
    data: { roleIds: UUID[] }
  ) =>
    apiRequest(
      `/workspaces/${workspaceId}/members/${workspaceMemberId}/update-role`,
      {
        body: data as unknown as BodyInit,
      }
    ),
}
