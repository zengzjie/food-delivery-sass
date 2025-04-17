import React from "react";
import { setRequestLocale } from "next-intl/server";
import HomeScreen from "@/screens/HomeScreen";

type Props = {
  params: { locale: string };
};

const DashboardPage = async ({ params }: Props) => {
  const { locale } = await params;

  // 启用静态渲染
  setRequestLocale(locale);
  return (
    <div>
      <HomeScreen />
      <h1>Dashboard</h1>
    </div>
  );
};

export default DashboardPage;
