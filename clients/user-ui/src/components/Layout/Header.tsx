"use client";

import styles from "@/utils/styles";
import NavItems from "../NavItems";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "../LocaleSwitcher";
import AppearanceSwitcher from "../AppearanceSwitcher";
import ProfileDropDown from "../ProfileDropDown";

export default function Header() {
  const t = useTranslations("HomePage");
  return (
    <div>
      <header className="w-full">
        <div className="w-[90%] m-auto h-[80px] flex items-center justify-between">
          <h1 className={`${styles.logo}`}>{t("logo")}</h1>
          <NavItems />
          <div className="inline-flex items-center">
            {/* 调整一下这里的布局，在点击后失去 focus 样式生效时被隔壁的遮挡了 */}
            <LocaleSwitcher />
            <AppearanceSwitcher />
            <ProfileDropDown />
          </div>
        </div>
      </header>
    </div>
  );
}
