import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// Define protected and unprotected paths
const privatePaths = ["/dashboard", "/settings", "/profile"];
const publicPaths = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPrivatePath = privatePaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}`)
  );
  const isPublishPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}`)
  );

  // Chưa đăng nhập
  if (isPrivatePath && !refreshToken) {
    const url = new URL("/login", req.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // Đã đăng nhập
  if (isPublishPath && refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Đăng nhập rồi nhưng Access Token hết hạn
  if (isPrivatePath && !accessToken && refreshToken) {
    console.log("Access Token hết hạn");
    const url = new URL("/refresh-token", req.url);
    url.searchParams.set("refreshToken", refreshToken);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // if (isPrivatePath && refreshToken) {
  //   try {
  //     if (accessToken) {
  //       const decodedAccessToken = jwtDecode(accessToken) as { exp: number };
  //       const isAccessTokenExpired = decodedAccessToken.exp < Date.now() / 1000;

  //       if (isAccessTokenExpired) {
  //         console.log("Access Token hết hạn");
  //         const url = new URL("/api/auth/refresh-token", req.url);
  //         return NextResponse.redirect(url);
  //       }
  //     } else {
  //       // Không có access token nhưng có refresh token
  //       const url = new URL("/api/auth/refresh-token", req.url);
  //       return NextResponse.redirect(url);
  //     }
  //   } catch (error) {
  //     console.error("Token decode error:", error);
  //     // Nếu có lỗi decode token, xóa cookies và redirect về login
  //     const response = NextResponse.redirect(new URL("/login", req.url));
  //     response.cookies.delete("accessToken");
  //     response.cookies.delete("refreshToken");
  //     return response;
  //   }
  // }
  return NextResponse.next();
}

// Update matcher to include ALL paths you want the middleware to run on
export const config = {
  matcher: [
    "/dashboard",
    "/settings",
    "/profile",
    "/login",
    "/logout",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
};
