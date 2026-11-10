"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";

const Register = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const register = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (response.ok) {
        router.push("/login");
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
      <form onSubmit={register}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-col">
              <label htmlFor="firstName">First Name</label>
              <input
                className="border-2 border-emerald-600"
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setErrors(null);
                  setFirstName(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="lastName">Last Name</label>
              <input
                className="border-2 border-emerald-600"
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setErrors(null);
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>

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

          <div className="flex flex-col md:flex-row gap-2">
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

            <div className="flex flex-col">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="border-2 border-emerald-600"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setErrors(null);
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="text-center">
            <button className="w-full bg-emerald-600 px-4 py-2 rounded-sm text-white">
              Register
            </button>
          </div>

          <div className="text-center">
            Already have an account? Login{" "}
            <Link className="text-emerald-600" href="/login">
              here
            </Link>
            .
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
