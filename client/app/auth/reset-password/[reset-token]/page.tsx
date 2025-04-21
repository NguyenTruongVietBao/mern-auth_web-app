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
import { ResetPasswordSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputCustom from "@/components/shared/input-custom";
import { Loader } from "lucide-react";
import { z } from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner"

export default function ResetPassword() {
    const params = useParams()
    const resetToken = params['reset-token']
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
        try {
            setLoading(true);
            console.log(values.password);
            const res = await axios.put(`http://localhost:8080/api/auth/reset-password/${resetToken}`, {
                password: values.password
            });
            if (res) {
                toast("Reset password", {
                    description: "Password reset successfully !",
                    action: {
                        label: "Login now",
                        onClick: () => router.push('/auth/login'),
                    },
                })
            }
            setLoading(false);
        } catch (error) {
            alert("An error occurred. Please try again.");
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
                    <Button type={"submit"} disabled={loading}>
                        {loading ? <Loader className="animate-spin" /> : "Submit"}
                    </Button>
                </form>
            </Form>
        </Card>
    );
}
