"use client";

import { jwtDecode } from "jwt-decode";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "./utils";
import auth from "@/apiRequest/auth";

interface TokenData {
  userId: string;
  role?: string;
  exp: number;
  iat: number;
}

/**
 * Kiểm tra token có hợp lệ không
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

/**
 * Tính thời gian còn lại của token (tính bằng giây)
 */
export const getTokenTimeRemaining = (token: string | null): number => {
  if (!token) return 0;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return Math.max(0, decoded.exp - currentTime);
  } catch (error) {
    return 0;
  }
};

/**
 * Lấy thông tin từ token
 */
export const getTokenData = (token: string | null): TokenData | null => {
  if (!token) return null;

  try {
    return jwtDecode<TokenData>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Lấy role của người dùng từ access token
 */
export const getUserRole = (): string | null => {
  const accessToken = getAccessTokenFromLocalStorage();
  const tokenData = getTokenData(accessToken);

  return tokenData?.role || null;
};

/**
 * Kiểm tra người dùng đã đăng nhập hay chưa
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();

  // Nếu không có refresh token, coi như chưa đăng nhập
  if (!refreshToken) return false;

  // Nếu access token còn hạn, coi như đã đăng nhập
  if (isTokenValid(accessToken)) return true;

  // Nếu refresh token còn hạn, vẫn coi là đã đăng nhập
  return isTokenValid(refreshToken);
};

/**
 * Làm mới token với cơ chế reuse token (chỉ gọi 1 lần dù có nhiều request đồng thời)
 */
let refreshTokenPromise: Promise<boolean> | null = null;

export const refreshTokens = async (): Promise<boolean> => {
  // Nếu đã có request đang chạy, trả về promise đó
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  const refreshToken = getRefreshTokenFromLocalStorage();
  if (!refreshToken) {
    return false;
  }

  refreshTokenPromise = auth
    .cRefreshToken({ refreshToken })
    .then((response) => {
      return response.status === 200;
    })
    .catch((error) => {
      console.error("Error refreshing token:", error);
      return false;
    })
    .finally(() => {
      // Reset refreshTokenPromise khi xong
      refreshTokenPromise = null;
    });

  return refreshTokenPromise;
};
