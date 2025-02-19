import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * 用于建立与数据库的连接
 * 创建一个新的应用 PrismaService 程序来负责实例化 PrismaClient 和连接到数据库
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  // 应用销毁关闭数据库连接
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
