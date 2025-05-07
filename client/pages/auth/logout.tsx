"use client";

import React, { useEffect, useRef } from "react";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { LucideClockFading } from "lucide-react";

function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();

  const refreshTokenFromUrl = searchParams?.get("refreshToken");
  const accessTokenFromUrl = searchParams?.get("accessToken");

  useEffect(() => {
    if (
      !ref.current &&
      ((refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl &&
          accessTokenFromUrl === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync;
      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl]);

  // useEffect(() => {
  //   const idTimer = setTimeout(() => {
  //     if (
  //       (refreshTokenFromUrl &&
  //         refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
  //       (accessTokenFromUrl &&
  //         accessTokenFromUrl === getAccessTokenFromLocalStorage())
  //     ) {
  //       mutateAsync().then(() => {
  //         router.push("/login");
  //       });
  //     }
  //   }, 200);

  //   return () => {
  //     clearTimeout(idTimer);
  //   };
  // }, [accessTokenFromUrl, mutateAsync, refreshTokenFromUrl, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LucideClockFading className="h-10 w-10 animate-spin" />
    </div>
  );
}

export default LogoutPage;
