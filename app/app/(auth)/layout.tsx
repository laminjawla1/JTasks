import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl"
        />
        <Link
          href="/"
          className="relative flex items-center gap-2 font-semibold"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-sm font-bold">
            J
          </span>
          JTasks
        </Link>

        <div className="relative">
          <h2 className="max-w-md text-4xl font-semibold tracking-tight">
            Plan work.{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Ship together.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Workspaces, projects, boards and tasks in one clean place, with the
            access controls your team needs.
          </p>
        </div>

        <p className="relative text-sm text-slate-500">
          © {new Date().getFullYear()} JTasks
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 font-semibold lg:hidden"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              J
            </span>
            JTasks
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
