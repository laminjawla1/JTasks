"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErrors({
        email: "Email is required",
        password: "Password is required",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("auth_token", data.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setErrors(data.errors);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const RenderErrors = ({ errors }: { errors: Record<string, string> }) => {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <ul className="list-disc list-inside">
          {Object.values(errors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <div className="flex flex-col items-center justify-center my-2 md:my-40">
      {errors && <RenderErrors errors={errors} />}
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              className="border-2 border-emerald-600"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setErrors(null);
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              className="border-2 border-emerald-600"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setErrors(null);
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="text-center">
            <button className="w-full bg-emerald-600 px-4 py-2 rounded-sm text-white">
              Login
            </button>
          </div>

          <div className="text-center">
            Don't have an account? Register{" "}
            <Link className="text-emerald-600" href="/register">
              here
            </Link>
            .
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
