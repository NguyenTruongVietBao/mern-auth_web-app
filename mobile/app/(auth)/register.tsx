import {VStack} from "@/components/ui/vstack";
import React, {useState} from "react";
import {Alert, Pressable, Text} from "react-native";
import {Link, useRouter} from "expo-router";
import {useAuthStore} from "@/stores/useAuthStore";
import {RegisterSchema} from "@/schemas";
import * as z from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod/src";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText, FormControlHelper, FormControlHelperText,
    FormControlLabel,
    FormControlLabelText,
} from "@/components/ui/form-control";
import {AlertTriangle} from "lucide-react-native";
import {HStack} from "@/components/ui/hstack";
import {
    ArrowLeftIcon,
    Icon,
} from "@/components/ui/icon";
import {Heading} from "@/components/ui/heading";
import SocialLogin from "@/components/common/auth/social-login";
import ButtonCustom from "@/components/common/auth/button-custom";
import InputCustom from "@/components/common/auth/input-custom";
import {
    useToast,
    Toast,
    ToastTitle,
    ToastDescription,
} from "@/components/ui/toast"

type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export default function RegisterScreen() {
    const toast = useToast()
    const [showPassword, setShowPassword] = useState(false);
    const {register} = useAuthStore();
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "VietBao",
            email: "a.baocute0204@gmail.com",
            password: "123123",
            confirmPassword: ""
        }
    });

    const handleShowPassword = () => {
        setShowPassword((showState) => {
            return !showState;
        });
    };

    const onSubmit = async (data: RegisterSchemaType) => {
        console.log('Form data', data)
        try {
            const res = await register(data.name, data.email, data.password);
            console.log("Register response", res);
            if (!res.success) {
                Alert.alert("Register failed", res.message);
            } else {
                toast.show({
                    placement: "top",
                    duration: 2500,
                    onCloseComplete: () => {
                        router.replace("/verify-email")
                    },
                    render: () => (
                        <Toast action="muted" variant="solid">
                            <ToastTitle>Register successful</ToastTitle>
                            <ToastDescription>
                                Token has been sent to your email !
                            </ToastDescription>
                        </Toast>
                    ),

                })
            }
        } catch (error) {
            console.log("Login error", error);
        }
    };

    return (
        <VStack className="w-full h-full bg-white px-5" space="md">
            {/*Header*/}
            <VStack space="md">
                <Pressable onPress={() => {
                    router.back()
                }}>
                    <Icon
                        as={ArrowLeftIcon}
                        className="md:hidden text-background-800"
                        size="xl"
                    />
                </Pressable>
                <VStack className="items-center">
                    <Heading size="3xl">
                        Register
                    </Heading>
                    <Text>Register to start using Gluestack</Text>
                </VStack>
            </VStack>
            {/*Body*/}
            <VStack>
                {/*Form*/}
                <VStack space="xl" className="w-full">
                    {/*Name */}
                    <FormControl isInvalid={!!errors?.name}>
                        <FormControlLabel>
                            <FormControlLabelText>Name</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            name="name"
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <InputCustom
                                    type={"text"}
                                    placeholder={"Enter name"}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                            )}
                        />
                        <FormControlHelper>
                            <FormControlHelperText>
                                Your fullName.
                            </FormControlHelperText>
                        </FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertTriangle}/>
                            <FormControlErrorText>
                                {errors?.name?.message}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    {/*Email */}
                    <FormControl isInvalid={!!errors?.email}>
                        <FormControlLabel>
                            <FormControlLabelText>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            name="email"
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <InputCustom
                                    type={"email"}
                                    placeholder={"Enter email or phone number"}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                            )}
                        />
                        <FormControlHelper>
                            <FormControlHelperText>
                                Email or Phone number .
                            </FormControlHelperText>
                        </FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertTriangle}/>
                            <FormControlErrorText>
                                {errors?.email?.message}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    {/*Password*/}
                    <FormControl isInvalid={!!errors?.password}>
                        <FormControlLabel>
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            name="password"
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <InputCustom
                                    type="password"
                                    placeholder={"Enter password"}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    handleShowPassword={handleShowPassword}
                                    showPassword={showPassword}
                                />
                            )}
                        />
                        <FormControlHelper>
                            <FormControlHelperText>
                                Password at least 6 characters.
                            </FormControlHelperText>
                        </FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertTriangle}/>
                            <FormControlErrorText>
                                {errors?.password?.message}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    {/*Confirm Password*/}
                    <FormControl isInvalid={!!errors?.confirmPassword}>
                        <FormControlLabel>
                            <FormControlLabelText>Confirm Password</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <InputCustom
                                    type="password"
                                    placeholder={"Enter confirm password"}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    handleShowPassword={handleShowPassword}
                                    showPassword={showPassword}
                                />
                            )}
                        />
                        <FormControlHelper>
                            <FormControlHelperText>
                                Confirm your password.
                            </FormControlHelperText>
                        </FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertTriangle}/>
                            <FormControlErrorText>
                                {errors?.confirmPassword?.message}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                </VStack>
                {/*Log in button*/}
                <VStack className="w-full my-7" space="lg">
                    <ButtonCustom
                        text={'Register'}
                        size={'xl'}
                        onPress={handleSubmit(onSubmit)}
                        className={'w-full'}
                    />

                </VStack>
                {/*Already an account?*/}
                <HStack className="self-center ">
                    <Text className={'text-md'}>Already an account?</Text>
                    <Link href={"/login"}>
                        <Text
                            className="font-medium text-primary-700 ml-1 group-hover/link:text-primary-600  group-hover/pressed:text-primary-700"
                        >
                            Login
                        </Text>
                    </Link>
                </HStack>
            </VStack>
        </VStack>
    );
}
