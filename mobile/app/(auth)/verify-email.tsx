import React from "react";
import {VStack} from "@/components/ui/vstack";
import {Heading} from "@/components/ui/heading";
import {Controller, useForm} from "react-hook-form";
import InputCustom from "@/components/common/auth/input-custom";
import ButtonCustom from "@/components/common/auth/button-custom";
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText
} from "@/components/ui/form-control";
import {AlertTriangle} from "lucide-react-native";
import {Toast, ToastDescription, ToastTitle, useToast} from "@/components/ui/toast";
import axios from "axios";
import {useRouter} from "expo-router";
import {useAuthStore} from "@/stores/useAuthStore";

type VerifyForm = {
    pin: string;
};

export default function VerifyEmailScreen() {
    const toast = useToast();
    const {verifyEmail} = useAuthStore();
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<VerifyForm>({
        defaultValues: {
            pin: "",
        },
    });

    const onSubmit = async (data: VerifyForm) => {
        try {
            const res = await verifyEmail(data.pin);
            console.log("Login response", res);
            if (res.success) {
                toast.show({
                    placement: "top",
                    duration: 2000,
                    render: () => (
                        <Toast action="muted" variant="solid">
                            <ToastTitle>Email Verified</ToastTitle>
                            <ToastDescription>Your email has been successfully verified!</ToastDescription>
                        </Toast>
                    ),
                    onCloseComplete: () => {
                        router.replace("/login");
                    },
                });
            } else {
                alert(res.message || "Verification failed.");
            }
        } catch (error: any) {
            console.log("Verify error", error);
            alert(
                error?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <VStack className="px-5 h-full bg-white justify-center" space="lg">
            <VStack className="items-center">
                <Heading size="2xl">Verify Email</Heading>
            </VStack>
            <FormControl isInvalid={!!errors?.pin}>
                <FormControlLabel>
                    <FormControlLabelText>Enter OTP</FormControlLabelText>
                </FormControlLabel>
                <Controller
                    name="pin"
                    control={control}
                    rules={{required: "OTP is required"}}
                    render={({field: {onChange, onBlur, value}}) => (
                        <InputCustom
                            type="number"
                            placeholder="Enter OTP code"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                        />
                    )}
                />
                <FormControlError>
                    <AlertTriangle size={16}/>
                    <FormControlErrorText>
                        {errors?.pin?.message}
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>

            <ButtonCustom
                text="Verify"
                size="xl"
                className="w-full mt-6"
                onPress={handleSubmit(onSubmit)}
            />
        </VStack>
    );
}
