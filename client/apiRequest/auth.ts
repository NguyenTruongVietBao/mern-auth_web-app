import {
  ForgotPasswordBodyType,
  LoginBodyType,
  LoginResponseType,
  LogoutBodyType,
  MessageResponseType,
  RefreshTokenBodyType,
  RefreshTokenResponseType,
  RegisterBodyType,
  RegisterResponseType,
  ResetPasswordBodyType,
  VerifyEmailBodyType,
} from "@/schemas";
import http from "@/lib/http";

const auth = {
  sLogin: async (body: LoginBodyType) =>
    http.post<LoginResponseType>("/api/auth/login", body),
  cLogin: async (body: LoginBodyType) =>
    http.post<MessageResponseType>("/api/auth/login", body, {
      baseUrl: "",
    }),

  sLogout: async (body: LogoutBodyType & { accessToken: string }) =>
    http.post(
      "/api/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: { Authorization: `Bearer ${body.accessToken}` },
      }
    ),
  cLogout: async () =>
    http.post<{ message: string }>("/api/auth/logout", null, {
      baseUrl: "",
    }),

  refreshTokenRequest: null as any,
  sRefreshToken: async (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResponseType>("/api/auth/refresh-token", body),
  async cRefreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResponseType>(
      "/api/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const response = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return response;
  },

  register: async (body: RegisterBodyType) =>
    http.post<RegisterResponseType>("/api/auth/register", body),

  verifyEmail: async (body: VerifyEmailBodyType) =>
    http.post<MessageResponseType>("/api/auth/verify-email", body),

  resendVerifyEmailToken: async (body: ForgotPasswordBodyType) =>
    http.post<MessageResponseType>(
      `/api/auth/resend-verification-token/${body.email}`,
      body
    ),

  forgotPassword: async (body: ForgotPasswordBodyType) =>
    http.post<MessageResponseType>("/api/auth/forgot-password", body),

  resetPassword: async (resetToken: string, body: ResetPasswordBodyType) =>
    http.put<MessageResponseType>(
      `/api/auth/reset-password/${resetToken}`,
      body
    ),
};

export default auth;
