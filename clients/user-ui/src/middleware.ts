import { match as matchLocale } from "@formatjs/intl-localematcher";
import createMiddleware from "next-intl/middleware";
import Negotiator from "negotiator";
import { Locale, routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import { defaultLocale, locales } from "./utils/config";

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

export default async function middleware(req: NextRequest) {
  const locale = (getLocale(req) || defaultLocale) as Locale;

  const intlMiddleware = createMiddleware({
    ...routing,
  });
  const response = intlMiddleware(req);

  const acceptLang = req.headers.get("accept-language");
  const defaultLang = "zh-CN";
  const siteLocale = acceptLang ? acceptLang.split(",")[0] : defaultLang;

  // 执行了 set-cookie 之后，所有的缓存会被清空
  response.cookies.set("NEXT_LOCALE", locale as string);
  // response.headers.set("x-site-locale", siteLocale);

  return response;
}

export const config = {
  // 仅匹配国际化路径名
  matcher: [
    // 启用根目录下的匹配语言区域重定向
    "/",
    // 设置一个cookie以记住之前的语言环境，用于所有具有语言环境前缀的请求
    "/(zh|en)/:path*",
    // 启用添加缺失语言的重定向
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
