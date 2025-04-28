import {useMutation} from "@tanstack/react-query";
import authApiRequest from "@/apiRequest/authApiRequest";
import {ResetPasswordBodyType} from "@/schemas";

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.cLogin
    });
}

export const useLogoutMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.cLogout
    });
}

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.register
    });
}

export const useVerifyEmailMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.verifyEmail
    });
}

export const useResendVerifyEmailTokenMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.resendVerifyEmailToken
    });
}

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.forgotPassword
    });
}

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: ({ resetToken, body }: { resetToken: string, body: ResetPasswordBodyType }) =>
          authApiRequest.resetPassword(resetToken, body)
    });
}