"use client";
import { useState } from "react";
import { User, LogOut, ShoppingCart, Wallet, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToggle } from "react-use";
import AuthScreen from "../screens/AuthScreen";
import { useTranslations } from "next-intl";

export default function ProfileDropDown() {
  const t = useTranslations("ProfileDropDown");
  const [isSigned, setIsSigned] = useState(false);
  const [open, toggle] = useToggle(false);
  const handleOpenAuth = () => {
    toggle(true);
  };
  return (
    <div>
      {isSigned ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="transition-transform w-6 h-6">
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback className="text-xs">CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>{t("signedInAs")}</DropdownMenuLabel>
            <DropdownMenuLabel className="font-semibold">
              zijieziyin@gmail.com
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <User />
                <span>{t("myProfile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ShoppingCart />
                <span>{t("allOrders")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Wallet />
                <span>{t("applyForSellerAccount")}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer focus:text-danger focus:bg-danger/20 data-[hover:bg-danger/20]">
              <LogOut />
              <span>{t("logOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="p-2">
          <UserPlus className="cursor-pointer" onClick={handleOpenAuth} />
        </div>
      )}

      {open && <AuthScreen toggleScreen={toggle} />}
    </div>
  );
}
