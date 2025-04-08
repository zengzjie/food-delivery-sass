import * as cookieParser from 'cookie-parser';
import { APP_GUARD } from '@nestjs/core';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

// 模块
import { GraphQLModule } from '@nestjs/graphql';
import { DataLoaderModule } from './dataloader/dataloader.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { PostsModule } from './posts/posts.module';

// 服务
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { PrismaService } from '../../../prisma/prisma.service';
// 解析器
import { UsersResolver } from './users.resolver';
// 守卫
import { JwtAuthGuard } from './guards';
// 数据加载器
import { UserConfigDataLoader } from './dataloader/user-config.dataloader';
// 插件
import { ComplexityPlugin } from './plugins/complexity-plugin';
// import { ResponseFormatterPlugin } from './plugins/response-formatter.plugin';

import { ConfiguredEnv, GraphContextType } from './typing';
import { HTTP_STATUS_MESSAGES, STATUS_CODE } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'}`,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      // 使用 ApolloFederationDriver 驱动，使得该服务可以作为 Apollo Federation 网关的一部分，与其他服务联合起来提供一个统一的 GraphQL API
      driver: ApolloFederationDriver,
      // 配置自动生成 GraphQL 模式文件
      autoSchemaFile: {
        // 用于将多个 GraphQL 服务联合成一个网关
        federation: 2,
      },
      // 给 GraphQL API 添加上下文，在 @Context 装饰器中可以访问到
      context: ({ req, res }: GraphContextType) => ({
        req,
        res,
        userConfigDataLoader: new UserConfigDataLoader(
          new PrismaService(),
        ).generateDataLoader(),
      }),
      // 自定义错误处理
      formatError: (error: GraphQLError) => {
        let graphQLFormattedError = {} as GraphQLFormattedError;
        // 需要处理一下 jwt expired 的错误
        if (
          error.path.includes('refreshToken') &&
          error?.message.includes('jwt expired')
        ) {
          graphQLFormattedError = {
            // message: '登录态已失效，请重新登陆',
            message: 'Login status has expired, please log in again.',
            extensions: {
              code: STATUS_CODE.FORBIDDEN,
            },
          };
        } else {
          const message = (error?.extensions?.originalError as any)?.error
            ? (error?.extensions?.originalError as any)?.message
            : HTTP_STATUS_MESSAGES[error?.extensions?.code as any]
              ? HTTP_STATUS_MESSAGES[error?.extensions?.code as any]
              : HTTP_STATUS_MESSAGES['INTERNAL_SERVER_ERROR'];

          graphQLFormattedError = {
            message,
            extensions: {
              code: STATUS_CODE[error?.extensions?.code as any],
            },
          };
        }
        return graphQLFormattedError;
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<ConfiguredEnv>) => ({
        closeClient: true,
        readyLog: true,
        errorLog: true,
        config: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          password: config.get('REDIS_PASSWORD'),
          db: config.get('REDIS_DB'),
          keyPrefix: config.get('REDIS_PREFIX'),
        },
      }),
      inject: [ConfigService],
    }),
    // 📊 数据加载器模块配置，所有的数据加载器都在这里注册
    DataLoaderModule,
    // 🛡️ 鉴权模块
    AuthModule,
    // 📮 邮箱模块
    EmailModule,

    // 其他关联关系模块
    PostsModule,
  ],
  providers: [
    UsersService,
    ConfigService,
    JwtService,
    PrismaService,
    UsersResolver,
    ComplexityPlugin,
    // ResponseFormatterPlugin,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
