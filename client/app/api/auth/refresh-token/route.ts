import auth from "@/apiRequest/auth";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json(
      {
        success: false,
        message: "Không tìm thấy refreshToken",
      },
      { status: 401 }
    );
  }
  try {
    const result = await auth.sRefreshToken({ refreshToken });
    // result at Next Server {
    //   status: 200,
    //     payload: {
    //       success: true,
    //       data: {
    //         accessToken: 'eyJhbGciOiJIUzI1....',
    //         refreshToken: 'eyJhbGciOiJIUzI1...'
    //       }
    //     }
    // }
    const newRefreshToken = result.payload.data.refreshToken;
    const newAccessToken = result.payload.data.accessToken;

    const decodedRefreshToken = jwtDecode(newRefreshToken) as { exp: number };
    const decodedAccessToken = jwtDecode(newAccessToken) as { exp: number };

    cookieStore.set("accessToken", newAccessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: decodedAccessToken.exp * 1000,
    });

    cookieStore.set("refreshToken", newRefreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: decodedRefreshToken.exp * 1000,
    });

    return Response.json(result.payload);
  } catch (error) {
    console.error("ERROR at NextServer Login:", error);
  }
}
