import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { privateRoutes } from "./routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.includes("/auth");
  const isApiRoute = nextUrl.pathname.includes("/api");

  if (isApiRoute) {
    return;
  }
  if (isAuthRoute && isLoggedIn) {
    // return Response.redirect(new URL("/", nextUrl));
    return Response.redirect("http://localhost:3000/dashboard");
  }
  if (isAuthRoute && !isLoggedIn) {
    // return Response.redirect(new URL("/auth/login", nextUrl));
    return;
  }

  if (isPrivateRoute && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/ static|_next/ image|favicon. ico).*)"],
};
