import "server-only";
import { NextAuthConfig, Session } from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const refreshAccessToken = async (token: any) => {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_CLIENT_ID || "",
        client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET || "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
    const refreshedTokens = await response.json();
    // 根据 google 文档解释：刷新令牌仅在用户首次授权您的应用时返回，除非您每次都包含prompt=consent参数
    // 用户撤销授权重新登录或更改了 scope 时会更新 refresh_token
    const { access_token, refresh_token, expires_in } = refreshedTokens;
    return {
      ...token,
      accessToken: access_token,
      refreshToken: refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + expires_in * 1000,
    };
  } catch (error) {
    console.error("刷新 access token 失败", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

/**
 * Auth.js (NextAuth.js) Configuration
 *
 * @description 定义认证提供者和它们的配置
 * 此设置包括OAuth提供者（Google、Github、带有重发功能的magic-link）和基于凭证的认证
 *
 * 凭证提供者授权
 *
 * @description 所有验证逻辑都在登录服务器动作上完成
 */

export default {
  pages: {
    signIn: DEFAULT_LOGIN_REDIRECT, // 自定义登录页面路径，页面错误时会重定向到此路径
  },
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png", // 自定义主题 Logo
  },
  session: {
    strategy: "jwt",
    maxAge: 2592000, // 30 days
    updateAge: 86400, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      // allowDangerousEmailAccountLinking: true,
    }),
    // Github({
    //   clientId: process.env.AUTH_GITHUB_CLIENT_ID,
    //   clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
    // }),
    // Resend({
    //   apiKey: process.env.RESEND_API_KEY,
    //   from: 'noreply@fpresa.org',
    // })
  ],
  callbacks: {
    jwt: async ({ token, trigger, user, account, session }) => {
      if ((trigger === "signIn" || trigger === "signUp") && user) {
        // 查询用户信息
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { avatar: true },
        });

        if (dbUser) {
          token.picture = dbUser.avatar?.url; // 将头像 URL 添加到 token
        }
        token.email = user.email;
        token.isOauth = account?.provider !== "credentials";
        token.name = user.name;
        token.accessToken = account?.access_token;
        token.refreshToken = account?.refresh_token;
        token.accessTokenExpires =
          Date.now() + (account?.expires_in as number) * 1000; // 设置令牌过期时间 默认为 1 小时
        // token.accessTokenExpires = Date.now() + 20 * 1000; // 设置令牌过期时间为 20 秒（仅用于测试刷新 access_token）
      }

      if (trigger === "update" && session) {
        token.name = session.user.name;
        return token;
      }

      // ⏰ 如果 accessToken 已过期，尝试刷新
      if (Date.now() >= ((token.accessTokenExpires as number) ?? 0)) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    // 会话回调，用于将 token 数据传递到 session
    session: async ({ session, token }) => {
      if (!token.sub) return session;
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? session.user.id,
          name: token.name ?? session.user.name ?? null,
          email: token.email ?? session.user.email ?? null,
          image: token.picture,
          isOauth: Boolean(token.isOauth),
          accessToken: token.accessToken,
          error: token.error,
        },
      } as Session;
    },
  },
  debug: process.env.NODE_ENV !== "production", // 在开发环境中启用调试
  trustHost: true,
} satisfies NextAuthConfig;
