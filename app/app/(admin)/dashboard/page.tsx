"use client";

import Link from "next/link";
import { useMembershipStore } from "@/store/store";
import { useContextStore } from "@/store/contextStore";
import { useActiveWorkspaceId } from "@/hooks/useActiveWorkspaceId";
import { useState } from "react";
import { dashboardService } from "@/services/dashboard";
import { UUID } from "crypto";
import { useEffect } from "react";

type ProjectSummary = {
  id: UUID;
  name: string;
  description?: string | null;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  memberCount: number;
  boards: { id: UUID; name: string; taskCount: number }[];
};

function Stat({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`mt-2 text-3xl font-semibold tracking-tight ${
          danger ? "text-red-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

const Dashboard = () => {
  const memberships = useMembershipStore((s) => s.memberships);
  const workspaceId = useActiveWorkspaceId();
  const projectId = useContextStore((s) =>
    workspaceId ? s.projectByWorkspace[workspaceId] : undefined,
  );
  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchDashboardSummary();
    }
  }, []);

  const fetchDashboardSummary = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const response = await dashboardService.getProjectSummary(projectId);
      if (!response.ok) {
        throw new Error(`Error fetching summary: ${response.statusText}`);
      }
      const summary = await response.json();
      setSummary(summary);
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      setError("Failed to load project summary.");
    } finally {
      setLoading(false);
    }
  };

  if (!memberships || memberships.length === 0) {
    return (
      <div className="mx-auto mt-16 max-w-md rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-xl font-semibold">No workspace yet</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create your first workspace, or ask a teammate to invite you.
        </p>
        <Link
          href="/workspaces?create=true"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
        >
          Create a workspace
        </Link>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="mx-auto mt-16 max-w-md rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-xl font-semibold">Select a project</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose a project from the menu at the top to see its summary.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        Could not load this project{error ? `: ${error}` : "."}
      </div>
    );
  }

  const percent = summary.totalTasks
    ? Math.round((summary.completedTasks / summary.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {summary.name}
        </h1>
        {summary.description && (
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            {summary.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total tasks" value={summary.totalTasks} />
        <Stat label="Completed" value={summary.completedTasks} />
        <Stat
          label="Overdue"
          value={summary.overdueTasks}
          danger={summary.overdueTasks > 0}
        />
        <Stat label="Members" value={summary.memberCount} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span className="text-slate-500">{percent}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Boards</h2>
        {summary.boards.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No boards yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summary.boards.map((board) => (
              <Link
                key={board.id}
                href={`/projects/${summary.id}/boards/${board.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/5"
              >
                <p className="font-medium">{board.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {board.taskCount} {board.taskCount === 1 ? "task" : "tasks"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
