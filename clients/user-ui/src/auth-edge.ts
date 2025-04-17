import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// 不使用 PrismaAdapter，仅 JWT 用于 Edge
export const { auth } = NextAuth(authConfig);
