import { apiRequest } from "../api"
import { CreateProject } from "@/app/(admin)/projects/CreateProject"

export const projectsService = {
  create: (workspaceSlug: string, data: CreateProject) =>
    apiRequest(`/${workspaceSlug}/projects`, {
      method: "POST",
      body: data as unknown as BodyInit,
    }),

  getAll: (workspaceSlug: string) => apiRequest(`/${workspaceSlug}/projects`),
}
