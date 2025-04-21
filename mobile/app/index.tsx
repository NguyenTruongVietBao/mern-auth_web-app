import React, {useCallback, useEffect} from 'react';
import {Text, View} from "react-native";
import {Button, ButtonText} from "@/components/ui/button";
import {Link, useFocusEffect, useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {VStack} from "@/components/ui/vstack";

const JWT_TOKEN = "@jwtToken";

function WelcomeScreen() {
    const router = useRouter();
    useFocusEffect(
        useCallback(() => {
            const fetchToken = async () => {
                const accessToken = await AsyncStorage.getItem("accessToken");
                if (accessToken) {
                    // Navigate to main app
                    router.replace("/(tabs)");
                } else {
                    // Navigate to login
                    router.replace("/login");
                }
            };
            fetchToken();
        }, []));
    return (
        <View className="h-full bg-white">
            <View className={'my-auto p-5'}>
                <Text className={'text-4xl font-bold text-center mb-5'}>Welcome to MyApp</Text>
                <VStack space={"xl"}>
                    <Button size="xl" variant="solid" action="primary">
                        <Link href={'/(auth)/login'}>
                            <ButtonText>Login to Continue</ButtonText>
                        </Link>
                    </Button>
                    <Button size="xl" variant="solid" action="primary">
                        <Link href={'/(auth)/login'}>
                            <ButtonText>Register new Account</ButtonText>
                        </Link>
                    </Button>
                </VStack>
            </View>
        </View>
    );
}

export default WelcomeScreen;