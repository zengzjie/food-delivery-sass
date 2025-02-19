import en from "./messages/en.json";
import { getLocaleFormats } from "./src/i18n/request";
import * as SelectPrimitive from "@radix-ui/react-select";

type Formats = ReturnType<typeof getLocaleFormats> extends Promise<infer T>
  ? T
  : never;

type Messages = typeof en;

declare global {
  // 使用 `next-intl` 与类型安全的 Key
  interface IntlMessages extends Messages {}
  interface IntlFormats extends Formats {}
}

declare module "@radix-ui/react-select" {
  interface SelectTriggerProps
    extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
    showDownIcon?: boolean;
  }
}
