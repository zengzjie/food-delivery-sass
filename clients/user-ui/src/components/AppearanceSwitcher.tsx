import { useTranslations } from "next-intl";
import AppearanceSwitcherSelect from "./AppearanceSwitcherSelect";

export default function AppearanceSwitcher() {
  const t = useTranslations("AppearanceSwitcher");

  return (
    <AppearanceSwitcherSelect
      items={[
        {
          value: "dark",
          label: t("dark"),
        },
        {
          value: "light",
          label: t("light"),
        },
        {
          value: "system",
          label: t("system"),
        },
      ]}
      label={t("label")}
    />
  );
}
