import auth from "@/apiRequest/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isBrowser = typeof window !== "undefined";

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

export const setAccessTokenToLocalStorage = (accessToken: string) =>
  isBrowser ? localStorage.setItem("accessToken", accessToken) : null;

export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  isBrowser ? localStorage.setItem("refreshToken", refreshToken) : null;

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess: () => void;
}) => {
  // Không nên đưa logic lấy accessToken và refreshToken khỏi checkAndRefreshToken
  // Vì mỗi lần checkAndRefreshToken được gọi sẽ lấy lại accessToken và refreshToken mới
  // Tránh hiện tượng lấy accessToken và refreshToken cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  if (!accessToken || !refreshToken) {
    return;
  }
  const decodedRefreshToken = jwtDecode(refreshToken) as {
    exp: number;
    iat: number;
  };
  const decodedAccessToken = jwtDecode(accessToken) as {
    exp: number;
    iat: number;
  };

  const now = Date.now() / 1000;

  const isRefreshTokenExpired = decodedRefreshToken.exp < now;

  // Nếu RefreshToken hết hạn thì cần đăng nhập lại
  if (isRefreshTokenExpired) {
    return;
  }

  // Nếu AccessToken còn 1/3 thời gian thì refresh token
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const response = await auth.cRefreshToken();
      const { accessToken, refreshToken } = response.payload.data;
      setAccessTokenToLocalStorage(accessToken);
      setRefreshTokenToLocalStorage(refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};

const parseDuration = (durationStr: string) => {
  const match = durationStr.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error("Invalid duration format (e.g., 15m, 30s)");

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Invalid time unit");
  }
};
