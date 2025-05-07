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
            console.log("Login Response: ", result);

            if(result.payload.status === 400 || result.payload?.status === 401) {
                setError(result.payload?.payload?.message || "Invalid Credentials");
                return;
            }else if (result.payload.status === 403) {
                setError(result.payload?.payload?.message || "Account is unactive.");
                toast("Unactive account", {
                    description: result.payload.payload?.message,
                    action: {
                        label: "Activate now",
                        onClick: () => {
                            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
                        },
                    },
                })
                return;
            }
            toast("Login Successful")
            router.push("/profile");
        } catch (error) {
            console.log('ERROR login-form: ', error);
            setError('ERROR login-form');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Card className={"w-[450px] shadow-md mx-auto mt-10 p-4"}>
            <CardHeader className={"text-2xl font-bold text-center"}>
                Login Form
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
                                        <InputCustom placeholder="johndoe@gmail.com" {...field} />
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
                                            placeholder="******"
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
