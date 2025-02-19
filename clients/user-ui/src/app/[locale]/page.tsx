import React from "react";
import HomeScreen from "@/screens/HomeScreen";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;
  // 启用静态渲染
  setRequestLocale(locale);
  return (
    <div>
      <HomeScreen />
    </div>
  );
};

export default Page;
