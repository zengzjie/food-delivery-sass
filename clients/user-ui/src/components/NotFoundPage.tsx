import { getTranslations } from "next-intl/server";

export default async function NotFoundPage() {
  // 异步组件需要使用 getTranslations 来获取翻译
  // https://github.com/vercel/next.js/issues/51477#issuecomment-1883088548
  // https://next-intl.dev/docs/environments/server-client-components#async-components
  const t = await getTranslations("NotFoundPage");
  return (
    <div className="h-screen flex items-center justify-center flex-col text-center Poppins">
      <div>
        <h1 className="inline-block my-0 mr-5 ml-0 py-0 pr-[23px] pl-0 text-2xl/[49px] font-medium align-top border-r border-solid border-white/[0.3]">
          {t("title")}
        </h1>
        <div className="inline-block">
          <h2 className="m-0 text-sm/[49px] font-normal">{t("description")}</h2>
        </div>
      </div>
    </div>
  );
}
