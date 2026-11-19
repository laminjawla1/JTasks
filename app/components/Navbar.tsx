"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { useMembershipStore, userAuthStore } from "@/store/store";
import { useContextStore } from "@/store/contextStore";
import { useActiveWorkspaceId } from "@/hooks/useActiveWorkspaceId";
import { UUID } from "crypto";
import { workspaceService } from "@/services/workspaces";

type Project = { id: number | string; name: string };

const selectClass =
  "rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60";

const Navbar = () => {
  const user = userAuthStore((s) => s.user);
  const memberships = useMembershipStore((s) => s.memberships);
  const workspaceId = useActiveWorkspaceId();
  const setWorkspace = useContextStore((s) => s.setWorkspace);
  const setProject = useContextStore((s) => s.setProject);
  const storedProjectId = useContextStore((s) =>
    workspaceId ? s.projectByWorkspace[workspaceId] : undefined,
  );
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(false);

  const workspaces = memberships?.map((m) => m.workspace) ?? [];
  const firstWorkspaceId = workspaces[0] ? workspaces[0].id : null;

  // Default to the first workspace when nothing valid is selected
  useEffect(() => {
    if (!workspaceId && firstWorkspaceId) setWorkspace(firstWorkspaceId);
  }, [workspaceId, firstWorkspaceId, setWorkspace]);

  const projectExists = !!projects?.some(
    (p) => String(p.id) === storedProjectId,
  );
  const projectId = projectExists ? storedProjectId! : "";

  const fetchProjects = async () => {
    if (!workspaceId) return;

    try {
      const response = await workspaceService.getProjects(workspaceId);
      if (!response.ok) {
        throw new Error(`Error fetching projects: ${response.statusText}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchProjects();
    }
  }, [workspaceId, projects, storedProjectId, projectExists, setProject]);

  // Forget a remembered project that no longer exists (deleted, access removed)
  useEffect(() => {
    if (workspaceId && projects && storedProjectId && !projectExists) {
      setProject(workspaceId, null);
    }
  }, [workspaceId, projects, storedProjectId, projectExists, setProject]);

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-2">
        <select
          aria-label="Workspace"
          className={selectClass}
          value={workspaceId ?? ""}
          onChange={(e) => setWorkspace(e.target.value as UUID)}
        >
          {workspaces.map((w) => (
            <option key={w.id} value={String(w.id)}>
              {w.name}
            </option>
          ))}
        </select>

        {workspaceId && (
          <>
            <span aria-hidden className="text-slate-300">
              /
            </span>
            {projects && projects.length === 0 ? (
              <Link
                href={`/projects?create=true&workspace=${workspaceId}`}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                + Create a project
              </Link>
            ) : (
              <select
                aria-label="Project"
                className={selectClass}
                value={projectId}
                disabled={loading}
                onChange={(e) =>
                  setProject(workspaceId, e.target.value as UUID)
                }
              >
                <option value="" disabled>
                  {loading ? "Loading projects..." : "Select a project"}
                </option>
                {projects?.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <User />
        <div className="text-sm">
          {user ? `${user.firstName} ${user.lastName}` : "\u00A0"}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
