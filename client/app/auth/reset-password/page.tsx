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
import { ForgotPasswordSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputCustom from "@/components/shared/input-custom";
import { Loader } from "lucide-react";
import { z } from "zod";
import axios from "axios";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
        try {
            setLoading(true);
            console.log(values);
            const res = await axios.post("http://localhost:8080/api/auth/forgot-password", {
                email: values.email
            });
            if (res) {
                setSuccess(true);
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
                    {success ? (
                        <p className="text-center text-green-600 font-semibold">
                            Check your email for a reset link.
                        </p>
                    ) : (<></>)}
                    <Button type={"submit"} disabled={loading}>
                        {loading ? <Loader className="animate-spin" /> : "Submit"}
                    </Button>
                </form>
            </Form>
        </Card>
    );
}
