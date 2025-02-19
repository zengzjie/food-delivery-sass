import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import {
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
} from "../utils/config";

export const routing = defineRouting({
  // 支持的所有区域列表
  locales,
  // 用于无匹配区域时
  defaultLocale,
  // 区域前缀
  localePrefix,
  // 路径名列表
  pathnames,
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
