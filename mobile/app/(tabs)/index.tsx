import React from 'react';
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuthStore} from "@/stores/useAuthStore";

function HomeScreen() {
    const {userData, jwtToken} = useAuthStore();

    return (
        <SafeAreaView className={'flex-1 h-full bg-white'}>
            <Text className={"text-2xl font-bold"}>Home Screen</Text>
            <Text className={""}>{JSON.stringify(userData, null, 4)}</Text>
            <Text className={""}>{JSON.stringify(jwtToken)}</Text>

        </SafeAreaView>
    );
}

export default HomeScreen;