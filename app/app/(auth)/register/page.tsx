"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type FormErrors = Record<string, string>;

const FIELD_NAMES = [
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
];

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  minLength?: number;
};

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  minLength,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        aria-invalid={!!error}
        className={`rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-4 ${
          error
            ? "border-red-400 focus:ring-red-100"
            : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
        }`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const Register = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear only the error for the field being edited
    setErrors((prev) => {
      if (!prev[name] && !prev.form) return prev;
      const { [name]: _removed, form: _form, ...rest } = prev;
      return rest;
    });
  };

  const register = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword: _confirm, ...payload } = form;

      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/login?registered=true");
        return;
      }

      const data = await response.json().catch(() => null);
      setErrors(
        data?.errors ?? { form: data?.message ?? "Registration failed." },
      );
    } catch {
      setErrors({ form: "Could not reach the server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Errors that don't belong to a specific input (e.g. "form" or unknown keys)
  const generalErrors = Object.entries(errors)
    .filter(([key]) => !FIELD_NAMES.includes(key))
    .map(([, message]) => message);

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Start organising your team's work in minutes.
      </p>

      {generalErrors.length > 0 && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <ul className="list-inside list-disc">
            {generalErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={register} className="mt-8 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="First name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Field
            label="Last name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>

        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            minLength={8}
          />
          <Field
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:text-emerald-500"
        >
          Log in
        </Link>
      </p>
    </>
  );
};

export default Register;
