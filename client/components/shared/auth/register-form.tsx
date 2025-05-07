"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {RegisterBody, RegisterBodyType} from "@/schemas";
import Link from "next/link";
import {Card, CardHeader} from "@/components/ui/card";
import InputCustom from "../input-custom";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Loader} from "lucide-react";
import {useRegisterMutation} from "@/queries/useAuth";
import {toast} from "sonner";
import {HttpError} from "@/lib/http";


export function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const registerMutation = useRegisterMutation();
    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: RegisterBodyType) => {
        setLoading(true);
        try {
            const result = await registerMutation.mutateAsync(values);
            console.log("result register-form", result);
            if(result.payload.success) {
              setError(null);
              setSuccess(result.payload.message)
              router.push("/verify-email?email="+encodeURIComponent(values.email));
              toast('Register Successful',{
                  description: 'Verify your account to login',
                  action: {
                      label: 'Verify now',
                      onClick: () => {
                          router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
                      },
                  },
              })
            }
        } catch (error) {
          if (error instanceof HttpError) {
            console.log(`ERROR register-form: ${error}`);
            setError(error.getMessage());
          } else {
            console.log('Unexpected error:', error);
          }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className={"w-[450px] shadow-md mx-auto mt-10 p-4"}>
            <CardHeader className={"text-2xl font-bold text-center"}>
                Register Form
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (error) => {
                    console.log(error);
                })} className="space-y-8">
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe@gmail.com" {...field} />
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
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
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
                    {error && (
                        <div className="text-red-500 text-center text-sm font-bold">
                            {error}
                        </div>
                    )}
                  {success && (
                    <div className="text-green-500 text-center text-sm font-bold">
                      {success}
                    </div>
                  )}
                    <Button type={"submit"} className={'cursor-pointer'}>
                        {loading ? <Loader className="animate-spin"/> : "Submit"}
                    </Button>
                </form>
                <p className="text-center">
                    Already have an account?
                    <Link href={"/login"}>
                        <b> Login</b>
                    </Link>
                </p>
            </Form>
        </Card>
    );
}
