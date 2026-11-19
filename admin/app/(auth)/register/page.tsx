"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { userService } from "@/services/user"
import { User } from "@/definitions"

type FormErrors = Record<string, string>

const FIELD_NAMES = [
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
]

type FormFieldProps = {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  autoComplete?: string
  minLength?: number
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  minLength,
}: FormFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        aria-invalid={!!error}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

const Register = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear only the error for the field being edited
    setErrors((prev) => {
      if (!prev[name] && !prev.form) return prev
      const { [name]: _removed, form: _form, ...rest } = prev
      return rest
    })
  }

  const register = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const { confirmPassword: _confirm, ...payload } = form

      const response = await userService.create(payload as User)

      if (response.ok) {
        router.push("/login?registered=true")
        return
      }

      const data = await response.json().catch(() => null)
      setErrors(
        data?.errors ?? { form: data?.message ?? "Registration failed." }
      )
    } catch {
      setErrors({ form: "Could not reach the server. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  // Errors that don't belong to a specific input (e.g. "form" or unknown keys)
  const generalErrors = Object.entries(errors)
    .filter(([key]) => !FIELD_NAMES.includes(key))
    .map(([, message]) => message)

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Start organising your team&apos;s work in minutes.
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

      <form onSubmit={register} className="mt-8 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="First name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <FormField
            label="Last name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            minLength={8}
          />
          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  )
}

export default Register
