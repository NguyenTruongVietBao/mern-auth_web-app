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
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import InputCustom from "../input-custom";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setLoading(true);
    console.log(values);
    try {
      const res = await axios.post(`http://localhost:8080/api/auth/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (res.data.success === true) {
        router.push("/auth/verify-email");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  }

  return (
    <Card className={"w-[450px] shadow-md mx-auto mt-10 p-4"}>
      <CardHeader className={"text-2xl font-bold text-center"}>
        Register
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
          <Button type={"submit"}>Submit</Button>
        </form>
        <p className="text-center">
          Already have an account?
          <Link href={"/auth/login"}>
            <b> Login</b>
          </Link>
        </p>
      </Form>
    </Card>
  );
}
