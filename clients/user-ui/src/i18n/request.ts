import { Formats } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export const getLocaleFormats = async (locale?: string) => {
  return {
    dateTime: {
      short:
        locale === "zh"
          ? {
              year: "numeric", // 年份
              month: "2-digit", // 月份（2位数）
              day: "2-digit", // 日期（2位数）
              hour: "2-digit", // 小时（2位数）
              minute: "2-digit", // 分钟（2位数）
              second: "2-digit", // 秒数（2位数）
              hour12: false, // 24小时制
              formatMatcher: "basic",
            }
          : {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              formatMatcher: "basic",
            },
      long:
        locale === "zh"
          ? {
              dateStyle: "full", // 完整的日期格式（如：星期二，2025年2月19日）
              timeStyle: "medium", // 完整的时间格式（如：上午11:20:00）
              hour12: false,
            }
          : {
              dateStyle: "full",
              timeStyle: "medium",
              hour12: true,
            },
    },
    number: {
      precise: {
        maximumFractionDigits: 2,
      },
      currency: {
        style: "currency",
        currency: locale === "zh" ? "CNY" : "USD",
      },
    },
    list: {
      enumeration: {
        style: "narrow",
        type: "conjunction",
      },
    },
  } satisfies Formats;
};

export default getRequestConfig(async ({ requestLocale }) => {
  // 对应于 `[locale]` 字段的值
  let locale = await requestLocale;

  // 确保使用有效的区域设置
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  console.log("locale => ", locale);

  try {
    // headers().get('x-time-zone') ?? "Asia/Shanghai"
    const timeZone = locale === "zh" ? "Asia/Shanghai" : "America/Los_Angeles";
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return {
      locale,
      messages,
      timeZone,
      formats: await getLocaleFormats(locale),
      onError(error) {
        if (
          error.message ===
          (process.env.NODE_ENV === "production"
            ? "MISSING_MESSAGE"
            : "MISSING_MESSAGE: Could not resolve `missing` in `Index`.")
        ) {
          // Do nothing, this error is triggered on purpose
        } else {
          console.error(JSON.stringify(error.message));
        }
      },
      getMessageFallback({ key, namespace }) {
        console.log("✅ => ", key, namespace);

        return (
          "`getMessageFallback` called for " +
          [namespace, key].filter((part) => part != null).join(".")
        );
      },
    };
  } catch (error) {
    throw error;
  }
});
