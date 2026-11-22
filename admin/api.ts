import Cookies from "js-cookie"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface FetchOptions extends RequestInit {
  next?: NextFetchRequestConfig
}

export async function apiRequest(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { headers, ...customConfig } = options

  const authToken = Cookies.get("auth_token") || ""

  const config: FetchOptions = {
    method: options.method || "GET",
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      "Content-Type": "application/json",
      ...headers,
    },
    ...customConfig,
  }

  // Automatically stringify the body if an object is passed
  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (
    response.status === 401 &&
    typeof window !== "undefined" &&
    !["/users/login", "/users/register"].includes(endpoint)
  ) {
    window.location.href = "/login"
  }

  return response
}
