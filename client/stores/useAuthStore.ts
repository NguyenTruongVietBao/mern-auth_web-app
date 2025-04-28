// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
//
// // Create an axios instance
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api",
//   withCredentials: true, // Important for cookies
// });
//
// // Types
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   isVerified: boolean;
//   role: string;
//   createdAt: string;
//   updatedAt: string;
// }
//
// interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
//
//   // Auth methods
//   login: (
//     email: string,
//     password: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   register: (
//     name: string,
//     email: string,
//     password: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   logout: () => Promise<void>;
//   verifyEmail: (
//     token: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   forgotPassword: (
//     email: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   resetPassword: (
//     token: string,
//     password: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   refreshAccessToken: () => Promise<boolean>;
//
//   // User data methods
//   setUser: (user: User | null) => void;
//   clearAuth: () => void;
// }
//
// // Setup axios interceptors for automatic token refresh
// let isRefreshing = false;
// let failedQueue: any[] = [];
//
// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };
//
// // Add response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//
//     // If the error is not 401 or it's already a retry, reject
//     if (error.response?.status !== 401 || originalRequest._retry) {
//       return Promise.reject(error);
//     }
//
//     // Mark as retry to prevent infinite loops
//     originalRequest._retry = true;
//
//     // If already refreshing, queue this request
//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       })
//         .then((token) => {
//           originalRequest.headers["Authorization"] = `Bearer ${token}`;
//           return api(originalRequest);
//         })
//         .catch((err) => {
//           return Promise.reject(err);
//         });
//     }
//
//     isRefreshing = true;
//
//     // Try to refresh the token
//     try {
//       const { refreshAccessToken } = useAuthStore.getState();
//       const success = await refreshAccessToken();
//
//       if (success) {
//         const { accessToken } = useAuthStore.getState();
//         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
//         processQueue(null, accessToken);
//         return api(originalRequest);
//       } else {
//         processQueue(new Error("Failed to refresh token"));
//         useAuthStore.getState().clearAuth();
//         return Promise.reject(error);
//       }
//     } catch (refreshError) {
//       processQueue(refreshError);
//       useAuthStore.getState().clearAuth();
//       return Promise.reject(refreshError);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );
//
// // The actual store
// const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null,
//
//       setUser: (user) => set({ user }),
//
//       clearAuth: () =>
//         set({
//           user: null,
//           accessToken: null,
//           refreshToken: null,
//           isAuthenticated: false,
//           error: null,
//         }),
//
//       login: async (email, password) => {
//         set({ isLoading: true, error: null });
//         try {
//           console.log("Logging in with:", { email });
//           const response = await api.post("/api/auth/login", {
//             email,
//             password,
//           });
//           console.log("Login response:", response.data);
//
//           const { user, refreshToken, accessToken } = response.data;
//
//           if (!user) {
//             console.error("No user data in response:", response.data);
//             set({ isLoading: false, error: "Invalid user data received" });
//             return { success: false, message: "Invalid user data received" };
//           }
//
//           set({
//             user,
//             refreshToken,
//             accessToken,
//             isAuthenticated: true,
//             isLoading: false,
//             error: null,
//           });
//
//           // Save in sessionStorage for debugging purposes
//           try {
//             sessionStorage.setItem("currentUser", JSON.stringify(user));
//           } catch (e) {
//             console.error("Could not save to sessionStorage:", e);
//           }
//
//           console.log("User authenticated:", user);
//           return { success: true };
//         } catch (error: any) {
//           console.error("Login error:", error);
//           const message = error.response?.data?.message || "Login failed";
//           set({ isLoading: false, error: message });
//           return { success: false, message };
//         }
//       },
//
//       register: async (name, email, password) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await api.post("/auth/register", {
//             name,
//             email,
//             password,
//           });
//           set({ isLoading: false });
//           return { success: true, message: response.data.message };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Registration failed";
//           set({ isLoading: false, error: message });
//           return { success: false, message };
//         }
//       },
//
//       logout: async () => {
//         set({ isLoading: true });
//         try {
//           await api.get("/auth/logout");
//           get().clearAuth();
//         } catch (error) {
//           console.error("Logout error:", error);
//         } finally {
//           set({ isLoading: false });
//         }
//       },
//
//       verifyEmail: async (token) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await api.post("/auth/verify-email", {
//             verificationToken: token,
//           });
//           set({ isLoading: false });
//           return { success: true, message: response.data.message };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Email verification failed";
//           set({ isLoading: false, error: message });
//           return { success: false, message };
//         }
//       },
//
//       forgotPassword: async (email) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await api.post("/auth/forgot-password", { email });
//           set({ isLoading: false });
//           return { success: true, message: response.data.message };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Password reset request failed";
//           set({ isLoading: false, error: message });
//           return { success: false, message };
//         }
//       },
//
//       resetPassword: async (token, password) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await api.put(`/auth/reset-password/${token}`, {
//             password,
//           });
//           set({ isLoading: false });
//           return { success: true, message: response.data.message };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Password reset failed";
//           set({ isLoading: false, error: message });
//           return { success: false, message };
//         }
//       },
//
//       refreshAccessToken: async () => {
//         try {
//           const { refreshToken } = get();
//           if (!refreshToken) return false;
//
//           const response = await api.post("/auth/refresh-token", {
//             refreshToken,
//           });
//
//           // Update refresh token (rotation strategy)
//           set({ refreshToken: response.data.refreshToken });
//           return true;
//         } catch (error) {
//           get().clearAuth();
//           return false;
//         }
//       },
//     }),
//     {
//       name: "auth-storage",
//       storage: createJSONStorage(() => localStorage),
//       // Only persist non-sensitive data
//       partialize: (state) => ({
//         user: state.user,
//         refreshToken: state.refreshToken,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// );
//
// export default useAuthStore;
