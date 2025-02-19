"use client";

import { useTranslations } from "next-intl";

type Props = {
  error: Error;
  reset(): void;
};

export default function Error({ error, reset }: Props) {
  const t = useTranslations("Error");

  return (
    <div>
      {t.rich("description", {
        div: (chunks) => <div className="w-full h-screen flex flex-col justify-center items-center">{chunks}</div>,
        p: (chunks) => <p className="mt-4">{chunks}</p>,
        retry: (chunks) => (
          <button
            className="text-[#0068ff] underline underline-offset-2"
            onClick={reset}
            type="button"
          >
            {chunks}
          </button>
        ),
      })}
    </div>
  );
}
