"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Field from "@/components/auth/Field";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

type FormErrors = Record<string, string>;

// Only allow same-site relative paths, so ?callbackUrl can't redirect to another site
function getSafeRedirect(url: string | null) {
  if (url && url.startsWith("/") && !url.startsWith("//")) return url;
  return "/dashboard";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";
  const callbackUrl = getSafeRedirect(searchParams.get("callbackUrl"));

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors({});
  };

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setErrors({
        ...(!form.email && { email: "Email is required" }),
        ...(!form.password && { password: "Password is required" }),
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("auth_token", data.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        router.push(callbackUrl);
        router.refresh();
        return;
      }

      const data = await response.json().catch(() => null);
      setErrors(
        data?.errors ?? {
          form:
            response.status === 401
              ? "Invalid email or password."
              : (data?.message ?? "Login failed. Please try again."),
        },
      );
    } catch {
      setErrors({ form: "Could not reach the server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const generalErrors = Object.entries(errors)
    .filter(([key]) => key !== "email" && key !== "password")
    .map(([, message]) => message);

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">
        Log in to pick up where your team left off.
      </p>

      {registered && (
        <div
          role="status"
          className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          Account created. Please log in.
        </div>
      )}

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

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-emerald-600 hover:text-emerald-500"
        >
          Register
        </Link>
      </p>
    </>
  );
}

// useSearchParams needs a Suspense boundary in the App Router
export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
