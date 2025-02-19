import React from "react";
import { getFormatter, setRequestLocale } from "next-intl/server";
import HomeScreen from "@/screens/HomeScreen";

type Props = {
  params: { locale: string };
};

const PathnamesPage = async ({ params }: Props) => {
  const { locale } = await params;
  const format = await getFormatter();

  const formattedDate = format.dateTime(new Date(), "short");
  const formattedNumber = format.number(47.414329182, "currency");
  const formattedList = format.list(
    ["HTML", "CSS", "JavaScript"],
    "enumeration"
  );
  console.log(formattedDate, formattedNumber, formattedList);

  // 启用静态渲染
  setRequestLocale(locale);
  return (
    <div>
      <HomeScreen />
    </div>
  );
};

export default PathnamesPage;
