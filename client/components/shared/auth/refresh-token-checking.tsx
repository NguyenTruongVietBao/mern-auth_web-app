"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Không check Refresh Token
const UNAUTHORIZED_PATHS = [
  "/login",
  "/register",
  "/verify-email",
  "/reset-password",
  "refresh-token",
];

export default function RefreshTokenChecking() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (UNAUTHORIZED_PATHS.includes(pathname || "")) {
      return;
    }
    let interval: any = null;

    // Phải gọi lần đầu tiên vì Interval sẽ chạy sau tg timeout
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });

    // Timeout interval < tg hết hạn của accessToken
    const TIMEOUT_INTERVAL = 1000;
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
      });
    }, TIMEOUT_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [pathname, router]);

  return null;
}
