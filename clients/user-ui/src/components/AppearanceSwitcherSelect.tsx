"use client";
import { useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { SunMedium, Moon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import clsx from "clsx";

type Props = {
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function AppearanceSwitcherSelect({ items, label }: Props) {
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateColorScheme = (e: MediaQueryListEvent) => {
    if (isSystemTheme) {
      setTheme(e.matches ? "dark" : "light");
    }
  };

  useEffect(() => {
    // 检测系统外观模式
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (isSystemTheme) {
      setTheme(prefersDarkMode ? "dark" : "light");
    }

    // 监听系统外观模式变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateColorScheme);

    return () => {
      mediaQuery.removeEventListener("change", updateColorScheme);
    };
  }, []);

  const handleAppearanceChange = (value: string) => {
    startTransition(() => {
      if (value === "system") {
        setIsSystemTheme(true);
      } else {
        setIsSystemTheme(false);
      }
      setTheme(value);
    });
  };

  const Trigger = () => {
    return (
      <SelectTrigger
        aria-label={label}
        className={clsx(
          "rounded-sm p-2 transition-colors hover:bg-gray-200 hover:dark:bg-gray-700 border-none bg-transparent",
          isPending && "pointer-events-none opacity-60"
        )}
        showDownIcon={false}
      >
        {theme === "light" ? (
          <SunMedium className="h-6 w-6 transition-colors text-foreground" />
        ) : (
          <Moon className="h-6 w-6 transition-colors text-foreground" />
        )}
      </SelectTrigger>
    );
  };

  return (
    <div className="relative">
      {mounted ? (
        <Select value={theme} onValueChange={handleAppearanceChange}>
          <Trigger />
          <SelectContent align="end">
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        // 占位符
        <div className="rounded-sm p-2 transition-colors hover:bg-accent border-none bg-transparent">
          <SunMedium className="h-6 w-6 transition-colors text-foreground" />
        </div>
      )}
    </div>
  );
}
