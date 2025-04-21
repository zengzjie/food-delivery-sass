"use client";

import logo from "../../../public/logo.png";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import NavItems from "../NavItems";
import LocaleSwitcher from "../LocaleSwitcher";
import AppearanceSwitcher from "../AppearanceSwitcher";
import ProfileDropDown from "../ProfileDropDown";
import { useUserStore } from "@/stores/userStore";
import useUserInfo from "@/hooks/useUserInfo";
import { useMount } from "react-use";
import Cookies from "js-cookie";
import { useState } from "react";
import { Settings, UserPlus } from "lucide-react";
import AuthScreen from "@/screens/AuthScreen";

export default function Header() {
  const initUser = useUserStore((state) => state.initUser);
  const { getUserInfo } = useUserInfo();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpenAuth, setIsOpenAuth] = useState(false);

  useMount(async () => {
    const authorization = Cookies.get("Authorization");
    if (authorization) {
      try {
        const resp = await getUserInfo();
        const data = resp.data?.getUserDetail;
        if (data) {
          initUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }
  });

  return (
    <header className="sticky top-0 z-[50] w-full shadow-md bg-primary-foreground/50 text-primary-foreground border-b border-secondary backdrop-blur-md backdrop-brightness-110">
      <div className="w-[90%] m-auto h-[50px] flex items-center justify-between">
        {/* 左侧 Logo */}
        <Image src={logo} alt="Logo" width={40} height={40} />
        {/* 中间 NavItems */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavItems />
        </div>
        {/* 右侧 Tool */}
        <div className="hidden md:flex items-center gap-2">
          <LocaleSwitcher />
          <AppearanceSwitcher />
          <ProfileDropDown />
        </div>
        {/* 移动端菜单按钮和设置按钮 */}
        <div className="flex md:hidden items-center gap-4">
          <button
            className="text-[24px] text-primary"
            onClick={() => {
              setIsNavOpen(!isNavOpen);
              if (isSettingsOpen) setIsSettingsOpen(false);
            }}
          >
            ☰
          </button>
          <DropdownMenu modal={false} open={isSettingsOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="text-[20px] text-primary"
                onClick={() => {
                  if (isNavOpen) setIsNavOpen(false);
                  setIsSettingsOpen(!isSettingsOpen);
                }}
              >
                <Settings className="h-6 w-6 transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className="min-w-10" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <LocaleSwitcher />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <AppearanceSwitcher />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => {
                    setIsSettingsOpen(false);
                    setIsOpenAuth(true);
                  }}
                >
                  <div className="flex items-center w-full mt-2">
                    <div className="px-2 py-2">
                      <UserPlus className="cursor-pointer" />
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </div>
      {/* 移动端下的菜单 */}
      {isNavOpen && (
        <div className="absolute top-[79px] left-0 w-full z-10 flex flex-col items-start p-4 bg-secondary/50 text-secondary-foreground backdrop-blur-lg backdrop-brightness-110">
          <NavItems />
        </div>
      )}
      {isOpenAuth && <AuthScreen toggleScreen={setIsOpenAuth} />}
    </header>
  );
}
