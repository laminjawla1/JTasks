"use client"

import { create } from "zustand"
import { Project, User, Workspace, WorkspaceMember } from "@/definitions"
import Cookies from "js-cookie"
import {
  ActiveWorkspaceStore,
  AuthStore,
  ProjectStore,
  WorkspaceMemberStore,
  WorkspaceStore,
} from "./definitions"
import { persist } from "zustand/middleware"

export const useProjectsStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      update: (projects: Project[]) => set({ projects }),
    }),
    { name: "projects" }
  )
)

export const useActiveWorkspaceStore = create<ActiveWorkspaceStore>()(
  persist(
    (set) => ({
      activeWorkspace: null,
      setActiveWorkspace: (activeWorkspace: Workspace) =>
        set({ activeWorkspace }),
    }),
    { name: "activeWorkspace" }
  )
)

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],
      update: (workspaces: Workspace[]) => set({ workspaces }),
    }),
    { name: "workspaces" }
  )
)


export const userAuthStore = create<AuthStore>((set) => {
  const token = Cookies.get("auth_token") || null
  let user
  try {
    user = (JSON.parse(Cookies.get("user") || "") as User) || null
  } catch {
    user = null
  }

  return {
    token,
    user,
    login: (token: string, user: User) => {
      Cookies.set("auth_token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      })

      Cookies.set("user", JSON.stringify(user), {
        expires: 1,
        secure: true,
        sameSite: "strict",
      })
      set({ token, user })
    },

    logout: () => {
      Cookies.remove("user", { path: "/" })
      Cookies.remove("auth_token", { path: "/" })
      localStorage.clear()
      set({ token: null, user: null })
    },
  }
})
