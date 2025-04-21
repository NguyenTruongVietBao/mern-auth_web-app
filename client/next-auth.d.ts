import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      _id: string;
      name: string;
      email: string;
      role: string;
      isVerified: boolean;
      createdAt: string;
      updatedAt: string;
    } & DefaultSession["user"];
  }

  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      _id: string;
      name: string;
      email: string;
      role: string;
      isVerified: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }
}
