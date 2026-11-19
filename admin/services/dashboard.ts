import { User } from "@/definitions";
import { apiRequest } from "../api";
import { UUID } from "crypto";

export const dashboardService = {
  getProjectSummary: (projectId: UUID) =>
    apiRequest(`/projects/${projectId}/summary`),

  getAll: () =>
    apiRequest("/users", {
      next: { revalidate: 3600, tags: ["users"] }, // Cache for 1 hour
    }),

  getById: (id: string) =>
    apiRequest(`/users/${id}`, {
      cache: "no-store", // Always fetch fresh data
    }),

  create: (data: Omit<User, "id">) =>
    apiRequest("/users/register", {
      method: "POST",
      body: data as unknown as BodyInit,
    }),

  login: ({ email, password }: { email: string; password: string }) =>
    apiRequest("/users/login", {
      method: "POST",
      body: { email, password } as unknown as BodyInit,
    }),
};
