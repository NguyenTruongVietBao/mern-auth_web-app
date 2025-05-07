"use client";

import React, { useEffect } from "react";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { LucideClockFading } from "lucide-react";

function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const refreshTokenFromUrl = searchParams?.get("refreshToken");
  const redirectFromUrl = searchParams?.get("redirect");

  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectFromUrl || "/");
        },
      });
    } else {
      router.push("/");
    }
  }, [redirectFromUrl, refreshTokenFromUrl, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LucideClockFading className="h-10 w-10 animate-spin" />
    </div>
  );
}

export default RefreshTokenPage;
