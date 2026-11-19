"use client";

import {
  CircleGauge,
  FolderKanban,
  Settings,
  SquareArrowRightExit,
  Users,
  UsersRoundCollaboration,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: CircleGauge },
  { href: "/workspaces", label: "Workspaces", icon: UsersRoundCollaboration },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/users", label: "Users", icon: Users },
];

const Sidebar = () => {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition ${
      active
        ? "bg-emerald-600/20 text-emerald-400"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;
  };

  return (
    <aside className="sticky top-0 flex h-svh w-48 shrink-0 flex-col justify-between bg-slate-900 p-4 text-sm text-white">
      <div className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="mb-4 flex items-center gap-2 px-3 font-semibold"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            J
          </span>
          JTasks
        </Link>

        {mainLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(href)}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <Link href="/settings" className={linkClass("/settings")}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <Link
          href="/logout"
          prefetch={false}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-400 transition hover:bg-red-500/10"
        >
          <SquareArrowRightExit size={18} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
