import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, StyleSheet, Pressable} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuthStore} from "@/stores/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect, useRouter} from "expo-router";

export default function ProfileScreen() {
    const router = useRouter();
    const {userData, logout, jwtToken} = useAuthStore();
    const [token, setToken] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            const fetchToken = async () => {
                const accessToken = await AsyncStorage.getItem("accessToken");
                setToken(accessToken);
            };
            fetchToken();
        }, [token]));
    console.log("Token from AsyncStorage !", token);


    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/login");
        } catch (error) {
            console.error("Logout error", error);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{userData?.name || "N/A"}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userData?.email || "N/A"}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Role:</Text>
                <Text style={styles.value}>{userData?.role || "N/A"}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Verified:</Text>
                <Text style={styles.value}>{userData?.isVerified ? "Yes" : "No"}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.value}>{token}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.value}>{jwtToken}</Text>
            </View>
            <Pressable>
                <Text className={"text-blue-500"} onPress={() => handleLogout()}>Logout</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        width: 100,
    },
    value: {
        fontSize: 16,
        color: "gray",
    },
});