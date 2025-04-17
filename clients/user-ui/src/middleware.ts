import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { auth } from "@/auth-edge";
import createIntlMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./utils/config";
import { NextRequest, NextResponse } from "next/server";
import { Locale, routing } from "./i18n/routing";
import {
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  authPages,
} from "./routes";

interface AppRouteHandlerFnContext {
  params?: Record<string, string | string[]>;
}

function getLocale(request: NextRequest): string | undefined {
  const customLocale = request.cookies.get("NEXT_LOCALE");
  // 如果cookie中有预设的国际化值，则返回该值
  if (customLocale) {
    return customLocale.value;
  }

  // Negotiator 期望普通对象，需要转换头信息
  const negotiatorHeaders: Record<string, string> = {};

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // 使用 Negotiator 和 intl-locale 匹配器以获取最佳区域设置
  const languages = new Negotiator({ headers: negotiatorHeaders })?.languages();

  let locale = "";

  try {
    locale = matchLocale(languages, locales, defaultLocale);
  } catch (error) {
    locale = defaultLocale;
  }

  return locale;
}

const intlMiddleware = createIntlMiddleware({
  ...routing,
});

const getPathnameRegex = (pages: string[]) =>
  RegExp(
    `^(/(${locales.join("|")}))?(${pages
      .flatMap((p) =>
        p === DEFAULT_LOGIN_REDIRECT ? ["", DEFAULT_LOGIN_REDIRECT] : p
      )
      .join("|")})/?$`,
    "i"
  );

const publicRoutesPathnameRegex = getPathnameRegex(publicRoutes);
const authRoutesPathnameRegex = getPathnameRegex(authPages);

const authMiddleware = (
  request: NextRequest,
  ctx: AppRouteHandlerFnContext
) => {
  return auth((req) => {
    const locale = (getLocale(req) || defaultLocale) as Locale;
    const path = req.nextUrl.pathname;
    const isAuth = req.auth;

    const isPublicPage = publicRoutesPathnameRegex.test(path);
    const isAuthPage = authRoutesPathnameRegex.test(path);

    // 已认证且访问登录页则重定向到指定的页面 例如首页 /
    // if (isAuth && isAuthPage) {
    // const url = req.nextUrl.clone();
    // const fromValue = url.searchParams.get("from");
    // return NextResponse.redirect(new URL(fromValue ?? DEFAULT_LOGIN_REDIRECT, req.nextUrl));
    // }

    // 未认证且访问需要登录的页面则重定向到 /，且携带原本的路径为 from 参数，在登录成功后跳转到原本的页面
    if (!isAuth && !isPublicPage) {
      let from = req.nextUrl.pathname.replace(/^\/(zh|en)/, ""); // 去掉多语言前缀
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(
          DEFAULT_LOGIN_REDIRECT + `?from=${encodeURIComponent(from)}`,
          request.url
        )
      );
    }
    //   const acceptLang = req.headers.get("accept-language");
    //   const defaultLang = "zh-CN";
    //   const siteLocale = acceptLang ? acceptLang.split(",")[0] : defaultLang;

    // 执行了 set-cookie 之后，所有的缓存会被清空
    const response = intlMiddleware(request);
    response.cookies.set("NEXT_LOCALE", locale as string);
    // response.headers.set("x-site-locale", siteLocale);

    return response;
  })(request, ctx);
};

export const middleware = (
  request: NextRequest,
  ctx: AppRouteHandlerFnContext
): NextResponse => {
  if (request.nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  return authMiddleware(request, ctx) as NextResponse;
};

export const config = {
  // 仅匹配国际化路径名
  matcher: [
    // 启用根目录下的匹配语言区域重定向
    "/",
    // 设置一个cookie以记住之前的语言环境，用于所有具有语言环境前缀的请求
    "/(zh|en)/:path*",
    // 启用添加缺失语言的重定向
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico).*)",
  ],
};
