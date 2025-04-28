import {cookies} from "next/headers";
import {LoginBodyType} from "@/schemas";
import authApiRequest from "@/apiRequest/authApiRequest";
import {jwtDecode} from "jwt-decode";

export async function POST(request: Request) {
    const body = (await request.json()) as LoginBodyType
    try {
        const result = await authApiRequest.sLogin(body)

        if (result.status !== 200) {
            return Response.json(result.payload, {status: result.status})
        }

        const refreshToken = result.payload.data.refreshToken;
        const decodedRefreshToken = jwtDecode(refreshToken) as { exp: number };

        (await cookies()).set('refreshToken', refreshToken, {
            'path': '/',
            'httpOnly': true,
            'sameSite': 'lax',
            'secure': process.env.NODE_ENV === 'production',
            'maxAge': decodedRefreshToken.exp * 1000
        })

        return Response.json(result.payload)

    } catch (error) {
        console.error("error", error);
        return Response.json(error);
    }
}