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
    <div className="break-words flex items-center justify-start flex-wrap gap-8 min-[900px]:pl-0 pl-2 max-[900px]:gap-4 max-[765px]:gap-2">
      {navItems.map((item, index) => {
        return (
          <Link
            className={`text-[16px] font-Poppins font-[500] ${
              activeItem === index && "text-[#37b668]"
            }`}
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
