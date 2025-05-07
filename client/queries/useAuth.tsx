import { useMutation } from "@tanstack/react-query";
import auth from "@/apiRequest/auth";
import { ResetPasswordBodyType } from "@/schemas";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: auth.cLogin,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: auth.cLogout,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: auth.register,
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: auth.verifyEmail,
  });
};

export const useResendVerifyEmailTokenMutation = () => {
  return useMutation({
    mutationFn: auth.resendVerifyEmailToken,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: auth.forgotPassword,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: ({
      resetToken,
      body,
    }: {
      resetToken: string;
      body: ResetPasswordBodyType;
    }) => auth.resetPassword(resetToken, body),
  });
};
