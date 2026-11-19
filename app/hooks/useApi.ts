"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useApiGet<T>(path: string | null) {
  const router = useRouter();
  const token = userAuthStore((s) => s.token);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(null);
    setError(null);

    if (!path || !token) {
      setLoading(false);
      return;
    }

    console.log(`Fetching data from ${API_URL}${path} with token ${token}`);
    const controller = new AbortController();
    setLoading(true);

    fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/logout"); // expired or invalid JWT
          throw new Error("Session expired");
        }
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return (await res.json()) as T;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [path, token, router]);

  return { data, loading, error };
}
