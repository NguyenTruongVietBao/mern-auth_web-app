import {create} from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

let BACKEND_URL = "http://192.168.1.5:8080";
let JWT_TOKEN = "@jwtToken";

type AuthStore = {
    userData: any;
    jwtToken: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    login: (email: string, password: string) => Promise<
        | { success: true; data: any }
        | { success: false; message: string }
    >;
    verifyEmail: (pin: string) => Promise<
        | { success: true; data: any }
        | { success: false; message: string }
    >;
    forgotPassword: (email: string) => Promise<
        | { success: true; data: any }
        | { success: true; message: string }
        | { success: false; message: string }
    >;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
    userData: null,
    jwtToken: null,
    isLoggedIn: false,
    isLoading: false,

    register: async (name: string, email: string, password: string) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/auth/register`, {
                name,
                email,
                password,
            });
            if (res.data.error) {
                return {success: false, message: res.data.error};
            }
            return {success: true, message: res.data.message};
        } catch (error: any) {
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.error,
                };
            }
            return {
                success: false,
                message: "Something went wrong. Please try again.",
            };
        }
    },

    login: async (email: string, password: string) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
                email,
                password,
            });
            set({isLoggedIn: true});
            set({userData: res.data.user});
            set({jwtToken: res.data.accessToken});
            await AsyncStorage.setItem('accessToken', res.data.accessToken);
            return {success: true, data: res.data};
        } catch (error: any) {
            set({isLoggedIn: false});
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.error,
                };
            }
            return {
                success: false,
                message: "Something went wrong. Please try again.",
            };
        }
    },

    verifyEmail: async (pin: string) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/auth/verify-email`, {
                verificationToken: pin,
            });
            if (res.data.error) {
                return {success: false, message: res.data.error};
            }
            return {success: true, data: res.data};
        } catch (error: any) {
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.error,
                };
            }
            return {
                success: false,
                message: "Something went wrong. Please try again.",
            };
        }
    },

    forgotPassword: async (email: string) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/auth/forgot-password-mobile`, {
                email,
            });
            if (res.data.error) {
                return {success: false, message: res.data.error};
            }
            return {success: true, message: res.data.message};
        } catch (error: any) {
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.error,
                };
            }
            return {
                success: false,
                message: "Something went wrong. Please try again.",
            };
        }
    },

    logout: async () => {
        try {
            set({userData: null});
            set({jwtToken: null});
            set({isLoggedIn: false});
            await AsyncStorage.removeItem('accessToken');
            console.log("Logged out successfully");
        } catch (error) {
            console.log(error);
        }
    },
}));
