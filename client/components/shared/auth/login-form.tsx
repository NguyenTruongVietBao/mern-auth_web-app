"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import Link from "next/link";
import InputCustom from "../input-custom";
import { Card, CardHeader } from "@/components/ui/card";
import Social from "./social";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";

export function LoginForm() {
    
    const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        console.log(result.error);
        return;
      }
      console.log(result);
      // code: null;
      // error: null;
      // ok: true;
      // status: 200;
      // url: "http://localhost:3000/auth/login";

      router.push("/dashboard");
      // router.refresh();
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <Card className={"w-[450px] shadow-md mx-auto mt-10 p-4"}>
      <CardHeader className={"text-2xl font-bold text-center"}>
        Login
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Button
                    size="sm"
                    variant="link"
                    className={"text-sm px-0"}
                    asChild
                  >
                    <Link href={"/auth/reset-password"}>Forgot Password?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type={"submit"} disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : "Submit"}
          </Button>
        </form>

        <p className="text-center">
          Don't have an account?
          <Link href={"/auth/register"}>
            <b>Register</b>
          </Link>
        </p>
        <Social />
      </Form>
    </Card>
  );
}
