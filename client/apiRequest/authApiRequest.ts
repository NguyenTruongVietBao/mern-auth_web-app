import {
    ForgotPasswordBodyType,
    LoginBodyType, LoginResponseType, LogoutBodyType, LogoutResponseType,
    RegisterBodyType, ResetPasswordBodyType,
    VerifyEmailBodyType
} from "@/schemas";
import http from "@/lib/http";

const authApiRequest = {
    sLogin: async (body: LoginBodyType) => http.post<LoginResponseType>("/api/auth/login", body),
    cLogin: async (body: LoginBodyType) => http.post("/api/auth/login", body, {
        baseUrl: ''
    }),

    sLogout: async () => http.post("/api/auth/logout", null),
    cLogout: async () => http.post("/api/auth/logout", null, {
        baseUrl: ''
    }),

    register: async (body: RegisterBodyType) => http.post("/api/auth/register", body),

    verifyEmail: async (body: VerifyEmailBodyType) => http.post("/api/auth/verify-email", body),

    resendVerifyEmailToken: async (body: ForgotPasswordBodyType) =>
      http.post(`/api/auth/resend-verification-token/${body.email}`, body),

    forgotPassword: async (body: ForgotPasswordBodyType) =>
      http.post<{message: string}>("/api/auth/forgot-password", body),

    resetPassword: async (resetToken: string, body: ResetPasswordBodyType) =>
      http.put<{message: string}>(`/api/auth/reset-password/${resetToken}`, body)
}

export default authApiRequest;