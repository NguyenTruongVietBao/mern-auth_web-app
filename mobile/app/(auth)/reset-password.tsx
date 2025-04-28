import {useRouter, useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {View, Text, TextInput, Button, Alert} from "react-native";
import axios from "axios";

export default function ResetPasswordScreen() {
    const {token} = useLocalSearchParams(); // <-- get token from URL
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleReset = async () => {
        try {

            Alert.alert("Success", "Password reset successfully");
            router.replace("/login");
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Reset failed");
        }
    };

    return (
        <View style={{padding: 20}}>
            <Text>Enter new password</Text>
            <TextInput
                secureTextEntry
                placeholder="New password"
                value={password}
                onChangeText={setPassword}
                style={{borderBottomWidth: 1, marginBottom: 20}}
            />
            <Button title="Reset Password" onPress={handleReset}/>
        </View>
    );
}
