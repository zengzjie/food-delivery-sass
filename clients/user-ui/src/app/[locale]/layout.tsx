import { ReactNode } from "react";
import { Poppins, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getTranslations,
  setRequestLocale,
  getMessages,
} from "next-intl/server";
import { Providers } from "@/providers/NextUIProvider";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "./styles.css";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 生成静态参数
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 生成元数据
export async function generateMetadata({ params }: Omit<Props, "children">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<Props>) {
  const { locale } = await params;
  // 确保传入的 `locale` 是有效的
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 启用静态渲染
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      // requestHeaders.get("x-site-locale") ??
      lang={locale}
      suppressHydrationWarning
    >
      <body
        className={`${poppins.variable} ${inter.variable} antialiased flex flex-col h-full`}
      >
        <Providers>
          <NextIntlClientProvider
            messages={messages}
            timeZone="Asia/Shanghai"
            formats={{
              dateTime: {
                short: {
                  dateStyle: "medium",
                  timeStyle: "short",
                  hour12: false,
                  timeZone: "Asia/Shanghai",
                },
                long: {
                  dateStyle: "full",
                  timeStyle: "long",
                  hour12: false,
                  timeZone: "Asia/Shanghai",
                },
              },
            }}
          >
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
