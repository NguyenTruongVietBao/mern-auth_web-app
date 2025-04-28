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

export const LogoutBody = z.object({
    refreshToken: z.string().min(6, {
        message: "Refresh token is required",
    }),
})
export type LogoutBodyType = z.infer<typeof LogoutBody>;

export const LogoutResponse = z.object({
    success: z.boolean(),
    message: z.string()
})
export type LogoutResponseType = z.infer<typeof LogoutResponse>;

export const LoginResponse = z.object({
    data: z.object({
        accessToken: z.string(),
        refreshToken: z.string()
    }),
    message: z.string()
})
export type LoginResponseType = z.infer<typeof LoginResponse>


export const RegisterBody = z
    .object({
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
export type RegisterResponseType = z.infer<typeof RegisterResponse>


export const VerifyEmailBody = z
    .object({
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
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;
