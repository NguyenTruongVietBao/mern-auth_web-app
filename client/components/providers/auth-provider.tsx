"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Kiểm tra token có hợp lệ không
  const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;

      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  // Hàm check auth state
  const checkAuth = async (): Promise<boolean> => {
    const accessToken = getAccessTokenFromLocalStorage();
    const refreshToken = getRefreshTokenFromLocalStorage();

    if (!refreshToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    if (isTokenValid(accessToken)) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }

    // AccessToken không hợp lệ, thử refresh
    if (isTokenValid(refreshToken)) {
      try {
        // Gọi API refresh token
        const response = await fetch("/api/auth/refresh-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return true;
        } else {
          // Refresh thất bại
          setIsAuthenticated(false);
          setIsLoading(false);
          return false;
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }
    } else {
      // Refresh token cũng hết hạn
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  // Hàm logout
  const logout = () => {
    router.push("/logout");
  };

  // Kiểm tra trạng thái auth khi component mount
  useEffect(() => {
    checkAuth();

    // Thiết lập interval để định kỳ kiểm tra token
    const intervalId = setInterval(() => {
      const accessToken = getAccessTokenFromLocalStorage();

      // Nếu accessToken sắp hết hạn (còn 5 phút), chủ động refresh
      if (accessToken) {
        try {
          const decoded = jwtDecode<{ exp: number }>(accessToken);
          const currentTime = Date.now() / 1000;
          const fiveMinutes = 5 * 60; // 5 phút tính bằng giây

          if (decoded.exp - currentTime < fiveMinutes) {
            checkAuth();
          }
        } catch (error) {
          // Lỗi parse token, cứ check auth để an toàn
          checkAuth();
        }
      }
    }, 60000); // Kiểm tra mỗi phút

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, checkAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
