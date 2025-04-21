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
import { useSession } from "next-auth/react";
import { googleLogout } from "@/lib/actions";

interface IProfileDropDown {}

export default function ProfileDropDown(props: IProfileDropDown) {
  const { data: session } = useSession();
  const t = useTranslations("ProfileDropDown");
  const tLogin = useTranslations("LoginModal");
  const tError = useTranslations("ServerErrorPage");
  const user = useUserStore((state) => state.user);
  const [isSigned, setIsSigned] = useState(false);
  const [open, toggle] = useToggle(false);

  const [logoutMutation, { loading: logoutLoading }] =
    useMutation(LOGOUT_MUTATION);

  useEffect(() => {
    console.log("🪪 session", session);
    if (session?.user) {
      setIsSigned(true);
    } else {
      setIsSigned(!!user);
    }
  }, [user, open, session]);

  const handleOpenAuth = () => {
    toggle(true);
  };

  const handleLogOut = async () => {
    if (session?.user) {
      await googleLogout();
      window.location.reload();
    } else {
      const { data } = await logoutMutation();
      if (data.logout.code === 200) {
        toast.success(tLogin("logoutSuccess"));
        window.location.reload();
      } else {
        toast.error(tError("description"));
      }
    }
  };

  return (
    <>
      {isSigned ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="transition-transform w-10 h-10 p-1 cursor-pointer">
              <AvatarImage
                className="rounded-full"
                src={
                  session?.user ? session.user?.image ?? "" : user?.avatar?.url
                }
                alt="@user"
              />
              <AvatarFallback className="text-xs text-foreground bg-gray-200 dark:bg-gray-700">
                CN
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>{t("signedInAs")}</DropdownMenuLabel>
            <DropdownMenuLabel className="font-semibold">
              {session?.user ? session.user.email : user?.email}
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
              className="cursor-pointer focus:text-[#F41F67] focus:bg-[#FDD6E1] hover:bg-[#FDD6E1] dark:focus:text-[#F31260] dark:focus:bg-[#451C2A] dark:hover:bg-[#451C2A]"
            >
              {logoutLoading ? <Loader2 className="animate-spin mr-1" /> : null}
              <LogOut />
              <span>{t("logOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="p-2">
          <UserPlus
            className="cursor-pointer text-foreground"
            onClick={handleOpenAuth}
          />
        </div>
      )}

      {open && <AuthScreen toggleScreen={toggle} />}
    </>
  );
}
