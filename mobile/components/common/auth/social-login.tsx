import React from 'react';
import {Button, ButtonText} from "@/components/ui/button";
import {AntDesign} from "@expo/vector-icons";

interface SocialLoginProps {
    text: string;
    onPress: () => void,
    iconName: any
}

function SocialLogin({text, onPress, iconName}: SocialLoginProps) {
    return (
        <Button
            variant="outline"
            action="secondary"
            className="flex gap-2 items-center justify-center h-10 rounded-md "
            onPress={onPress}
        >
            <ButtonText className="font-medium">
                {text}
            </ButtonText>
            <AntDesign name={iconName} size={20} color="black" />
        </Button>
    );
}

export default SocialLogin;