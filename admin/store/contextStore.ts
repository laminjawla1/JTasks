import { UUID } from "crypto"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useProjectsStore } from "./store"

type ContextState = {
  activeWorkspaceId: UUID | null
  /** Last selected project per workspace, so switching back restores it */
  projectByWorkspace: Record<UUID, UUID>
  setWorkspace: (workspaceId: UUID) => void
  setProject: (workspaceId: UUID, projectId: UUID | null) => void
  reset: () => void
}

export const useContextStore = create<ContextState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      projectByWorkspace: {},
      setWorkspace: (workspaceId) => {
        const { update } = useProjectsStore()
        update([])
        set({ activeWorkspaceId: workspaceId })
      },
      setProject: (workspaceId, projectId) =>
        set((state) => {
          const next = { ...state.projectByWorkspace }
          if (projectId) next[workspaceId] = projectId
          else delete next[workspaceId]
          return { projectByWorkspace: next }
        }),
      reset: () => set({ activeWorkspaceId: null, projectByWorkspace: {} }),
    }),
    { name: "jtasks_context" }
  )
)
