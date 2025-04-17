import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcryptJs from "bcryptjs";

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

/**
 * @description: 自定义 Prisma 适配器，用于扩展默认的适配器功能
 * @param {any} prisma
 * @return {*}
 */
const CustomPrismaAdapter = (prisma: any) => {
  const adapter = PrismaAdapter(prisma);
  return {
    ...adapter,
    // 重写 createUser 方法，在创建用户时生成随机密码并关联头像
    createUser: async (user: any) => {
      const encryptPassword = await bcryptJs.hash(generateRandomPassword(), 10);
      const createdUser = await prisma.user.create({
        data: {
          name: user.name || "Anonymous", // 如果没有 name，设置默认值
          email: user.email,
          password: encryptPassword,
          avatar: {
            create: {
              url: user.image, // Google 返回的头像 URL
              public_id: `google_${user.id}`,
            },
          },
        },
        include: {
          avatar: true,
        },
      });
      return createdUser;
    },
  };
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: CustomPrismaAdapter(prisma) as any,
  ...authConfig,
});
