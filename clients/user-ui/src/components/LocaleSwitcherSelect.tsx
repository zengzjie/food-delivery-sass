"use client";

import { Languages } from "lucide-react";
import { useTransition } from "react";
import { Locale, usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
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

export default function LocaleSwitcherSelect({ items, label }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLocaleChange = (value: string) => {
    startTransition(() => {
      router.replace(pathname, {
        locale: value as Locale,
      });
    });
  };

  return (
    <div className="relative pr-1">
      <Select value={locale} onValueChange={handleLocaleChange}>
        <SelectTrigger
          aria-label={label}
          className={clsx(
            "rounded-sm p-2 transition-colors hover:bg-accent border-none bg-transparent",
            isPending && "pointer-events-none opacity-60"
          )}
          showDownIcon={false}
        >
          <Languages className="h-6 w-6 transition-colors text-foreground" />
        </SelectTrigger>
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
    </div>
  );
}
