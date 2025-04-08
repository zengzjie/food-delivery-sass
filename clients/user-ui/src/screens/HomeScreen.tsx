"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "../components/Layout/Header";
import useUserInfo, { IUserInfo } from "@/hooks/useUserInfo";

const HomeScreen = () => {
  const { getUserInfo } = useUserInfo();
  const [userInfo, setUserInfo] = useState<IUserInfo>({} as IUserInfo);
  const handleClick = async () => {
    try {
      const resp = await getUserInfo();
      const data = resp.data?.getUserDetail;
      if (data) {
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };
  return (
    <div>
      <Header />
      <Button onClick={handleClick}>🪪 获取用户信息</Button>
      {JSON.stringify(userInfo)}
    </div>
  );
};

export default HomeScreen;
