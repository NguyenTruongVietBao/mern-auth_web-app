import React from 'react';
import {Button, ButtonText} from "@/components/ui/button";

interface ButtonCustomProps {
    size: any,
    text: string,
    className: string,
    onPress?: () => void;
}
function ButtonCustom({text, onPress, size, className}: ButtonCustomProps) {
    return (
        <Button size={size} className={className} onPress={onPress}>
            <ButtonText>{text}</ButtonText>
        </Button>
    );
}

export default ButtonCustom;