import { Project, User, Workspace, WorkspaceMember } from "@/definitions"

export interface AuthStore {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

export interface WorkspaceMemberStore {
  members: WorkspaceMember[]
  update: (members: WorkspaceMember[]) => void
}

export interface WorkspaceStore {
  workspaces: Workspace[]
  update: (workspaces: Workspace[]) => void
}

export interface ActiveWorkspaceStore {
  activeWorkspace: Workspace | null
  setActiveWorkspace: (workspace: Workspace) => void
}

export interface ProjectStore {
  projects: Project[]
  update: (projects: Project[]) => void
}
