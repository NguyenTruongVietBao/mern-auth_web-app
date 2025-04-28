"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {VerifyEmailBody, VerifyEmailBodyType} from "@/schemas";
import {toast} from "sonner";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {useResendVerifyEmailTokenMutation, useVerifyEmailMutation} from "@/queries/useAuth";
import {Loader} from "lucide-react";

export default function VerifyEmailPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || null;
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const resendVerifyEmailTokenMutation = useResendVerifyEmailTokenMutation();
    const verifyEmailMutation = useVerifyEmailMutation();

    const form = useForm<VerifyEmailBodyType>({
        resolver: zodResolver(VerifyEmailBody),
        defaultValues: {
            verificationToken: "",
        },
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        setIsResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    async function onSubmit(data: VerifyEmailBodyType) {
        setLoading(true);
        try {
            const res = await verifyEmailMutation.mutateAsync({
                verificationToken: data.verificationToken,
            })
            console.log('res', res);
            if (res?.payload?.success) {
                setError(null);
                setLoading(false);
                toast("Your account verified !",{
                    description: "Login to continue"
                });
                router.push("/login");
            }

        } catch (error) {
            setError("Invalid or expired token");
            console.log(error);
        }
    }

    async function handleResend() {
        if (isResendDisabled) return;
        try {
            setIsResendDisabled(true);
            setCountdown(30);
            toast("Verification token resent!", {
                description: "Check your email",
            });
            await resendVerifyEmailTokenMutation.mutateAsync({email: email as string});
        } catch (error) {
            setError("Failed to resend verification token");
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-72 space-y-6 flex-col mx-auto mt-10 border border-gray-200 p-5 rounded-md"
            >
                <FormField
                    control={form.control}
                    name="verificationToken"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>One-Time Password</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0}/>
                                        <InputOTPSlot index={1}/>
                                        <InputOTPSlot index={2}/>
                                        <InputOTPSlot index={3}/>
                                        <InputOTPSlot index={4}/>
                                        <InputOTPSlot index={5}/>
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription className={`cursor-pointer ${isResendDisabled ? 'text-gray-400' : 'text-blue-600 hover:underline'}`}
                                                      onClick={handleResend}>
                                {isResendDisabled ? `Resend Token (${countdown}s)` : 'Resend Token'}
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {error && (
                    <div>
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    </div>
                )}
                <Button type={"submit"} className={'cursor-pointer'}>
                    {loading ? <Loader className="animate-spin"/> : "Submit"}
                </Button>
            </form>
        </Form>
    );
}
