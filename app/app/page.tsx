"use client";

import Link from "next/link";

const features = [
  {
    title: "Workspaces",
    description:
      "Give every team its own space with its own members, projects and settings. Switch between them in one click.",
  },
  {
    title: "Projects",
    description:
      "Group related work together and keep goals, people and progress organised under one roof.",
  },
  {
    title: "Boards",
    description:
      "Visualise work in columns that match how your team actually operates, from backlog to done.",
  },
  {
    title: "Tasks",
    description:
      "Assign owners, set priorities and due dates, and keep every detail attached to the task itself.",
  },
  {
    title: "Role-based access",
    description:
      "Decide who can view, edit or manage each workspace so the right people have the right access.",
  },
  {
    title: "Secure by default",
    description:
      "Token-based authentication protects every request, so your team's work stays your team's.",
  },
];

const roles = [
  {
    name: "Owner",
    description: "Full control of the workspace, billing and members.",
  },
  {
    name: "Admin",
    description: "Manage projects, boards and invite people to the team.",
  },
  {
    name: "Member",
    description: "Create and update tasks, collaborate and track progress.",
  },
];

const columns = [
  {
    name: "To do",
    tasks: [
      { title: "Design onboarding flow", tag: "Design" },
      { title: "Write API docs", tag: "Docs" },
    ],
  },
  {
    name: "In progress",
    tasks: [
      { title: "Workspace switcher", tag: "Frontend" },
      { title: "JWT refresh logic", tag: "Backend" },
    ],
  },
  {
    name: "Done",
    tasks: [
      { title: "Set up database schema", tag: "Backend" },
      { title: "Landing page", tag: "Frontend" },
    ],
  },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              J
            </span>
            JTasks
          </Link>

          <ul className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <li>
              <a href="#features" className="transition hover:text-slate-900">
                Features
              </a>
            </li>
            <li>
              <a href="#roles" className="transition hover:text-slate-900">
                Roles
              </a>
            </li>
            <li>
              <Link href="/docs" className="transition hover:text-slate-900">
                Docs
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-10rem] h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-emerald-400/25 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center md:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Task management for modern teams
            </span>

            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Plan work.{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Ship together.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              JTasks brings your workspaces, projects, boards and tasks into one
              clean place, with the access controls your team needs to stay
              organised and secure.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500"
              >
                Get started free
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Log in
              </Link>
            </div>

            {/* Board preview */}
            <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-2xl shadow-slate-900/10">
              <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 font-mono text-xs text-slate-400">
                  acme / website-redesign / sprint-12
                </span>
              </div>

              <div className="grid gap-3 bg-slate-50 p-4 md:grid-cols-3">
                {columns.map((column) => (
                  <div
                    key={column.name}
                    className="rounded-xl bg-slate-100/70 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>{column.name}</span>
                      <span className="rounded-full bg-white px-2 py-0.5">
                        {column.tasks.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {column.tasks.map((task) => (
                        <div
                          key={task.title}
                          className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                        >
                          <p className="text-sm font-medium text-slate-800">
                            {task.title}
                          </p>
                          <span className="mt-2 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                            {task.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything your team needs, nothing it doesn&apos;t
            </h2>
            <p className="mt-4 text-slate-600">
              A focused set of building blocks that scale from a two-person team
              to a whole organisation.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 p-6 transition hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/5"
              >
                <span className="font-mono text-sm text-emerald-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section
          id="roles"
          className="scroll-mt-20 bg-slate-950 py-24 text-white"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                The right access for every person
              </h2>
              <p className="mt-4 text-slate-400">
                Roles are set per workspace, so someone can be an admin in one
                team and a member in another. Permissions are enforced on the
                server on every request.
              </p>
            </div>

            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.name}
                  className="rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-medium text-emerald-400">{role.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-16 text-center text-white">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to get your team organised?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-emerald-50">
              Create your first workspace in under a minute.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-medium text-emerald-700 transition hover:bg-emerald-50"
            >
              Get started free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} JTasks. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#features" className="transition hover:text-slate-900">
              Features
            </a>
            <Link href="/docs" className="transition hover:text-slate-900">
              Docs
            </Link>
            <Link href="/login" className="transition hover:text-slate-900">
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
