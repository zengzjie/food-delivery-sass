"use client";
import { useEffect, useState } from "react";
import {
  User,
  LogOut,
  ShoppingCart,
  Wallet,
  UserPlus,
  Loader2,
} from "lucide-react";
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
import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "@/graphql/actions/logout.action";
import toast from "react-hot-toast";
import { useUserStore } from "@/stores/userStore";

interface IProfileDropDown {}

export default function ProfileDropDown(props: IProfileDropDown) {
  const t = useTranslations("ProfileDropDown");
  const tLogin = useTranslations("LoginModal");
  const tError = useTranslations("ServerErrorPage");
  const user = useUserStore((state) => state.user);
  const [isSigned, setIsSigned] = useState(false);
  const [open, toggle] = useToggle(false);

  const [logoutMutation, { loading: logoutLoading }] =
    useMutation(LOGOUT_MUTATION);

  useEffect(() => {
    setIsSigned(!!user);
  }, [user, open]);

  const handleOpenAuth = () => {
    toggle(true);
  };

  const handleLogOut = async () => {
    const { data } = await logoutMutation();
    if (data.logout.code === 200) {
      toast.success(tLogin("logoutSuccess"));
      window.location.reload();
    } else {
      toast.error(tError("description"));
    }
  };

  return (
    <>
      {isSigned ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="transition-transform w-7 h-7 ml-2 cursor-pointer">
              <AvatarImage src={user?.avatar?.url} alt="@user" />
              <AvatarFallback className="text-xs">CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>{t("signedInAs")}</DropdownMenuLabel>
            <DropdownMenuLabel className="font-semibold">
              {user?.email}
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
            <DropdownMenuItem
              onClick={handleLogOut}
              className="cursor-pointer focus:text-[#F31260] focus:bg-[#451C2A] hover:bg-[#451C2A]"
            >
              {logoutLoading ? <Loader2 className="animate-spin mr-1" /> : null}
              <LogOut />
              <span>{t("logOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="px-[0.375rem] py-2">
          <UserPlus className="cursor-pointer" onClick={handleOpenAuth} />
        </div>
      )}

      {open && <AuthScreen toggleScreen={toggle} />}
    </>
  );
}
