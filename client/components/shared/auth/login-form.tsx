"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {LoginBody, LoginBodyType} from "@/schemas";
import Link from "next/link";
import InputCustom from "../input-custom";
import {Card, CardHeader} from "@/components/ui/card";
import Social from "./social";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Loader} from "lucide-react";
import {useLoginMutation} from "@/queries/useAuth";
import {toast} from "sonner";

export function LoginForm() {
    const router = useRouter();
    const loginMutation = useLoginMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginBodyType) => {
        setLoading(true);
        try {
            const result = await loginMutation.mutateAsync(data);
            console.log("result from next server", result);

            if(result.payload?.status === 400) {
                setError(result.payload?.payload?.message);
                return;
            }else if(result.payload?.status === 401) {
                setError(result.payload?.payload?.message);
                return;
            }else if (result.payload?.status === 403) {
                setError(result.payload?.payload?.message);
                toast("Unactive account", {
                    description: result.payload?.payload?.message,
                    action: {
                        label: "Activate now",
                        onClick: () => {
                            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
                        },
                    },
                })
                return;
            }
            const accessToken = result?.payload?.data?.accessToken;
            localStorage.setItem("accessToken", accessToken);

            toast("Login Successful")

            router.push("/dashboard");

        } catch (error) {
            setError('An error occurred while logging in');
        } finally {
            setLoading(false);
        }
    };
    // toast("Forbidden", {
    //     description: error.payload?.error || "Account not activated",
    //     action: {
    //         label: "Activate now",
    //         onClick: () => {
    //             router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
    //         },
    //     },
    //     duration: 5000,
    // });
    return (
        <Card className={"w-[450px] shadow-md mx-auto mt-10 p-4"}>
            <CardHeader className={"text-2xl font-bold text-center"}>
                Login
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (error)=>{
                    console.log('error', error)
                })} className="space-y-8">
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <InputCustom placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            isPassword={true}
                                            placeholder="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <Button size="sm" variant="link" className={"text-sm px-0"} asChild>
                            <Link href={"/forgot-password"}>Forgot Password?</Link>
                        </Button>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button
                        type={"submit"}
                        className={"cursor-pointer"}
                        disabled={loading}
                    >
                        {loading ? <Loader className="animate-spin"/> : "Submit"}
                    </Button>
                </form>
            </Form>
            <p className="text-center">
                Don't have an account?
                <Link href={"/register"}>
                    <b> Register</b>
                </Link>
            </p>
            <Social/>
        </Card>
    );
}
