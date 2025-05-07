import * as z from "zod";

export const LoginBody = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Password more than 6 characters",
    }),
}).strict();
export type LoginBodyType = z.infer<typeof LoginBody>;
export const LoginResponse = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        user: z.object({
            _id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.string(),
            isVerified: z.boolean(),
            createdAt: z.string(),
        }),
        accessToken: z.string(),
        refreshToken: z.string()
    }),
})
export type LoginResponseType = z.infer<typeof LoginResponse>;


export const LogoutBody = z.object({
    refreshToken: z.string()
});
export type LogoutBodyType = z.infer<typeof LogoutBody>;
export const LogoutResponse = z.object({
    success: z.boolean(),
    message: z.string()
})
export type LogoutResponseType = z.infer<typeof LogoutResponse>;


export const MessageResponse = z.object({
    status: z.number(),
    success: z.string(),
    message: z.string(),
    payload: z.object({
        success: z.string(),
        message: z.string()
    }).optional()
});
export type MessageResponseType = z.infer<typeof MessageResponse>;




export const RegisterBody = z.object({
        name: z.string()
            .min(3, {message: "Name at least 3 characters"})
            .max(30, {message: "Name less than 30 characters"}),
        email: z.string().email({message: "Invalid email"}),
        password: z.string().min(6, {message: "Password more than 6 characters"}),
        confirmPassword: z.string().min(6, {message: "Confirm Password more than 6 characters"}),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
export type RegisterBodyType = z.infer<typeof RegisterBody>;
export const RegisterResponse = z.object({
    success: z.boolean(),
    message: z.string()
})
export type RegisterResponseType = z.infer<typeof RegisterResponse>;


export const VerifyEmailBody = z.object({
        verificationToken: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
});
export type VerifyEmailBodyType = z.infer<typeof VerifyEmailBody>;


export const ForgotPasswordBody = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBody>;


export const ResetPasswordBody = z.object({
    password: z.string().min(6, {
        message: "Password more than 6 characters",
    }),
    confirmPassword: z.string().min(6, {message: "Confirm your password"}),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;


export const RefreshTokenBody = z.object({
    refreshToken: z.string()
});
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBody>;
export const RefreshTokenResponse = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        accessToken: z.string(),
        refreshToken: z.string()
    }),
})
export type RefreshTokenResponseType = z.infer<typeof RefreshTokenResponse>;
