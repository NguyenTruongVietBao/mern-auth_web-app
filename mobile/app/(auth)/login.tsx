import {VStack} from "@/components/ui/vstack";
import React, {useCallback, useEffect, useState} from "react";
import {Alert, Pressable, Text} from "react-native";
import {Link, useFocusEffect, useRouter} from "expo-router";
import {useAuthStore} from "@/stores/useAuthStore";
import {LoginSchema} from "@/schemas";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function LoginScreen() {
    const [token, setToken] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const {login} = useAuthStore();
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "a.baocute0204@gmail.com",
            password: "123123"
        }
    });

    useFocusEffect(
        useCallback(() => {
            const fetchToken = async () => {
                const accessToken = await AsyncStorage.getItem("accessToken");
                setToken(accessToken);
            };
            fetchToken();
        }, [token]));
    console.log("Token from AsyncStorage: ", token);

    const handleShowPassword = () => {
        setShowPassword((showState) => {
            return !showState;
        });
    };

    const onSubmit = async (data: LoginSchemaType) => {
        console.log('Form data', data)
        try {
            const res = await login(data.email, data.password);
            console.log("Login response", res);
            if (!res.success) {
                Alert.alert("Login failed", res.message);
            } else {
                router.replace("/(tabs)");
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
                        Log in
                    </Heading>
                    <Text>Login to start using Gluestack</Text>
                </VStack>
            </VStack>
            {/*Body*/}
            <VStack>
                {/*Form*/}
                <VStack space="xl" className="w-full">
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
                    {/*Forgot password*/}
                    <HStack className="w-full justify-between ">
                        <Link href="/forgot-password">
                            <Text className="font-medium text-sm text-primary-700 group-hover/link:text-primary-600">
                                Forgot Password?
                            </Text>
                        </Link>
                    </HStack>
                </VStack>
                {/*Log in button*/}
                <VStack className="w-full my-7" space="lg">
                    <ButtonCustom
                        text={'Log in'}
                        size={'xl'}
                        onPress={handleSubmit(onSubmit)}
                        className={'w-full'}
                    />
                    <HStack className={'justify-between'}>
                        <SocialLogin
                            text={'Login with Google'}
                            iconName={'google'}
                            onPress={() => {
                            }}
                        />
                        <SocialLogin
                            text={'Login with Facebook'}
                            iconName={'facebook-square'}
                            onPress={() => {
                            }}
                        />
                    </HStack>
                </VStack>
                {/*Don't have an account?*/}
                <HStack className="self-center ">
                    <Text className={'text-md'}>Don't have an account?</Text>
                    <Link href={"/(auth)/register"}>
                        <Text
                            className="font-medium text-primary-700 ml-1 group-hover/link:text-primary-600  group-hover/pressed:text-primary-700"
                        >
                            Sign up
                        </Text>
                    </Link>
                </HStack>
            </VStack>
        </VStack>
    );
}
