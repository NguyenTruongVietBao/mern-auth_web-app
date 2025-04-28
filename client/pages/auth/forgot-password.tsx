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
import { ForgotPasswordBody, ForgotPasswordBodyType } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputCustom from "@/components/shared/input-custom";
import { Loader } from "lucide-react";
import {useForgotPasswordMutation} from "@/queries/useAuth";
import {toast} from "sonner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const forgotPasswordMutation = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBody),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordBodyType) {
    try {
      setLoading(true);
      const res = await forgotPasswordMutation.mutateAsync(values);
      if (res?.payload?.success) {
        setError(null);
        setLoading(false);
        toast('Check your email for the reset password link',{
          action: {
            label: 'Go to email',
            onClick: () => {
              window.open('https://mail.google.com', '_blank');
            },
          }
        })
      }
    } catch (error) {
      setError("Error sending email");
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputCustom placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && (
            <div>
              <div className="text-red-500 text-sm">
                {error}
              </div>
            </div>
          )}
          <Button type={"submit"} disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
