export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${port}`;

export const locales = ["zh", "en"] as const;

export const defaultLocale: (typeof locales)[number] = "zh";

export const localePrefix =
  process.env.NEXT_PUBLIC_LOCALE_PREFIX === "never" ? "never" : "as-needed";

export const pathnames = {
  "/": "/",
  // "/pathnames": {
  //   en: "/path",
  //   zh: "/",
  // },
};
