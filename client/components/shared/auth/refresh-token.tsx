"use client";

import auth from "@/apiRequest/auth";
import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Không check Refresh Token
const UNAUTHORIZED_PATHS = [
  "/login",
  "/register",
  "/verify-email",
  "/reset-password",
  "refresh-token",
];

export default function RefreshToken() {
  const pathname = usePathname();

  useEffect(() => {
    if (UNAUTHORIZED_PATHS.includes(pathname || "")) {
      return;
    }
    let interval: any = null;

    // Phải gọi lần đầu tiên vì Interval sẽ chạy sau tg timeout
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });

    // Timeout interval < tg hết hạn của accessToken
    const TIMEOUT_INTERVAL = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
