import React from "react";
import {Input, InputField, InputIcon, InputSlot} from "@/components/ui/input";
import {EyeIcon, EyeOffIcon} from "@/components/ui/icon";

interface InputCustomProps {
    value: string;
    showPassword?: boolean;
    handleShowPassword?: () => void;
    onChangeText: (text: string) => void;
    onBlur: () => void;
    placeholder: string;
    type: string;
}

export default function InputCustom({
                                        value,
                                        showPassword,
                                        handleShowPassword,
                                        onChangeText,
                                        onBlur,
                                        placeholder,
                                        type
                                    }: InputCustomProps) {
    const isPassword = type === "password";

    return (
        <Input className="my-1">
            <InputField
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                onBlur={onBlur}
                secureTextEntry={isPassword && !showPassword}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {isPassword && (
                <InputSlot onPress={handleShowPassword} className="pr-3">
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon}/>
                </InputSlot>
            )}
        </Input>
    );
}
