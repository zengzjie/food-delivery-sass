import FoodBg from "../../../public/food-bg.jpg";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const HomeIntroduction = () => {
  const t = useTranslations("HomeIntroduction");
  return (
    <div className="relative overflow-hidden">
      {/* 背景图层 */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #180f34 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
        {/* <Image
          src={FoodBg}
          alt="Food Delivery Background"
          fill
          className="object-cover opacity-10 mix-blend-multiply"
          priority
        /> */}
      </div>

      {/* 内容区域 */}
      <div className="container relative z-10 mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* 左侧文字介绍 */}
          <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="block text-orange-400 mb-2">
                {t("mainTitle")}
              </span>
              <span className="block text-foreground">{t("subTitle")}</span>
            </h1>
            <p className="mx-auto lg:mx-0 max-w-md text-lg sm:text-xl text-secondary-foreground">
              {t("desc")}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-foreground hover:text-destructive-foreground"
              >
                {t("orderNow")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-foreground hover:bg-white/10 hover:text-white"
              >
                {t("learnMore")}
              </Button>
            </div>

            {/* 统计数据 - 移动端显示为行，小屏幕显示为网格 */}
            <div className="pt-6 sm:pt-8">
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center sm:text-start">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    500+
                  </p>
                  <p className="text-xs sm:text-sm text-secondary-foreground">
                    {t("cooperativeRestaurants")}
                  </p>
                </div>
                <div className="text-center sm:text-start">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    15{t("minutes")}
                  </p>
                  <p className="text-xs sm:text-sm text-secondary-foreground">
                    {t("averageDeliveryTime")}
                  </p>
                </div>
                <div className="text-center sm:text-start">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    4.9
                  </p>
                  <p className="text-xs sm:text-sm text-secondary-foreground">
                    {t("userRating")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧图像 - 移动端优化 */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none">
            <div className="relative aspect-square w-full overflow-hidden rounded-full bg-orange-100/10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 to-red-500/20 backdrop-blur-sm" />
              <Image
                src={FoodBg}
                alt="Delicacy display"
                width={600}
                height={600}
                className="relative z-10 w-full h-full rounded-full aspect-square object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeIntroduction;
