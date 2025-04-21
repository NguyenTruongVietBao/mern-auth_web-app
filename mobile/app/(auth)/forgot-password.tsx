import React, {useState} from "react";
import {View, Text, TextInput, Button, Alert, StyleSheet} from "react-native";
import {useAuthStore} from "@/stores/useAuthStore";
import {Link} from "expo-router";

export default function ForgotPasswordScreen() {
    const {forgotPassword} = useAuthStore();
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        try {
            const res = await forgotPassword(email);
            if (res.success) {
                Alert.alert("Success", "Reset link sent to your email.");
                return;
            }
        } catch (err: any) {
            console.log(err.response?.data || err.message);
            Alert.alert("Error", err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button title="Send Reset Link" onPress={handleSubmit}/>
            <Link href={'/(auth)/reset-password?token=123'}>Reset</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: "center", padding: 20},
    title: {fontSize: 24, marginBottom: 20, textAlign: "center"},
    input: {borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 20, borderRadius: 8},
});
