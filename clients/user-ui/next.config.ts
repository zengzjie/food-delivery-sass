import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // 启动实验性编辑器
    reactCompiler: true,
    // 启用局部渲染优化
    // ppr: "incremental",
  },
};

export default withNextIntl(nextConfig);
