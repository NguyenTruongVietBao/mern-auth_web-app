"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshTokenChecking from "@/components/shared/auth/refresh-token-checking";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  removeAccessTokenFromLocalStorage,
  removeRefreshTokenFromLocalStorage,
} from "@/lib/utils";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      setIsAuth(true);
    }
  }, []);

  const setIsAuthState = (isAuth: boolean) => {
    if (isAuth) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      removeAccessTokenFromLocalStorage();
      removeRefreshTokenFromLocalStorage();
    }
  };

  return (
    <AppContext value={{ isAuth, setIsAuth: setIsAuthState }}>
      <QueryClientProvider client={queryClient}>
        <RefreshTokenChecking />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext>
  );
}
