"use client"

import React, { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import Field from "@/components/auth/Field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { userService } from "@/services/user"
import { AuthUser, User } from "@/definitions"
import { userAuthStore, useWorkspaceStore } from "@/store/store"
import { workspaceService } from "@/services/workspaces"
import { toast } from "@/components/ui/toast"

type FormErrors = Record<string, string>

// Only allow same-site relative paths, so ?callbackUrl can't redirect to another site
function getSafeRedirect(url: string | null) {
  if (url && url.startsWith("/") && !url.startsWith("//")) return url
  return "/dashboard"
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered") === "true"
  const callbackUrl = getSafeRedirect(searchParams.get("callbackUrl"))
  const { login } = userAuthStore()
  const { update } = useWorkspaceStore()

  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors({})
  }

  const fetchWorkspaces = async () => {
    try {
      setLoading(true)
      const response = await workspaceService.getAll()
      if (!response.ok) return []
      const data = await response.json()
      update(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      setErrors({
        ...(!form.email && { email: "Email is required" }),
        ...(!form.password && { password: "Password is required" }),
      })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await userService.login(form)

      if (response.ok) {
        const authUser: AuthUser = await response.json()
        login(authUser.token, authUser as Omit<AuthUser, "token"> as User)
        await fetchWorkspaces()
        router.push(callbackUrl)
        router.refresh()
        return
      }

      const data = await response.json().catch(() => null)
      setErrors(
        data?.errors ?? {
          form:
            response.status === 401
              ? "Invalid email or password."
              : (data?.message ?? "Login failed. Please try again."),
        }
      )
    } catch {
      setErrors({ form: "Could not reach the server. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const generalErrors = Object.entries(errors)
    .filter(([key]) => key !== "email" && key !== "password")
    .map(([, message]) => message)

  useEffect(() => {
    if (registered) {
      toast.add({
        type: "success",
        description: "Account created. Please log in.",
      })
    }
  }, [])
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Log in to pick up where your team left off.
      </p>

      {generalErrors.length > 0 && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>
            <ul className="list-inside list-disc">
              {generalErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Register
        </Link>
      </p>
    </>
  )
}

// useSearchParams needs a Suspense boundary in the App Router
export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
