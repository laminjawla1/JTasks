import Cookies from "js-cookie";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_TOKEN = Cookies.get("auth_token") || "";

interface FetchOptions extends RequestInit {
  next?: NextFetchRequestConfig;
}

export async function apiRequest(
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { headers, ...customConfig } = options;

  const config: FetchOptions = {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json",
      ...headers,
    },
    ...customConfig,
  };

  // Automatically stringify the body if an object is passed
  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  return await fetch(`${BASE_URL}${endpoint}`, config);
}
