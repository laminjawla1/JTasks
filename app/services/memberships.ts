import { BaseEntity, Role, User, Workspace } from "@/definitions";
import { apiRequest } from "../api";

export interface WorkspaceMembership extends BaseEntity {
  user: User;
  workspace: Workspace;
  roles: Role[];
  status: string;
}

export const membershipService = {
  getAll: () =>
    apiRequest("/workspace-memberships", {
      next: { revalidate: 3600, tags: ["workspace-memberships"] }, // Cache for 1 hour
    }),

  getById: (id: string) =>
    apiRequest(`/workspace-memberships/${id}`, {
      cache: "no-store", // Always fetch fresh data
    }),

  create: (data: Omit<WorkspaceMembership, "id">) =>
    apiRequest("/workspace-memberships", {
      method: "POST",
      body: data as unknown as BodyInit,
    }),
};
