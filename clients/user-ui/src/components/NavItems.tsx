"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";

const NavItems = ({ activeItem = 0 }: { activeItem?: number }) => {
  const t = useTranslations("NavItems");
  const navItems = [
    {
      title: t("home"),
      url: "/",
    },
    {
      title: t("about us"),
      url: "/about",
    },
    {
      title: t("restaurants"),
      url: "/restaurants",
    },
    {
      title: t("popular Foods"),
      url: "/foods",
    },
    {
      title: t("contact us"),
      url: "/contact",
    },
  ];
  return (
    <div className="break-words flex flex-col md:flex-row items-start md:items-center justify-start flex-wrap gap-4 md:gap-8 pl-4 md:pl-0">
      {navItems.map((item, index) => {
        return (
          <Link
            className={`text-[16px] font-Poppins font-[500] ${
              activeItem === index
                ? "text-primary"
                : "text-muted-foreground"
            } max-[600px]:text-[14px] max-[600px]:font-[400]`}
            key={item.url}
            href={item.url}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
};

export default NavItems;
