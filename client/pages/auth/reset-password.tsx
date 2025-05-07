"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useState } from "react";
import {ResetPasswordBody, ResetPasswordBodyType} from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputCustom from "@/components/shared/input-custom";
import { Loader } from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import { toast } from "sonner"
import {useResetPasswordMutation} from "@/queries/useAuth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const resetPasswordMutation = useResetPasswordMutation();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const token = searchParams?.get('token');
  const email = searchParams?.get('email');

  const form = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBody),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordBodyType) {
    setLoading(true);
    console.log('values', values)
    try {
      if (!token) {
        setError("Missing reset token");
        setLoading(false);
        return;
      }
      const res = await resetPasswordMutation.mutateAsync({
        resetToken: token,
        body: values
      });
        if (res?.payload?.message) {
          setLoading(false);
          setError(null as any);
          toast("Password reset successfully !")
          router.push('/login')
        }
    } catch (error) {
      setError("Error while resetting password");
      setLoading(false);
    }
  }

  return (
    <Card className="relative overflow-hidden max-w-[350px] w-full mx-auto mt-10">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email to reset password
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-5">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputCustom
                      isPassword={true}
                      placeholder="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <InputCustom
                      isPassword={true}
                      placeholder="confirmPassword"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}
          <Button type={"submit"} disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
