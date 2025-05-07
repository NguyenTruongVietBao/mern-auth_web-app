import envConfig from "@/configs/envConfig";
import { normalizePath } from "@/lib/utils";
import { redirect } from "next/navigation";

type CustomOptions = RequestInit & {
  baseUrl?: string | undefined;
};

type HttpErrorPayload = {
  success: boolean;
  message: string;
  data?: any;
};

export class HttpError extends Error {
  status: number;
  payload: HttpErrorPayload;

  constructor({
    status,
    payload,
  }: {
    status: number;
    payload: HttpErrorPayload;
  }) {
    super(payload.message || "Http Error");
    this.status = status;
    this.payload = payload;
  }

  getMessage(): string {
    return this.payload.message;
  }
}

let clientLogoutRequest: null | Promise<any> = null;
const isClient = typeof window !== "undefined";

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;

  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

  if (isClient) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  // baseUrl = '' -> Call api Next Server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_BACKEND_URL
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  let payload: any;
  try {
    payload = await res.json();
  } catch (error) {
    console.log("error", error);
    payload = {
      success: false,
      message: "Failed to parse response body",
    };
  }

  if (!res.ok) {
    const errorPayload: HttpErrorPayload = {
      success: false,
      message: payload.message || `Request failed with status ${res.status}`,
    };

    if (res.status === 401) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: null,
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
            console.error("Logout error:", error);
          } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            clientLogoutRequest = null;
            location.href = "/login";
          }
        }
      } else {
        // TH: Vẫn còn Access Token và gọi API ở Next Server dến Backend
        const accessToken = (options?.headers as any)?.Authorization?.split(
          "Bearer "
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError({
        status: res.status,
        payload: errorPayload,
      });
    }
  }

  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (normalizeUrl === "api/auth/login" && payload.success) {
      const accessToken = payload.data?.accessToken;
      const refreshToken = payload.data?.refreshToken;
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }
    } else if (normalizeUrl === "api/auth/logout") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return {
    status: res.status,
    payload: payload as Response,
  };
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
