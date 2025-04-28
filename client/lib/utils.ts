import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import { UseFormSetError } from 'react-hook-form'
import {toast} from "sonner";
import { HttpError} from "@/lib/http";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// export const handleErrorApi = ({error, setError, duration}: {
//     error: any;
//     setError?: UseFormSetError<any>;
//     duration?: number;
// }) => {
//     if (error instanceof EntityError && setError) {
//         setError("password", {
//             type: "server",
//             message: error.payload.error,
//         });
//     } else if (error instanceof HttpError) {
//         toast("Error", {
//             description: error.payload?.error || error.payload?.message || "Request failed",
//             duration: duration ?? 5000,
//         });
//     } else {
//         toast("Error", {
//             description: "An unexpected error occurred",
//             duration: duration ?? 5000,
//         });
//     }
// };