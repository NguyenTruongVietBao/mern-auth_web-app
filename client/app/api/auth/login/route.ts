import { cookies } from "next/headers";
import { LoginBodyType } from "@/schemas";
import auth from "@/apiRequest/auth";
import { jwtDecode } from "jwt-decode";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = (await request.json()) as LoginBodyType;

    // Gọi API login
    const result = await auth.sLogin(body);

    // Lấy token từ response
    const refreshToken: string = result.payload.data.refreshToken;
    const accessToken: string = result.payload.data.accessToken;

    // Giải mã token để lấy thời gian hết hạn
    const decodedRefreshToken = jwtDecode(refreshToken) as { exp: number };
    const decodedAccessToken = jwtDecode(accessToken) as { exp: number };

    // Lưu token vào cookies
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(decodedAccessToken.exp * 1000),
    });

    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(decodedRefreshToken.exp * 1000),
    });

    return Response.json(result.payload);
  } catch (error) {
    console.error("ERROR at NextServer Login:", error);
  }
}
