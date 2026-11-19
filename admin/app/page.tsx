"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Building2,
  Columns3,
  FolderKanban,
  ListChecks,
  ShieldCheck,
  UserCog,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const features: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Workspaces",
    description:
      "Give every team its own space with its own members, projects and settings. Switch between them in one click.",
    icon: Building2,
  },
  {
    title: "Projects",
    description:
      "Group related work together and keep goals, people and progress organised under one roof.",
    icon: FolderKanban,
  },
  {
    title: "Boards",
    description:
      "Visualise work in columns that match how your team actually operates, from backlog to done.",
    icon: Columns3,
  },
  {
    title: "Tasks",
    description:
      "Assign owners, set priorities and due dates, and keep every detail attached to the task itself.",
    icon: ListChecks,
  },
  {
    title: "Role-based access",
    description:
      "Decide who can view, edit or manage each workspace so the right people have the right access.",
    icon: UserCog,
  },
  {
    title: "Secure by default",
    description:
      "Token-based authentication protects every request, so your team's work stays your team's.",
    icon: ShieldCheck,
  },
]

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
]

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
]

export default function Home() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              J
            </span>
            JTasks
          </Link>

          <ul className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <li>
              <a href="#features" className="transition hover:text-foreground">
                Features
              </a>
            </li>
            <li>
              <a href="#roles" className="transition hover:text-foreground">
                Roles
              </a>
            </li>
            <li>
              <Link href="/docs" className="transition hover:text-foreground">
                Docs
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Log in
            </Button>
            <Button nativeButton={false} render={<Link href="/register" />}>
              Get started
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[-10rem] left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-20 text-center md:pt-28">
            <Badge variant="secondary" className="gap-2 px-3 py-3 text-xs">
              <span className="size-1.5 rounded-full bg-primary" />
              Task management for modern teams
            </Badge>

            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Plan work.{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Ship together.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              JTasks brings your workspaces, projects, boards and tasks into one
              clean place, with the access controls your team needs to stay
              organised and secure.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-11 px-6 shadow-lg shadow-primary/25"
                nativeButton={false}
                render={<Link href="/register" />}
              >
                Get started free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-6"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Log in
              </Button>
            </div>

            {/* Board preview */}
            <Card className="mx-auto mt-16 max-w-4xl gap-0 p-2 text-left shadow-2xl shadow-foreground/10">
              <div className="flex items-center gap-1.5 px-4 py-3">
                <span className="size-2.5 rounded-full bg-red-300" />
                <span className="size-2.5 rounded-full bg-amber-300" />
                <span className="size-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">
                  acme / website-redesign / sprint-12
                </span>
              </div>
              <Separator />

              <div className="grid gap-3 rounded-b-xl bg-muted/50 p-4 md:grid-cols-3">
                {columns.map((column) => (
                  <div key={column.name} className="rounded-xl bg-muted p-3">
                    <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
                      <span>{column.name}</span>
                      <Badge variant="outline" className="bg-background">
                        {column.tasks.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {column.tasks.map((task) => (
                        <Card
                          key={task.title}
                          size="sm"
                          className="gap-2 rounded-lg p-3 shadow-sm"
                        >
                          <p className="text-sm font-medium">{task.title}</p>
                          <div>
                            <Badge variant="secondary">{task.tag}</Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
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
            <p className="mt-4 text-muted-foreground">
              A focused set of building blocks that scale from a two-person team
              to a whole organisation.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="transition hover:shadow-lg hover:shadow-primary/5 hover:ring-primary/40"
              >
                <CardHeader>
                  <div className="mb-2 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Roles — wrapped in .dark so shadcn tokens resolve to the dark theme */}
        <section
          id="roles"
          className="dark scroll-mt-20 bg-background py-24 text-foreground"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                The right access for every person
              </h2>
              <p className="mt-4 text-muted-foreground">
                Roles are set per workspace, so someone can be an admin in one
                team and a member in another. Permissions are enforced on the
                server on every request.
              </p>
            </div>

            <div className="space-y-3">
              {roles.map((role) => (
                <Card key={role.name} size="sm" className="gap-1">
                  <CardHeader>
                    <CardTitle className="text-emerald-400">
                      {role.name}
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                </Card>
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
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 h-11 bg-white px-6 text-emerald-700 hover:bg-emerald-50"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Get started free
            </Button>
          </div>
        </section>
      </main>

      <footer>
        <Separator />
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {year || 2026} JTasks. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#features" className="transition hover:text-foreground">
              Features
            </a>
            <Link href="/docs" className="transition hover:text-foreground">
              Docs
            </Link>
            <Link href="/login" className="transition hover:text-foreground">
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
